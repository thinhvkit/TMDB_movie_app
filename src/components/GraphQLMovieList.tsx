import React from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import {useMovies} from '../hooks/useGraphQLMovies';
import MovieCard from './MovieCard';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import type {Movie, MovieCategory} from '../types';
import {COLORS} from '../constants/colors';

interface GraphQLMovieListProps {
  category: MovieCategory;
  onMoviePress: (movie: Movie) => void;
}

export const GraphQLMovieList: React.FC<GraphQLMovieListProps> = ({
  category,
  onMoviePress,
}) => {
  const {data, loading, error} = useMovies(category);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message="Failed to load movies from GraphQL" />;
  }

  if (!data || data.results.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No movies found</Text>
      </View>
    );
  }

  const renderMovieCard = ({item}: {item: Movie}) => (
    <MovieCard movie={item} onPress={() => onMoviePress(item)} />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Movies from GraphQL ({category})</Text>
      <FlatList
        data={data.results}
        renderItem={renderMovieCard}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    padding: 16,
    textAlign: 'center',
  },
  listContainer: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
