# Farmers Knowledge Hub + Ollama Chatbot Integration Guide

## Overview

The Farmers Knowledge Hub is a comprehensive agricultural information platform that provides farmers with:
- Real-time agricultural articles from trusted sources (FAO, Agrilinks, Kenyan Ministry of Agriculture)
- Local offline-capable chatbot powered by Ollama
- Searchable and filterable knowledge base
- Beautiful UI with local images

## Features Implemented

### 1. Knowledge Hub Page (`/dashboard/farmers/knowledge`)

**Features:**
- ✅ Displays curated farming articles in responsive card layout
- ✅ Article cards include:
  - Local images from `/public/images/knowledge/`
  - Article title, excerpt, source, and date
  - Category badges
  - "Read More" button
- ✅ Category filtering (Sustainable Farming, Crop Diseases, Climate-Smart, Irrigation, Market Trends)
- ✅ Search functionality
- ✅ Pagination-ready design
- ✅ Article modal with "Ask Chatbot About This" integration

**Local Images Available:**
- irrigation-tips.jpg
- maize-care.jpg
- greenhouse.jpg
- composting.jpg
- pest-control.jpg
- crop-rotation.jpg
- soil-health.jpg
- water-conservation.jpg
- organic-farming.jpg
- climate-smart.jpg
- market-trends.jpg
- livestock-care.jpg
- sustainable-farming.jpg
- crop-diseases.jpg
- fertilizer-use.jpg

### 2. Article Fetching System

**Data Sources:**
- FAO RSS Feed: `https://www.fao.org/rss-feed/en/`
- Agrilinks RSS: `https://agrilinks.org/rss.xml`

**Implementation Details:**
- Server-side fetching via `/api/knowledge/articles`
- 24-hour caching to reduce API requests
- Automatic fallback to local `data/articles.json` if feeds unavailable
- Smart categorization based on article content
- Random local image assignment when no image available from source

### 3. Ollama Chatbot Integration

**Chatbot Page:** `/dashboard/farmers/knowledge/chat`

**Features:**
- ✅ Natural language Q&A interface
- ✅ Context-aware conversations (remembers last 5 messages)
- ✅ Markdown support for formatted responses
- ✅ Loading animations
- ✅ Chat history persistence (session storage)
- ✅ Suggested questions for new users
- ✅ Integration with article context (from "Ask Chatbot About This")

**Ollama Configuration:**
- API Endpoint: `http://localhost:11434/api/generate`
- Default Model: `llama3` (also supports `mistral`, `phi3`)
- System Prompt: Optimized for Kenyan agricultural advice
- Fallback Responses: Built-in responses when Ollama unavailable

### 4. Navigation Integration

Added "Knowledge Hub" button to Farmers Dashboard header for easy access.

## Installation & Setup

### 1. Install Dependencies

```bash
npm install rss-parser
```

### 2. Create Knowledge Hub Images

Run the PowerShell script to generate placeholder images:

```bash
powershell -ExecutionPolicy Bypass -File scripts/create-knowledge-images.ps1
```

### 3. Install Ollama (Optional but Recommended)

**For Windows:**
1. Download from https://ollama.ai
2. Install the application
3. Open terminal and run:
```bash
ollama pull llama3
# or
ollama pull mistral
# or
ollama pull phi3
```

**Start Ollama Service:**
```bash
ollama serve
```

### 4. Verify Setup

Start the development server:
```bash
npm run dev
```

Navigate to:
1. `http://localhost:3000/dashboard/farmers` - Check for "Knowledge Hub" button
2. `http://localhost:3000/dashboard/farmers/knowledge` - View articles
3. `http://localhost:3000/dashboard/farmers/knowledge/chat` - Test chatbot

## Testing Checklist

### Knowledge Hub Articles Testing

- [ ] Navigate to `/dashboard/farmers/knowledge`
- [ ] Verify at least 12 articles load (fallback articles)
- [ ] Check each article card displays:
  - [ ] Local image
  - [ ] Title
  - [ ] Excerpt/description
  - [ ] Category badge
  - [ ] Source name
  - [ ] Publication date
  - [ ] "Read More" button
- [ ] Test category filter dropdown
- [ ] Test search functionality with keywords
- [ ] Click "Read More" to open article modal
- [ ] Verify modal shows:
  - [ ] Article image
  - [ ] Full title and metadata
  - [ ] Description
  - [ ] "Open Full Article" button (external link)
  - [ ] "Ask Chatbot About This" button
  - [ ] Close button

