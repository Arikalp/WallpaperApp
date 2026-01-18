import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Wallpaper {
  id: number;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  photographer: string;
  photographer_url: string;
  photographer_id: number;
  width: number;
  height: number;
  url: string;
  alt?: string;
}

interface FavoritesContextType {
  favorites: Wallpaper[];
  addFavorite: (wallpaper: Wallpaper) => void;
  removeFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
  toggleFavorite: (wallpaper: Wallpaper) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const FAVORITES_STORAGE_KEY = '@wallcraft_favorites';

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<Wallpaper[]>([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const saveFavorites = async (newFavorites: Wallpaper[]) => {
    try {
      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  const addFavorite = (wallpaper: Wallpaper) => {
    const newFavorites = [...favorites, wallpaper];
    setFavorites(newFavorites);
    saveFavorites(newFavorites);
  };

  const removeFavorite = (id: number) => {
    const newFavorites = favorites.filter(item => item.id !== id);
    setFavorites(newFavorites);
    saveFavorites(newFavorites);
  };

  const isFavorite = (id: number) => {
    return favorites.some(item => item.id === id);
  };

  const toggleFavorite = (wallpaper: Wallpaper) => {
    if (isFavorite(wallpaper.id)) {
      removeFavorite(wallpaper.id);
    } else {
      addFavorite(wallpaper);
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        toggleFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
