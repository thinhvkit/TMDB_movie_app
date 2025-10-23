import React, {useState, useEffect, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {useAppContext} from '../contexts/AppContext';
import {useMovies, useSearchMovies} from '../hooks/useGraphQLMovies';
import {Movie, MovieCategory, SortBy} from '../types';
import {sortMovies} from '../utils/sorting';
import {RootStackParamList} from '../navigation/AppNavigator';

import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import strings from '../constants/strings.json';
import CustomDropdown from '../components/CustomDropdown';
import {COLORS} from '../constants/colors';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Main'
>;

const CATEGORY_OPTIONS = [
  {label: 'Now Playing', value: 'now_playing'},
  {label: 'Upcoming', value: 'upcoming'},
  {label: 'Popular', value: 'popular'},
];

const SORT_OPTIONS = [
  {label: 'Alphabetical', value: 'alphabetical'},
  {label: 'Rating', value: 'rating'},
  {label: 'Release Date', value: 'release_date'},
];

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const {state, setSelectedCategory, setSelectedSort, setSearchQuery} =
    useAppContext();

  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [searchText, setSearchText] = useState('');

  // GraphQL hooks
  const {
    data: moviesData,
    loading: moviesLoading,
    error: moviesError,
    refetch: refetchMovies,
  } = useMovies(state.selectedCategory);

  const {
    data: searchData,
    loading: searchLoading,
    error: searchError,
    refetch: refetchSearch,
  } = useSearchMovies(state.searchQuery);

  // Determine which data to use
  const isSearching = state.searchQuery.trim().length > 0;
  const data = isSearching ? searchData : moviesData;
  const loading = isSearching ? searchLoading : moviesLoading;
  const error = isSearching ? searchError : moviesError;

  const movies = useMemo(() => data?.results || [], [data]);

  useEffect(() => {
    const sorted = sortMovies(movies, state.selectedSort);
    setFilteredMovies(sorted);
  }, [movies, state.selectedSort]);

  const handleRefresh = () => {
    if (isSearching) {
      refetchSearch();
    } else {
      refetchMovies();
    }
  };

  const handleSearch = () => {
    if (searchText.trim() !== state.searchQuery) {
      setSearchQuery(searchText.trim());
    }
  };

  const handleMoviePress = (movieId: number) => {
    navigation.navigate('MovieDetail', {movieId});
  };

  const renderMovieItem = ({item}: {item: Movie}) => (
    <MovieCard movie={item} onPress={() => handleMoviePress(item.id)} />
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.controls}>
        <CustomDropdown
          options={CATEGORY_OPTIONS}
          selectedValue={state.selectedCategory}
          onValueChange={value => setSelectedCategory(value as MovieCategory)}
          placeholder={strings.searchPlaceholder}
          style={[styles.dropdown, styles.categoryDropdown]}
        />

        <CustomDropdown
          options={SORT_OPTIONS}
          selectedValue={state.selectedSort}
          onValueChange={value => setSelectedSort(value as SortBy)}
          placeholder={strings.sortPlaceholder}
          style={[styles.dropdown, styles.sortDropdown]}
        />

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder={strings.searchPlaceholder}
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>{strings.searchButton}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        <LoadingSpinner message="Loading movies..." />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        <ErrorMessage
          message={error.message || 'Failed to load movies'}
          onRetry={handleRefresh}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <FlatList
        data={filteredMovies}
        renderItem={renderMovieItem}
        keyExtractor={item => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchText ? strings.noMoviesFound : strings.noMoviesAvailable}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContainer: {
    paddingBottom: 20,
    paddingTop: 10,
  },
  header: {
    backgroundColor: COLORS.backgroundSecondary,
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginBottom: 10,
    zIndex: 1000,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 20,
  },
  controls: {
    gap: 12,
    zIndex: 1001,
    elevation: 6,
  },
  dropdown: {
    justifyContent: 'center',
    marginBottom: 8,
  },
  categoryDropdown: {
    zIndex: 1003,
    elevation: 7,
  },
  sortDropdown: {
    zIndex: 1002,
    elevation: 7,
  },
  searchContainer: {
    flexDirection: 'column',
    gap: 12,
  },
  searchInput: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchButton: {
    backgroundColor: COLORS.backgroundDisabled,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: COLORS.textMuted,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
  },
});