### Chatbot Testing

#### Without Ollama (Fallback Mode)
- [ ] Navigate to `/dashboard/farmers/knowledge/chat`
- [ ] Interface loads correctly
- [ ] Try suggested questions
- [ ] Ask: "How can I prevent maize blight?"
  - [ ] Should receive detailed fallback response
- [ ] Ask: "What are the best irrigation methods?"
  - [ ] Should receive irrigation tips
- [ ] Verify warning message about Ollama not being available

#### With Ollama (Full Mode)
- [ ] Ensure Ollama is running: `ollama serve`
- [ ] Navigate to chatbot page
- [ ] Ask: "How can I prevent maize blight?"
  - [ ] Should receive AI-generated response
  - [ ] Response should be farming-relevant
- [ ] Ask follow-up question
  - [ ] Verify context is maintained
- [ ] Test various farming topics:
  - [ ] Pest control
  - [ ] Soil fertility
  - [ ] Market prices
  - [ ] Crop diseases
  - [ ] Irrigation methods

#### Article-to-Chat Integration
- [ ] From Knowledge Hub, click "Read More" on any article
- [ ] Click "Ask Chatbot About This" in modal
- [ ] Verify chatbot opens with pre-filled question about the article
- [ ] Send the question and verify relevant response

### Chat Features Testing
- [ ] Send multiple messages
- [ ] Verify messages appear in correct order
- [ ] Check timestamps display correctly
- [ ] Test "Clear Chat" button
- [ ] Reload page - verify last 10 messages persist
- [ ] Test markdown rendering in bot responses (lists, bold, etc.)

## API Endpoints

### GET `/api/knowledge/articles`

Fetches agricultural articles from RSS feeds or fallback.

**Query Parameters:**
- `category` (optional): Filter by category
- `search` (optional): Search in title/description

**Response:**
```json
{
  "success": true,
  "articles": [
    {
      "id": "1",
      "title": "Article Title",
      "description": "Article description...",
      "link": "https://example.com/article",
      "category": "Sustainable Farming",
      "source": "FAO",
      "pubDate": "2025-10-01T10:00:00Z",
      "image": "/images/knowledge/sustainable-farming.jpg"
    }
  ],
  "total": 12,
  "fallback": false
}
```

### POST `/api/knowledge/chat`

Sends a message to the Ollama chatbot.

**Request Body:**
```json
{
  "message": "How can I prevent maize blight?",
  "history": [
    {
      "role": "user",
      "content": "Previous message"
    },
    {
      "role": "assistant",
      "content": "Previous response"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "response": "AI-generated response...",
  "model": "llama3",
  "warning": "Optional warning message"
}
```

## File Structure

```
umojaHub/
├── public/
│   └── images/
│       └── knowledge/              # Local knowledge hub images
│           ├── irrigation-tips.jpg
│           ├── maize-care.jpg
│           ├── greenhouse.jpg
│           └── ... (15 images total)
├── data/
│   ├── articles.json               # Fallback articles data
│   └── articles-cache.json         # Generated cache file (24hr)
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── knowledge/
│   │   │       ├── articles/
│   │   │       │   └── route.ts    # Articles fetching API
│   │   │       └── chat/
│   │   │           └── route.ts    # Ollama chatbot API
│   │   └── dashboard/
│   │       └── farmers/
│   │           ├── page.tsx        # Updated with Knowledge Hub link
│   │           └── knowledge/
│   │               ├── page.tsx    # Knowledge Hub main page
│   │               └── chat/
│   │                   └── page.tsx # Chatbot interface
└── scripts/
    └── create-knowledge-images.ps1 # Image generation script
```

## Troubleshooting

### Articles Not Loading

**Problem:** No articles display on Knowledge Hub page

**Solutions:**
1. Check browser console for errors
2. Verify `/api/knowledge/articles` endpoint returns data
3. Check `data/articles.json` exists with fallback data
4. Clear cache: Delete `data/articles-cache.json` if exists

### Chatbot Not Responding

**Problem:** Chatbot shows errors or no response

**Solutions:**
1. **If Ollama is installed:**
   - Verify Ollama is running: Open terminal, run `ollama serve`
   - Check if model is downloaded: `ollama list`
   - If not, pull model: `ollama pull llama3`
   - Verify API is accessible: Visit `http://localhost:11434` in browser

2. **Without Ollama:**
   - Chatbot will use fallback responses
   - Check for specific keyword-based responses
   - Warning message should appear indicating Ollama unavailable

### Images Not Displaying

