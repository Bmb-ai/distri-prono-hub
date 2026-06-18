'use client';

import { useRef } from 'react';

export function LogoSecret() {
  const clicks = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleClick() {
    clicks.current += 1;
    if (timer.current) clearTimeout(timer.current);

    if (clicks.current >= 5) {
      window.location.href = '/admin';
      return;
    }

    timer.current = setTimeout(() => {
      clicks.current = 0;
    }, 1200);
  }

  return (
    <button className="logoButton" onClick={handleClick} aria-label="Logo Distri Concept">
      <img src="/logo-distri-concept.svg" alt="Distri Concept" className="brandLogo" />
    </button>
  );
}
