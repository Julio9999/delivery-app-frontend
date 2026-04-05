import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';

export function PageTitlePortal({
  title,
  containerId = 'layout-page-title',
}: {
  title: string;
  containerId?: string;
}) {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setContainer(document.getElementById(containerId));
  }, [containerId]);

  if (!container) {
    return null;
  }

  return createPortal(
    <h1 className="text-xl font-semibold tracking-tight">{title}</h1>,
    container,
  );
}