**Problem:** Article images show broken/missing

**Solutions:**
1. Run image generation script:
   ```bash
   powershell -ExecutionPolicy Bypass -File scripts/create-knowledge-images.ps1
   ```
2. Verify images exist in `public/images/knowledge/`
3. Check browser console for 404 errors
4. Fallback image should load: `/images/knowledge/sustainable-farming.jpg`

### Cache Issues

**Problem:** Old articles still showing after feed updates

**Solutions:**
1. Delete cache file: `data/articles-cache.json`
2. Refresh the Knowledge Hub page
3. New articles will be fetched and cached
4. Cache automatically refreshes every 24 hours

## Advanced Configuration

### Changing Ollama Model

Edit `src/app/api/knowledge/chat/route.ts`:

```typescript
const DEFAULT_MODEL = 'llama3'; // Change to 'mistral' or 'phi3'
```

### Adding More RSS Feeds

Edit `src/app/api/knowledge/articles/route.ts`:

```typescript
const RSS_FEEDS = [
  {
    url: 'https://www.fao.org/rss-feed/en/',
    source: 'FAO',
    category: 'General',
  },
  {
    url: 'https://agrilinks.org/rss.xml',
    source: 'Agrilinks',
    category: 'General',
  },
  // Add your feed here:
  {
    url: 'https://your-feed-url.com/rss',
    source: 'Your Source',
    category: 'General',
  },
];
```

### Customizing System Prompt

Edit the chatbot's behavior in `src/app/api/knowledge/chat/route.ts`:

```typescript
const SYSTEM_PROMPT = `You are a helpful agricultural advisor...`;
```

### Adjusting Cache Duration

Change cache expiration time in `src/app/api/knowledge/articles/route.ts`:

```typescript
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours (in milliseconds)
// Change to: 12 * 60 * 60 * 1000 for 12 hours
// Change to: 6 * 60 * 60 * 1000 for 6 hours
```

## Best Practices

### For Farmers Using the Platform

1. **Daily Reading:** Check Knowledge Hub daily for new articles
2. **Use Search:** Find specific topics quickly with search bar
3. **Category Filtering:** Browse by relevant categories
4. **Ask Questions:** Use chatbot for personalized advice
5. **Context Matters:** Click "Ask Chatbot About This" from articles for context-aware responses

### For Developers/Administrators

1. **Monitor RSS Feeds:** Ensure feed URLs remain accessible
2. **Update Fallback Data:** Periodically update `data/articles.json` with fresh content
3. **Ollama Maintenance:** Keep Ollama models updated
4. **Cache Management:** Monitor cache file size and clear periodically if needed
5. **User Feedback:** Collect feedback to improve article selection and chatbot responses

## Performance Considerations

- **Caching:** 24-hour cache significantly reduces RSS feed requests
- **Local Images:** All images served from local storage (no external dependencies)
- **Fallback System:** Ensures platform works even without internet
- **Session Storage:** Chat history limited to last 10 messages
- **Context Window:** Only last 5 messages sent to Ollama for efficiency

## Security Notes

- RSS feeds fetched server-side only
- No API keys required (Ollama runs locally)
- Chat history stored client-side only (session storage)
- All external article links open in new tab with security attributes

## Future Enhancements

Potential improvements for future versions:

1. **Multi-language Support:** Swahili translations
2. **Voice Input:** Voice-to-text for chatbot
3. **Offline Mode:** Full Progressive Web App support
4. **Bookmarks:** Save favorite articles
5. **Notifications:** Push notifications for new articles
6. **Community:** Comment section for article discussions
7. **Analytics:** Track popular articles and common questions
8. **Video Integration:** Embed agricultural tutorial videos
9. **Weather Integration:** Local weather data and farming calendar
10. **Market Integration:** Live crop price updates

## Support

For issues or questions:
1. Check this guide's troubleshooting section
2. Review browser console for error messages
3. Verify all dependencies are installed
4. Ensure Ollama is properly configured (if using chatbot)
5. Check that all required files exist in correct locations

## Summary

The Farmers Knowledge Hub successfully integrates:
- ✅ Real-time article fetching with caching
- ✅ Local image storage for offline capability
- ✅ Ollama-powered chatbot with fallback support
- ✅ Responsive, user-friendly interface
- ✅ Search and filter functionality
- ✅ Seamless article-to-chat integration
- ✅ No external API costs (everything runs locally)

Farmers can now access agricultural knowledge and get personalized advice without relying on expensive cloud AI services!
