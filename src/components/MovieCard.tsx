import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {Movie} from '../types';
import {apiService} from '../services/api';
import {formatDate, formatRating, truncateText} from '../utils/sorting';
import CancelIcon from './svg-icons/CancelIcon';

interface MovieCardProps {
  movie: Movie;
  onPress: () => void;
  showRemoveButton?: boolean;
  onRemove?: () => void;
}

export default function MovieCard({
  movie,
  onPress,
  showRemoveButton = false,
  onRemove,
}: MovieCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.card}>
        <Image
          source={{uri: apiService.getPosterUrl(movie.poster_path)}}
          style={styles.poster}
          resizeMode="cover"
        />
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{movie.title}</Text>
            {showRemoveButton && onRemove && (
              <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
                <CancelIcon />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.releaseDate}>
            {formatDate(movie.release_date)}
          </Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>
              ⭐ {formatRating(movie.vote_average)}
            </Text>
          </View>
          <Text style={styles.overview}>
            {truncateText(movie.overview, 120)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    marginHorizontal: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  poster: {
    width: 100,
    height: 150,
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
    marginRight: 8,
  },
  removeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  releaseDate: {
    fontSize: 12,
    color: '#999999',
    marginBottom: 4,
  },
  ratingContainer: {
    marginBottom: 8,
  },
  rating: {
    fontSize: 12,
    color: '#666',
  },
  overview: {
    fontSize: 12,
    color: '#000000',
    lineHeight: 16,
  },
});
