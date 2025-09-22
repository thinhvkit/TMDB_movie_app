import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Movie, MovieCategory, SortBy, AppState} from '../types';

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  addToWatchlist: (movie: Movie) => void;
  removeFromWatchlist: (movieId: number) => void;
  isInWatchlist: (movieId: number) => boolean;
  setSelectedCategory: (category: MovieCategory) => void;
  setSelectedSort: (sort: SortBy) => void;
  setSearchQuery: (query: string) => void;
}

type AppAction =
  | {type: 'SET_SELECTED_CATEGORY'; payload: MovieCategory}
  | {type: 'SET_SELECTED_SORT'; payload: SortBy}
  | {type: 'SET_SEARCH_QUERY'; payload: string}
  | {type: 'ADD_TO_WATCHLIST'; payload: Movie}
  | {type: 'REMOVE_FROM_WATCHLIST'; payload: number}
  | {type: 'LOAD_WATCHLIST'; payload: Movie[]}
  | {
      type: 'LOAD_PREFERENCES';
      payload: {category: MovieCategory; sort: SortBy};
    };

const initialState: AppState = {
  selectedCategory: 'now_playing',
  selectedSort: 'alphabetical',
  searchQuery: '',
  watchlist: [],
};

const STORAGE_KEYS = {
  WATCHLIST: '@MovieApp:watchlist',
  CATEGORY: '@MovieApp:selectedCategory',
  SORT: '@MovieApp:selectedSort',
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_SELECTED_CATEGORY':
      return {...state, selectedCategory: action.payload};
    case 'SET_SELECTED_SORT':
      return {...state, selectedSort: action.payload};
    case 'SET_SEARCH_QUERY':
      return {...state, searchQuery: action.payload};
    case 'ADD_TO_WATCHLIST':
      if (state.watchlist.find(movie => movie.id === action.payload.id)) {
        return state; // Movie already in watchlist
      }
      return {...state, watchlist: [...state.watchlist, action.payload]};
    case 'REMOVE_FROM_WATCHLIST':
      return {
        ...state,
        watchlist: state.watchlist.filter(movie => movie.id !== action.payload),
      };
    case 'LOAD_WATCHLIST':
      return {...state, watchlist: action.payload};
    case 'LOAD_PREFERENCES':
      return {
        ...state,
        selectedCategory: action.payload.category,
        selectedSort: action.payload.sort,
      };
    default:
      return state;
  }
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({children}: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load data from AsyncStorage on app start
  useEffect(() => {
    loadStoredData();
  }, []);

  // Save watchlist to AsyncStorage whenever it changes
  useEffect(() => {
    saveWatchlist(state.watchlist);
  }, [state.watchlist]);

  // Save preferences to AsyncStorage whenever they change
  useEffect(() => {
    savePreferences(state.selectedCategory, state.selectedSort);
  }, [state.selectedCategory, state.selectedSort]);

  const loadStoredData = async () => {
    try {
      // Load watchlist
      const storedWatchlist = await AsyncStorage.getItem(
        STORAGE_KEYS.WATCHLIST,
      );
      if (storedWatchlist) {
        const watchlist = JSON.parse(storedWatchlist);
        dispatch({type: 'LOAD_WATCHLIST', payload: watchlist});
      }

      // Load preferences
      const [storedCategory, storedSort] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.CATEGORY),
        AsyncStorage.getItem(STORAGE_KEYS.SORT),
      ]);

      if (storedCategory || storedSort) {
        dispatch({
          type: 'LOAD_PREFERENCES',
          payload: {
            category: (storedCategory as MovieCategory) || 'now_playing',
            sort: (storedSort as SortBy) || 'alphabetical',
          },
        });
      }
    } catch (error) {
      console.error('Error loading stored data:', error);
    }
  };

  const saveWatchlist = async (watchlist: Movie[]) => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.WATCHLIST,
        JSON.stringify(watchlist),
      );
    } catch (error) {
      console.error('Error saving watchlist:', error);
    }
  };

  const savePreferences = async (category: MovieCategory, sort: SortBy) => {
    try {
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.CATEGORY, category),
        AsyncStorage.setItem(STORAGE_KEYS.SORT, sort),
      ]);
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  const addToWatchlist = (movie: Movie) => {
    dispatch({type: 'ADD_TO_WATCHLIST', payload: movie});
  };

  const removeFromWatchlist = (movieId: number) => {
    dispatch({type: 'REMOVE_FROM_WATCHLIST', payload: movieId});
  };

  const isInWatchlist = (movieId: number) => {
    return state.watchlist.some(movie => movie.id === movieId);
  };

  const setSelectedCategory = (category: MovieCategory) => {
    dispatch({type: 'SET_SELECTED_CATEGORY', payload: category});
  };

  const setSelectedSort = (sort: SortBy) => {
    dispatch({type: 'SET_SELECTED_SORT', payload: sort});
  };

  const setSearchQuery = (query: string) => {
    dispatch({type: 'SET_SEARCH_QUERY', payload: query});
  };

  const value: AppContextType = {
    state,
    dispatch,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    setSelectedCategory,
    setSelectedSort,
    setSearchQuery,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
