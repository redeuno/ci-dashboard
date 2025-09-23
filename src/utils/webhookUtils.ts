/**
 * Webhook utilities with retry logic and enhanced logging
 */

export interface WebhookOptions {
  retries?: number;
  retryDelay?: number;
  timeout?: number;
}

const DEFAULT_OPTIONS: WebhookOptions = {
  retries: 3,
  retryDelay: 1000, // 1 second
  timeout: 10000, // 10 seconds
};

/**
 * Enhanced webhook call with retry logic and detailed logging
 * @param url - Webhook URL
 * @param data - Data to send
 * @param options - Retry options
 * @returns Promise<boolean> - Success status
 */
export const callWebhookWithRetry = async (
  url: string, 
  data: any, 
  options: WebhookOptions = {}
): Promise<boolean> => {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  let lastError: Error | null = null;
  
  console.log(`[Webhook] Calling ${url} with data:`, data);
  
  for (let attempt = 1; attempt <= (opts.retries || 3); attempt++) {
    try {
      console.log(`[Webhook] Attempt ${attempt}/${opts.retries} for ${url}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), opts.timeout);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        console.log(`[Webhook] Success ${url} - Status: ${response.status}`);
        const responseText = await response.text();
        if (responseText) {
          console.log(`[Webhook] Response:`, responseText);
        }
        return true;
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      lastError = error as Error;
      console.warn(`[Webhook] Attempt ${attempt} failed for ${url}:`, error);
      
      if (attempt < (opts.retries || 3)) {
        console.log(`[Webhook] Retrying in ${opts.retryDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, opts.retryDelay));
      }
    }
  }
  
  console.error(`[Webhook] All attempts failed for ${url}:`, lastError);
  return false;
};

/**
 * Log webhook call result for monitoring
 * @param operation - Operation name
 * @param success - Success status
 * @param data - Data sent
 * @param error - Error if any
 */
export const logWebhookResult = (
  operation: string, 
  success: boolean, 
  data?: any, 
  error?: Error
) => {
  const logData = {
    operation,
    success,
    timestamp: new Date().toISOString(),
    data: data ? JSON.stringify(data) : undefined,
    error: error?.message,
  };
  
  if (success) {
    console.log(`[Webhook Success] ${operation}:`, logData);
  } else {
    console.error(`[Webhook Failed] ${operation}:`, logData);
  }
  
  // Could send to analytics or monitoring service here
};