import React, { FormEvent, useState } from 'react';
import { SearchBar } from '../../components/SearchBar';
import BookCard from '../../components/BookCard';
import { Container, Center, Title, SimpleGrid, Pagination, Loader } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import parse from 'html-react-parser';

export { Page };

export const documentProps = {
  title: 'About Rounda Bour - Books search',
  description: 'HEYOOOOOO',
};

interface SearchBarFields {
  searchBar: { value: string };
}

const PER_PAGE = 9;

function Page() {
  const [searchValue, setSearchValue] = useState<string | undefined>(undefined);
  const [pageNumber, setPageNumber] = useState<number>(0);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const searchValues = event.target as typeof event.target & SearchBarFields;
    if (!searchValues.searchBar.value.length) {
      return;
    }
    setPageNumber(0);
    setSearchValue(searchValues.searchBar.value);
  };

  const { data, isLoading, isFetching } = useQuery(
    ['volumes', searchValue, pageNumber],
    () =>
      axios
        .get(
          `https://www.googleapis.com/books/v1/volumes?q=${searchValue}&maxResults=${PER_PAGE}&startIndex=${
            pageNumber * PER_PAGE
          }`,
        )
        .then((response) => response.data),
    {
      enabled: !!searchValue,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      onSuccess: () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      staleTime: Infinity,
    },
  );

  return (
    <Container size={'md'} pb={100}>
      <Title size={'h1'} sx={{ textAlign: 'center', marginBottom: 20 }}>
        Around Rounda Bout - Book search
      </Title>
      <SearchBar onSubmit={onSubmit} />
      {isFetching && (
        <Center pt={50}>
          <Loader size={100} />
        </Center>
      )}
      {data && !isLoading && (
        <>
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
            {data.items.map((item: any, index: number) => {
              return (
                <BookCard
                  key={`${item?.volumeInfo?.title}${index}` || index}
                  type={item?.volumeInfo?.printType || 'BOOK?'}
                  description={
                    item?.searchInfo?.textSnippet
                      ? parse(item?.searchInfo?.textSnippet)
                      : 'idk man, prob cool book'
                  }
                  author={
                    item?.volumeInfo?.authors?.length
                      ? item?.volumeInfo?.authors[0]
                      : 'Annonymous'
                  }
                  image={item?.volumeInfo?.imageLinks?.thumbnail || ''}
                  title={item?.volumeInfo?.title || 'This book does not want to be found'}
                  id={item?.id}
                />
              );
            })}
          </SimpleGrid>
          <Center pt={50}>
            <Pagination
              page={pageNumber + 1}
              onChange={(number) => setPageNumber(number - 1)}
              total={data.totalItems / PER_PAGE}
            />
          </Center>
        </>
      )}
      {data && isFetching && (
        <Center pt={20}>
          <Loader size={20} />
        </Center>
      )}
    </Container>
  );
}
