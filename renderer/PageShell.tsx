import React from 'react';
import { PageContextProvider } from './usePageContext';
import type { PageContext } from './types';
import { MantineProvider } from '@mantine/core';
import HeaderResponsive from '../containers/Header';
import { QueryClient, QueryClientProvider, Hydrate } from '@tanstack/react-query';
import { store } from '../store/store';
import { Provider } from 'react-redux';
import Wrapper from '../containers/Wrapper';

export { PageShell };

const queryClient = new QueryClient();

function PageShell({
  children,
  pageContext,
}: {
  children: React.ReactNode;
  pageContext: PageContext;
}) {
  return (
    <React.StrictMode>
      <PageContextProvider pageContext={pageContext}>
        <QueryClientProvider client={queryClient}>
          <Hydrate state={pageContext.pageProps?.reactQueryState}>
            <Provider store={store}>
              <MantineProvider withGlobalStyles withNormalizeCSS>
                <Wrapper>
                  <HeaderResponsive />
                  {children}
                </Wrapper>
              </MantineProvider>
            </Provider>
          </Hydrate>
        </QueryClientProvider>
      </PageContextProvider>
    </React.StrictMode>
  );
}
