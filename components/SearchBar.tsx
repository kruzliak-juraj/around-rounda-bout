import React, { FormEvent } from 'react';
import { TextInput, ActionIcon, useMantineTheme } from '@mantine/core';
import { IconSearch, IconArrowRight, IconArrowLeft } from '@tabler/icons-react';

export function SearchBar({
  onSubmit,
}: {
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const theme = useMantineTheme();

  return (
    <form onSubmit={onSubmit}>
      <TextInput
        name="searchBar"
        icon={<IconSearch size={18} stroke={1.5} />}
        radius="xl"
        size="md"
        rightSection={
          <ActionIcon
            size={32}
            radius="xl"
            color={theme.primaryColor}
            variant="filled"
            type="submit"
          >
            {theme.dir === 'ltr' ? (
              <IconArrowRight size={18} stroke={1.5} />
            ) : (
              <IconArrowLeft size={18} stroke={1.5} />
            )}
          </ActionIcon>
        }
        placeholder="Search for any round about Book"
        rightSectionWidth={42}
      />
    </form>
  );
}
