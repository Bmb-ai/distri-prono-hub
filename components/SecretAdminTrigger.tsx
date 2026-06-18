'use client';

import { useEffect, useRef } from 'react';

export function SecretAdminTrigger() {
  const buffer = useRef('');

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      buffer.current = (buffer.current + event.key.toLowerCase()).slice(-12);
      if (buffer.current.includes('distri')) {
        window.location.href = '/admin';
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return null;
}
