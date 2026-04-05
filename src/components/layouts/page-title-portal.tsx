import { createPortal } from 'react-dom';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type PageTitlePortalContextValue = {
  onMount: () => void;
  onUnmount: () => void;
};

const PageTitlePortalContext = createContext<PageTitlePortalContextValue | null>(null);

export function PageTitlePortalProvider({
  children,
  onPortalTitleMount,
  onPortalTitleUnmount,
}: {
  children: ReactNode;
  onPortalTitleMount: () => void;
  onPortalTitleUnmount: () => void;
}) {
  return (
    <PageTitlePortalContext.Provider
      value={{ onMount: onPortalTitleMount, onUnmount: onPortalTitleUnmount }}
    >
      {children}
    </PageTitlePortalContext.Provider>
  );
}

export function PageTitlePortal({
  children,
  containerId = 'layout-page-title',
}: {
  children: ReactNode;
  containerId?: string;
}) {
  const context = useContext(PageTitlePortalContext);
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    context?.onMount();
    return () => {
      context?.onUnmount();
    };
  }, [context]);

  useEffect(() => {
    setContainer(document.getElementById(containerId));
  }, [containerId]);

  if (!container) {
    return null;
  }

  return createPortal(children, container);
}
