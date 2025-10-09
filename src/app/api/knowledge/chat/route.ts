import { NextResponse } from 'next/server';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface OllamaRequest {
  model: string;
  prompt: string;
  stream: boolean;
  context?: number[];
}

interface OllamaResponse {
  model: string;
  response: string;
  done: boolean;
  context?: number[];
}

const OLLAMA_API_URL = 'http://localhost:11434/api/generate';
const DEFAULT_MODEL = 'llama3'; // Can also be 'mistral' or 'phi3'

// System prompt to guide the AI's responses
const SYSTEM_PROMPT = `You are a helpful agricultural advisor for Kenyan farmers. Provide practical, accurate farming advice on topics like:
- Crop cultivation and care
- Pest and disease management
- Soil health and fertilization
- Irrigation and water management
- Sustainable farming practices
- Market trends and pricing
- Climate-smart agriculture

Keep responses concise, practical, and relevant to small-scale farming in Kenya and East Africa. Use simple language and provide actionable advice.`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, history = [] } = body as {
      message: string;
      history?: ChatMessage[];
    };

    if (!message || message.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      );
    }

    // Build conversation context
    let fullPrompt = SYSTEM_PROMPT + '\n\n';
    
    // Add conversation history (last 5 messages)
    const recentHistory = history.slice(-5);
    for (const msg of recentHistory) {
      if (msg.role === 'user') {
        fullPrompt += `Farmer: ${msg.content}\n`;
      } else {
        fullPrompt += `Advisor: ${msg.content}\n`;
      }
    }
    
    // Add current message
    fullPrompt += `Farmer: ${message}\nAdvisor:`;

    // Check if Ollama is available
    try {
      const ollamaRequest: OllamaRequest = {
        model: DEFAULT_MODEL,
        prompt: fullPrompt,
        stream: false,
      };

      const ollamaResponse = await fetch(OLLAMA_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ollamaRequest),
        signal: AbortSignal.timeout(30000), // 30 second timeout
      });

      if (!ollamaResponse.ok) {
        throw new Error(`Ollama API returned ${ollamaResponse.status}`);
      }

      const data: OllamaResponse = await ollamaResponse.json();

      return NextResponse.json({
        success: true,
        response: data.response.trim(),
        model: data.model,
      });
    } catch (ollamaError) {
      console.error('Ollama error:', ollamaError);

      // Provide fallback response when Ollama is unavailable
      const fallbackResponse = getFallbackResponse(message);

      return NextResponse.json({
        success: true,
        response: fallbackResponse,
        model: 'fallback',
        warning: 'Ollama is not available. Using fallback responses. Please ensure Ollama is running locally.',
      });
    }
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process chat message',
      },
      { status: 500 }
    );
  }
}

// Fallback responses when Ollama is not available
function getFallbackResponse(message: string): string {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('maize') || lowerMessage.includes('corn')) {
    return `For maize cultivation in Kenya:

1. **Planting**: Plant at the onset of rains (March-April or October-November). Space rows 75cm apart, plants 25cm within rows.

2. **Fertilizer**: Apply DAP (50kg/acre) at planting and top-dress with CAN (50kg/acre) 3-4 weeks later.

3. **Pest Control**: Watch for fall armyworm and stalk borers. Use integrated pest management including crop rotation and resistant varieties.

4. **Water**: Maize needs consistent moisture, especially during flowering and grain filling. Irrigate if rainfall is inadequate.

5. **Harvest**: Harvest when kernels are hard and moisture content is 18-20% for storage.

For more specific advice, please ensure Ollama is running on your system.`;
  }

  if (lowerMessage.includes('irrigation') || lowerMessage.includes('water')) {
    return `Water Management Tips:

1. **Drip Irrigation**: Most efficient for small plots. Delivers water directly to roots, reducing waste by 50%.

2. **Rainwater Harvesting**: Collect roof runoff in tanks for dry season use.

3. **Mulching**: Apply organic mulch to retain soil moisture and reduce evaporation.

4. **Timing**: Water early morning or evening to minimize evaporation losses.

5. **Monitoring**: Check soil moisture regularly. Most crops need 1-2 inches of water per week.

For detailed irrigation planning specific to your crops, please ensure Ollama is running locally.`;
  }

  if (lowerMessage.includes('pest') || lowerMessage.includes('disease')) {
    return `Integrated Pest Management:

1. **Prevention**: Use certified seeds, practice crop rotation, maintain field hygiene.

2. **Monitoring**: Scout fields regularly to detect pests early.

3. **Cultural Control**: Remove infected plants, use resistant varieties, proper spacing for air circulation.

4. **Biological Control**: Encourage natural predators, use bio-pesticides when available.

5. **Chemical Control**: Use approved pesticides as last resort, follow label instructions carefully.

6. **Record Keeping**: Track pest occurrences to predict and prevent future outbreaks.

For specific pest identification and treatment, please ensure Ollama is running on your system.`;
  }

  if (lowerMessage.includes('market') || lowerMessage.includes('price')) {
    return `Market Access & Pricing:

1. **Timing**: Track seasonal prices. Some crops fetch premium prices during off-season.

2. **Quality**: Grade and sort produce properly. Better quality commands higher prices.

3. **Direct Sales**: Consider farmer markets and cooperatives to reduce middlemen.

4. **Value Addition**: Processing (drying, packaging) can increase product value.

5. **Market Information**: Check Ministry of Agriculture market reports for current prices.

6. **Contracts**: Explore contract farming opportunities for stable prices.

For real-time market analysis, please ensure Ollama is running locally.`;
  }

  // Generic response
  return `Thank you for your question about farming.

**To get detailed, personalized advice**, please ensure Ollama is installed and running on your system:

1. Install Ollama from https://ollama.ai
2. Run: \`ollama pull llama3\` (or mistral/phi3)
3. Start Ollama service
4. Try your question again

**Meanwhile**, you can:
- Browse the Knowledge Hub articles for farming information
- Check specific categories: Irrigation, Pest Control, Sustainable Farming, Market Trends
- Search for topics relevant to your question

I'm here to help with any farming-related questions once Ollama is running!`;
}
