/* cSpell:ignore watchlist */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

import strings from '../constants/strings.json';
import {useAppContext} from '../contexts/AppContext';
import {Movie, SortBy, SortOrder} from '../types';
import {sortMovies} from '../utils/sorting';
import {RootStackParamList} from '../navigation/AppNavigator';

import MovieCard from '../components/MovieCard';
import CustomDropdown from '../components/CustomDropdown';
import AscendingArrowIcon from '../components/svg-icons/AsendingArowIcon';
import DescendingArrowIcon from '../components/svg-icons/DescendingArrowIcon';
import {COLORS} from '../constants/colors';

type WatchlistScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Main'
>;

const SORT_OPTIONS = [
  {label: 'Alphabetical', value: 'alphabetical'},
  {label: 'Rating', value: 'rating'},
  {label: 'Release Date', value: 'release_date'},
];

export default function WatchlistScreen() {
  const navigation = useNavigation<WatchlistScreenNavigationProp>();
  const {state, removeFromWatchlist} = useAppContext();

  const [sortBy, setSortBy] = useState<SortBy>('alphabetical');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [sortedMovies, setSortedMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const sorted = sortMovies(state.watchlist, sortBy, sortOrder);
    setSortedMovies(sorted);
  }, [state.watchlist, sortBy, sortOrder]);

  const handleMoviePress = (movieId: number) => {
    navigation.navigate('MovieDetail', {movieId});
  };

  const handleRemoveFromWatchlist = (movieId: number) => {
    removeFromWatchlist(movieId);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const renderMovieItem = ({item}: {item: Movie}) => (
    <MovieCard
      movie={item}
      onPress={() => handleMoviePress(item.id)}
      showRemoveButton
      onRemove={() => handleRemoveFromWatchlist(item.id)}
    />
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.userInfo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>J</Text>
        </View>
        <View style={styles.userDetails}>
          <Text style={styles.userName}>John Lee</Text>
          <Text style={styles.joinDate}>Member since August 2023</Text>
        </View>
      </View>

      <View style={styles.watchlistHeader}>
        <Text style={styles.watchlistTitle}>My Watchlist</Text>
        <Text style={styles.movieCount}>
          {state.watchlist.length} movie
          {state.watchlist.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {state.watchlist.length > 0 && (
        <View style={styles.controls}>
          <Text style={styles.filterLabel}>Filter by:</Text>
          <View style={styles.filterRow}>
            <CustomDropdown
              options={SORT_OPTIONS}
              selectedValue={sortBy}
              onValueChange={value => setSortBy(value as SortBy)}
              placeholder={strings.sortPlaceholder}
              style={styles.sortDropdown}
              dropdownStyle={styles.dropdownButton}
            />
            <TouchableOpacity
              style={styles.orderButton}
              onPress={toggleSortOrder}>
              <Text style={styles.orderButtonText}>Order:</Text>
              {sortOrder ? <AscendingArrowIcon /> : <DescendingArrowIcon />}
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <FlatList
        data={sortedMovies}
        renderItem={renderMovieItem}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="bookmark-border" size={64} color={COLORS.grayLighter} />
            <Text style={styles.emptyTitle}>Your watchlist is empty</Text>
            <Text style={styles.emptyText}>
              Add movies to your watchlist to keep track of what you want to
              watch later.
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
    backgroundColor: COLORS.backgroundTertiary,
    paddingHorizontal: 16,
    paddingTop: 40,
    marginBottom: 15,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    zIndex: 999,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: COLORS.secondary,
    padding: 16,
    borderRadius: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  joinDate: {
    color: COLORS.white,
    fontSize: 14,
    opacity: 0.8,
  },
  watchlistHeader: {
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 8,
  },
  watchlistTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 4,
  },
  movieCount: {
    fontSize: 14,
    color: COLORS.black,
    opacity: 0.8,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundTransparent,
    borderRadius: 8,
    zIndex: 1001,
  },
  filterLabel: {
    color: COLORS.grayMedium,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  filterRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    zIndex: 1002,
  },
  sortDropdown: {
    width: 150,
    zIndex: 1003,
    elevation: 7,
  },
  orderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.transparent,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  orderButtonText: {
    color: COLORS.grayMedium,
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.grayDark,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 22,
  },
  dropdownButton: {
    paddingHorizontal: 8,
    paddingVertical: 12,
    backgroundColor: COLORS.transparent,
    borderRadius: 0,
    borderWidth: 0,
    borderColor: COLORS.transparent,
    shadowColor: COLORS.transparent,
    shadowOpacity: 0,
    shadowRadius: 0,
    minHeight: 20,
  },
});
