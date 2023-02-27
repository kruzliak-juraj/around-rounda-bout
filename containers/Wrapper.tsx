import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { getFavourites, setFavourites } from '../store/favouritesSlice';

function Wrapper({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { favourites } = useAppSelector(getFavourites);

  useEffect(() => {
    if (!favourites) {
      return;
    }
    localStorage.setItem('favourites', JSON.stringify(favourites));
  }, [favourites]);

  useEffect(() => {
    const localStorageFavorites = localStorage.getItem('favourites')
      ? (localStorage.getItem('favourites') as string)
      : '[]';
    dispatch(setFavourites(JSON.parse(localStorageFavorites)));
  }, []);

  return <>{children}</>;
}

export default Wrapper;
