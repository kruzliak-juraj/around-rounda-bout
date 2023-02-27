import React from 'react';
import ReactDOM from 'react-dom/client';
import { PageShell } from './PageShell';
import type { PageContextClient } from './types';

export const clientRouting = true;
export const hydrationCanBeAborted = true;
export { render };

let root: ReactDOM.Root;
async function render(pageContext: PageContextClient) {
  const { Page, pageProps } = pageContext;
  const page = (
    <PageShell pageContext={pageContext}>
      <Page {...pageProps} />
    </PageShell>
  );

  const { documentProps, getDocumentProps } = pageContext.exports;
  const values = getDocumentProps ? getDocumentProps(pageProps) : {};
  const title = (documentProps && documentProps.title) || values.title || 'Vite SSR app';
  if (!pageContext.isHydration) {
    document.title = title;
  }

  const container = document.getElementById('page-view')!;
  if (pageContext.isHydration) {
    root = ReactDOM.hydrateRoot(container, page);
  } else {
    if (!root) {
      root = ReactDOM.createRoot(container);
    }
    root.render(page);
  }
}

/* To enable Client-side Routing:
export const clientRouting = true
// !! WARNING !! Before doing so, read https://vite-plugin-ssr.com/clientRouting */
