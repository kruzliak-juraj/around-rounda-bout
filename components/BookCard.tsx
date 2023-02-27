import React from 'react';
import { IconHeart } from '@tabler/icons-react';
import {
  Card,
  Image,
  Text,
  Group,
  Badge,
  Button,
  ActionIcon,
  createStyles,
} from '@mantine/core';
import { navigate } from 'vite-plugin-ssr/client/router';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { getFavourites, setFavourites } from '../store/favouritesSlice';

interface BadgeCardProps {
  image: string;
  title: string;
  description: JSX.Element | JSX.Element[] | string;
  author: string;
  type: string;
  id: string;
}

function BookCard({ image, title, description, author, type, id }: BadgeCardProps) {
  const { classes, cx } = useStyles();
  const dispatch = useAppDispatch();
  const { favourites } = useAppSelector(getFavourites);

  return (
    <Card withBorder radius="md" p="md" className={classes.card}>
      <Card.Section>
        <Image src={image} alt={title} height={170} />
      </Card.Section>

      <Card.Section className={classes.section} mt="md">
        <Text size="lg" weight={500}>
          {title}
        </Text>
        <Text size="xs">{author}</Text>
        <Badge size="sm" mt="xs">
          {type}
        </Badge>
        <Text size="sm" mt="xs">
          {description}
        </Text>
      </Card.Section>

      <Card.Section className={cx(classes.actions, classes.section)}>
        <Group mt="md">
          <Button
            radius="md"
            style={{ flex: 1 }}
            onClick={async () => {
              await navigate(`/detail/${id}`);
            }}
          >
            Show details
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
      </Card.Section>
    </Card>
  );
}

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    display: 'grid',
    gridTemplateRows: '166px auto auto',
  },

  section: {
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },

  like: {
    color: theme.colors.red[6],
  },

  label: {
    textTransform: 'uppercase',
    fontSize: theme.fontSizes.xs,
    fontWeight: 700,
  },

  actions: {
    borderTop: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
    alignSelf: 'end',
  },
}));

export default BookCard;
