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
          if (args[1]?.headers) {
            if (args[1].headers instanceof Headers) {
              hasActionHeader = args[1].headers.has('Next-Action') || args[1].headers.has('next-action');
            } else if (typeof args[1].headers === 'object') {
              hasActionHeader = 'Next-Action' in args[1].headers || 'next-action' in args[1].headers;
            }
          }

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
