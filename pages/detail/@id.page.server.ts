import { QueryClient, dehydrate } from '@tanstack/react-query';
import type { PageContext } from '../../renderer/types';
import axios from 'axios';

export { onBeforeRender };

async function onBeforeRender(pageContext: PageContext) {
  const id = pageContext.routeParams?.id;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(
    ['volume', id],
    () =>
      axios
        .get(`https://www.googleapis.com/books/v1/volumes/${id}`)
        .then((response) => response.data),
    {
      staleTime: Infinity,
    },
  );

  const reactQueryState = dehydrate(queryClient);

  return {
    pageContext: {
      pageProps: {
        reactQueryState,
      },
    },
  };
}
