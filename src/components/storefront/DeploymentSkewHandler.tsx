'use client';

import { useEffect } from 'react';

export function DeploymentSkewHandler() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const originalFetch = window.fetch;
      window.fetch = async function (...args) {
        const response = await originalFetch.apply(this, args);
        
        if (response.status === 404) {
          const fetchUrl = typeof args[0] === 'string' ? args[0] : (args[0] as Request).url;
          
          let hasActionHeader = false;
          
          // Helper to check headers
          const checkHeaders = (headers: any) => {
            if (!headers) return false;
            if (headers instanceof Headers) {
              return headers.has('Next-Action') || headers.has('next-action');
            }
            if (Array.isArray(headers)) {
              return headers.some(([key]) => key.toLowerCase() === 'next-action');
            }
            if (typeof headers === 'object') {
              return 'Next-Action' in headers || 'next-action' in headers;
            }
            return false;
          };

          // Headers could be in args[1].headers or directly on a Request object in args[0]
          hasActionHeader = checkHeaders(args[1]?.headers) || 
                            (args[0] instanceof Request ? checkHeaders(args[0].headers) : false);

          if (hasActionHeader) {
            console.warn('Deployment skew detected (Server Action 404). Hard reloading...');
            window.location.reload();
          }
        }
        
        return response;
      };
    }
  }, []);

  return null;
}
