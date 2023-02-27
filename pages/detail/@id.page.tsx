import React from 'react';
import { usePageContext } from '../../renderer/usePageContext';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  Container,
  Group,
  Image,
  Title,
  Paper,
  Text,
  SimpleGrid,
  Center,
  Loader,
  Button,
  ActionIcon,
  createStyles,
} from '@mantine/core';
import { getFavourites, setFavourites } from '../../store/favouritesSlice';
import { IconHeart } from '@tabler/icons-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { PageProps } from '../../renderer/types';

export { Page };
export { getDocumentProps };

function getDocumentProps(pageProps: PageProps | undefined) {
  if (!pageProps) {
    return {
      title: 'fail',
      description: 'fail',
    };
  }
  const data = pageProps.reactQueryState.queries[0].state.data;
  return {
    title: data.volumeInfo.title,
    description: data.id,
  };
}

function Page() {
  const { classes } = useStyles();
  const pageContext = usePageContext();
  const dispatch = useAppDispatch();
  const { favourites } = useAppSelector(getFavourites);
  const id = pageContext.routeParams?.id;
  const { data, isLoading, isFetching } = useQuery(
    ['volume', id],
    () =>
      axios
        .get(`https://www.googleapis.com/books/v1/volumes/${id}`)
        .then((response) => response.data),
    {
      enabled: !!id,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    },
  );

  return (
    <Container size={'md'} pb={100}>
      {isFetching && (
        <Center pt={50}>
          <Loader size={100} />
        </Center>
      )}
      {data && id && !isLoading && (
        <>
          {data.volumeInfo?.title && (
            <Group mt="md">
              {data.volumeInfo?.imageLinks?.thumbnail && (
                <Image
                  src={data.volumeInfo?.imageLinks?.thumbnail}
                  alt={data.volumeInfo?.title}
                  height={171}
                  width={128}
                />
              )}
              <Title size={'h1'} sx={{ marginBottom: 20, maxWidth: '20ch' }}>
                {data.volumeInfo?.title}
              </Title>
            </Group>
          )}
          {data.volumeInfo?.previewLink && (
            <Group mt="md">
              <Button component="a" href={data.volumeInfo.previewLink} target={'_blank'}>
                Oi bruv, click me to read more
              </Button>

              <ActionIcon
                title="like book"
                radius="md"
                color="green"
                size={36}
                variant={favourites && favourites.includes(id) ? 'filled' : 'default'}
                onClick={() => {
                  if (!favourites) {
                    return;
                  }
                  favourites.includes(id)
                    ? dispatch(setFavourites(favourites.filter((item) => item !== id)))
                    : dispatch(setFavourites([...favourites, id]));
                }}
              >
                <IconHeart size={18} className={classes.like} stroke={1.5} />
              </ActionIcon>
            </Group>
          )}
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
            {data.volumeInfo?.publisher && (
              <Paper shadow="xs" p="md">
                <Title size={'h4'} sx={{ marginBottom: 20 }}>
                  Publisher
                </Title>
                <Text>{data.volumeInfo?.publisher}</Text>
              </Paper>
            )}
            {data.volumeInfo?.pageCount && (
              <Paper shadow="xs" p="md">
                <Title size={'h4'} sx={{ marginBottom: 20 }}>
                  Page-count
                </Title>
                <Text>{data.volumeInfo?.pageCount}</Text>
              </Paper>
            )}
            {data.volumeInfo?.printType && (
              <Paper shadow="xs" p="md">
                <Title size={'h4'} sx={{ marginBottom: 20 }}>
                  Print type
                </Title>
                <Text>{data.volumeInfo?.printType}</Text>
              </Paper>
            )}
            {data.volumeInfo?.maturityRating && (
              <Paper shadow="xs" p="md">
                <Title size={'h4'} sx={{ marginBottom: 20 }}>
                  Maturity rating
                </Title>
                <Text>{data.volumeInfo?.maturityRating}</Text>
              </Paper>
            )}
            {data.volumeInfo?.language && (
              <Paper shadow="xs" p="md">
                <Title size={'h4'} sx={{ marginBottom: 20 }}>
                  Language
                </Title>
                <Text>{data.volumeInfo?.language}</Text>
              </Paper>
            )}
            {data.volumeInfo?.authors && (
              <Paper shadow="xs" p="md">
                <Title size={'h4'} sx={{ marginBottom: 20 }}>
                  Authors
                </Title>
                {data.volumeInfo?.authors.map((author: string) => {
                  return <Text key={author}>{author}</Text>;
                })}
              </Paper>
            )}
          </SimpleGrid>
        </>
      )}
    </Container>
  );
}

const useStyles = createStyles((theme) => ({
  like: {
    color: theme.colors.red[6],
  },
}));
