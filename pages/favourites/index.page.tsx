import React, { useEffect, useState } from 'react';
import { Container, Loader, Title, Center, SimpleGrid } from '@mantine/core';
import { useAppSelector } from '../../store/hooks';
import { getFavourites } from '../../store/favouritesSlice';
import { useQueries } from '@tanstack/react-query';
import axios from 'axios';
import BookCard from '../../components/BookCard';
import parse from 'html-react-parser';

export { Page };

export const documentProps = {
  title: 'About Rounda Bour - Favourite books',
  description: 'AWWWWW',
};

function Page() {
  const [allFinished, setAllFinished] = useState(false);
  const { favourites } = useAppSelector(getFavourites);
  const results = useQueries({
    queries: !favourites
      ? []
      : favourites.map((item) => ({
          queryKey: ['volume', item],
          queryFn: () =>
            axios
              .get(`https://www.googleapis.com/books/v1/volumes/${item}`)
              .then((response) => response.data),
          refetchOnWindowFocus: false,
          keepPreviousData: true,
          staleTime: Infinity,
        })),
  });

  useEffect(() => {
    const stillLoading = results.filter((result) => result.isFetching);
    setAllFinished(!stillLoading.length);
  }, [results]);

  return (
    <Container size={'md'} pb={100}>
      {results && favourites && !allFinished && !favourites.length && (
        <Center pt={50}>
          <Loader size={100} />
        </Center>
      )}
      {favourites && !favourites.length && allFinished && (
        <Title size={'h1'}>
          Get some more in-between 4 wall time, you have no books in favourites...
        </Title>
      )}
      {favourites && !!favourites.length && (
        <>
          <Title size={'h1'}>Your favourite books, that I bet you never read</Title>
          {allFinished ? (
            <SimpleGrid
              cols={3}
              spacing="xl"
              breakpoints={[
                { maxWidth: 980, cols: 3, spacing: 'md' },
                { maxWidth: 755, cols: 2, spacing: 'sm' },
                { maxWidth: 600, cols: 1, spacing: 'sm' },
              ]}
              mt={50}
            >
              {results.map((item: any, index: number) => {
                return (
                  <BookCard
                    key={`${item.data?.volumeInfo?.title}${index}` || index}
                    type={item.data?.volumeInfo?.printType || 'BOOK?'}
                    description={
                      item.data?.searchInfo?.textSnippet
                        ? parse(item.data?.searchInfo?.textSnippet)
                        : 'idk man, prob cool book'
                    }
                    author={
                      item.data?.volumeInfo?.authors?.length
                        ? item.data?.volumeInfo?.authors[0]
                        : 'Annonymous'
                    }
                    image={item.data?.volumeInfo?.imageLinks?.thumbnail || ''}
                    title={
                      item.data?.volumeInfo?.title ||
                      'This book does not want to be found'
                    }
                    id={item.data?.id}
                  />
                );
              })}
            </SimpleGrid>
          ) : (
            <Center pt={50}>
              <Loader size={100} />
            </Center>
          )}
        </>
      )}
    </Container>
  );
}
