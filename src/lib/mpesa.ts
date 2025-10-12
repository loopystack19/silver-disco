/**
 * M-Pesa Integration Utility Functions
 * Handles OAuth token generation and STK Push requests for Lipa Na M-Pesa Online
 */

// M-Pesa API endpoints
const MPESA_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://api.safaricom.co.ke'
  : 'https://sandbox.safaricom.co.ke';

const OAUTH_URL = `${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`;
const STK_PUSH_URL = `${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`;

/**
 * Generate OAuth token for M-Pesa API authentication
 * @returns Access token string
 */
export async function generateMpesaToken(): Promise<string> {
  try {
    const consumerKey = process.env.MPESA_CONSUMER_KEY;
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET;

    if (!consumerKey || !consumerSecret) {
      throw new Error('M-Pesa credentials not configured');
    }

    // Create base64 encoded credentials
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

    const response = await fetch(OAUTH_URL, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`M-Pesa OAuth failed: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error generating M-Pesa token:', error);
    throw error;
  }
}

/**
 * Generate password for STK Push request
 * Password = Base64(Shortcode + Passkey + Timestamp)
 */
export function generatePassword(shortcode: string, passkey: string, timestamp: string): string {
  const data = shortcode + passkey + timestamp;
  return Buffer.from(data).toString('base64');
}

/**
 * Generate timestamp in M-Pesa format (YYYYMMDDHHmmss)
 */
export function generateTimestamp(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

/**
 * Format phone number to required format (254XXXXXXXXX)
 * Accepts: +254XXXXXXXXX, 254XXXXXXXXX, 07XXXXXXXX, 7XXXXXXXX
 */
export function formatPhoneNumber(phone: string): string {
  // Remove spaces and special characters
  let cleaned = phone.replace(/[\s\-\(\)]/g, '');

  // Remove leading + if present
  if (cleaned.startsWith('+')) {
    cleaned = cleaned.substring(1);
  }

  // If starts with 0, replace with 254
  if (cleaned.startsWith('0')) {
    cleaned = '254' + cleaned.substring(1);
  }

  // If doesn't start with 254, add it
  if (!cleaned.startsWith('254')) {
    cleaned = '254' + cleaned;
  }

  return cleaned;
}

/**
 * Validate Kenyan phone number
 * Valid formats: +254XXXXXXXXX, 254XXXXXXXXX, 07XXXXXXXX, 7XXXXXXXX
 */
export function isValidKenyanPhone(phone: string): boolean {
  const formatted = formatPhoneNumber(phone);

  // Should be 254 followed by 9 digits (7XX, 1XX, etc.)
  const kenyanPhoneRegex = /^254[71]\d{8}$/;
  return kenyanPhoneRegex.test(formatted);
}

export interface STKPushRequest {
  phoneNumber: string;
  amount: number;
  accountReference: string;
  transactionDesc: string;
}

export interface STKPushResponse {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage: string;
}

/**
 * Initiate STK Push (Lipa Na M-Pesa Online Payment)
 * @param request Payment request details
 * @returns STK Push response
 */
export async function initiateSTKPush(request: STKPushRequest): Promise<STKPushResponse> {
  try {
    const shortcode = process.env.MPESA_SHORTCODE;
    const passkey = process.env.MPESA_PASSKEY;
    const callbackUrl = process.env.MPESA_CALLBACK_URL;

    if (!shortcode || !passkey || !callbackUrl) {
      throw new Error('M-Pesa configuration incomplete');
    }

    // Validate phone number
    if (!isValidKenyanPhone(request.phoneNumber)) {
      throw new Error('Invalid Kenyan phone number');
    }

    // Get OAuth token
    const token = await generateMpesaToken();

    // Generate timestamp and password
    const timestamp = generateTimestamp();
    const password = generatePassword(shortcode, passkey, timestamp);

    // Format phone number
    const phoneNumber = formatPhoneNumber(request.phoneNumber);

    // Prepare STK Push payload
    const payload = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.round(request.amount), // M-Pesa requires integer
      PartyA: phoneNumber, // Phone number sending money
      PartyB: shortcode, // Organization receiving money
      PhoneNumber: phoneNumber, // Phone number to receive STK Push
      CallBackURL: callbackUrl,
      AccountReference: request.accountReference,
      TransactionDesc: request.transactionDesc,
    };

    console.log('Initiating STK Push:', {
      phoneNumber,
      amount: request.amount,
      reference: request.accountReference,
    });

    const response = await fetch(STK_PUSH_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('STK Push failed:', data);
      throw new Error(data.errorMessage || 'STK Push request failed');
    }

    console.log('STK Push initiated successfully:', data);
    return data;
  } catch (error) {
    console.error('Error initiating STK Push:', error);
    throw error;
  }
}

/**
 * Parse M-Pesa callback response
 */
export interface CallbackMetadata {
  Amount?: number;
  MpesaReceiptNumber?: string;
  TransactionDate?: number;
  PhoneNumber?: string;
}

export interface MpesaCallback {
  Body: {
    stkCallback: {
      MerchantRequestID: string;
      CheckoutRequestID: string;
      ResultCode: number;
      ResultDesc: string;
      CallbackMetadata?: {
        Item: Array<{
          Name: string;
          Value: any;
        }>;
      };
    };
  };
}

export function parseCallbackMetadata(callback: MpesaCallback): CallbackMetadata {
  const metadata: CallbackMetadata = {};

  const items = callback.Body.stkCallback.CallbackMetadata?.Item || [];

  items.forEach((item) => {
    switch (item.Name) {
      case 'Amount':
        metadata.Amount = item.Value;
        break;
      case 'MpesaReceiptNumber':
        metadata.MpesaReceiptNumber = item.Value;
        break;
      case 'TransactionDate':
        metadata.TransactionDate = item.Value;
        break;
      case 'PhoneNumber':
        metadata.PhoneNumber = item.Value;
        break;
    }
  });

  return metadata;
}
