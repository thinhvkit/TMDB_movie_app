/* cSpell:ignore watchlist */
import React, {useCallback, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  FlatList,
} from 'react-native';
import {useRoute, RouteProp} from '@react-navigation/native';
import Svg, {Circle} from 'react-native-svg';

import {useAppContext} from '../contexts/AppContext';
import {
  useMovie,
  useMovieCredits,
  useMovieRecommendations,
} from '../hooks/useGraphQLMovies';
import {graphqlService} from '../services/graphqlService';
import {Cast, Movie} from '../types';
import {formatDate, formatRuntime, getCertification} from '../utils/sorting';
import {RootStackParamList} from '../navigation/AppNavigator';

import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import strings from '../constants/strings.json';
import WatchListIcon from '../components/svg-icons/WatchListIcon';
import {COLORS} from '../constants/colors';

const CircularProgress = React.memo(({score}: {score: number}) => {
  const radius = 25;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - score / 10);

  return (
    <Svg width={60} height={60} style={{position: 'absolute'}}>
      <Circle
        cx={30}
        cy={30}
        r={radius}
        stroke={COLORS.grayDark}
        strokeWidth={4}
        fill="transparent"
      />
      <Circle
        cx={30}
        cy={30}
        r={radius}
        stroke={COLORS.success}
        strokeWidth={4}
        fill="transparent"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        transform="rotate(-90 30 30)"
      />
    </Svg>
  );
});

type MovieDetailRouteProp = RouteProp<RootStackParamList, 'MovieDetail'>;

const {height} = Dimensions.get('window');

export default function MovieDetailScreen() {
  const route = useRoute<MovieDetailRouteProp>();
  const {movieId} = route.params;
  const {addToWatchlist, removeFromWatchlist, isInWatchlist} = useAppContext();

  // GraphQL hooks for all data
  const {
    data: graphqlMovie,
    loading: movieLoading,
    error: movieError,
    refetch: refetchMovie,
  } = useMovie(movieId);

  const {
    data: creditsData,
    loading: creditsLoading,
    error: creditsError,
    refetch: refetchCredits,
  } = useMovieCredits(movieId);

  const {
    data: recommendationsData,
    loading: recommendationsLoading,
    error: recommendationsError,
    refetch: refetchRecommendations,
  } = useMovieRecommendations(movieId);

  // Helper function to normalize movie data
  const normalizeMovie = (movie: any) => {
    if (!movie) {
      return null;
    }
    return {
      ...movie,
      id: typeof movie.id === 'string' ? parseInt(movie.id, 10) : movie.id,
      overview: movie.overview || '',
      poster_path: movie.posterPath || movie.poster_path || null,
      backdrop_path: movie.backdropPath || movie.backdrop_path || null,
      release_date: movie.releaseDate || movie.release_date || '',
      adult: movie.adult || false,
      original_language:
        movie.originalLanguage || movie.original_language || '',
      original_title: movie.originalTitle || movie.original_title || '',
      vote_average: movie.voteAverage || movie.vote_average || 0,
      vote_count: movie.voteCount || movie.vote_count || 0,
      genres: movie.genres || [],
      runtime: movie.runtime,
      status: movie.status,
      tagline: movie.tagline,
    };
  };

  // Combine all GraphQL data
  const loading = movieLoading || creditsLoading || recommendationsLoading;
  const error = movieError || creditsError || recommendationsError;
  const movie = normalizeMovie(graphqlMovie);

  // Process data from GraphQL hooks
  const cast = creditsData?.cast.slice(0, 10) || [];
  const crew =
    creditsData?.crew.filter(
      person => person.job === 'Director' || person.job === 'Writer',
    ) || [];
  const recommendations = recommendationsData?.results.slice(0, 10) || [];

  const inWatchlist = movie ? isInWatchlist(movie.id) : false;

  const handleRetry = useCallback(() => {
    refetchMovie();
    refetchCredits();
    refetchRecommendations();
  }, [refetchMovie, refetchCredits, refetchRecommendations]);

  const handleWatchlistToggle = () => {
    if (!movie) {
      return;
    }

    if (inWatchlist) {
      removeFromWatchlist(movie.id);
    } else {
      // Convert to Movie type for watchlist
      const movieForWatchlist = {
        ...movie,
        genre_ids:
          movie.genres?.map((g: any) =>
            typeof g.id === 'string' ? parseInt(g.id, 10) : g.id,
          ) || [],
        popularity: movie.popularity || 0,
        video: movie.video || false,
      };
      addToWatchlist(movieForWatchlist);
    }
  };

  const renderCastMember = ({item}: {item: Cast}) => (
    <View style={styles.castMember}>
      <Image
        source={{uri: graphqlService.getProfileUrl(item.profile_path)}}
        style={styles.castImage}
        resizeMode="cover"
      />
      <Text style={styles.castName}>{item.name}</Text>
      <Text style={styles.castCharacter}>{item.character}</Text>
    </View>
  );

  const renderRecommendation = ({item}: {item: Movie}) => (
    <View style={styles.recommendationItem}>
      <Image
        source={{uri: graphqlService.getPosterUrl(item.poster_path)}}
        style={styles.recommendationPoster}
        resizeMode="cover"
      />
      <Text style={styles.recommendationTitle}>{item.title}</Text>
    </View>
  );

  const scorePercentage = useMemo(
    () => (movie ? Math.round(movie.vote_average * 10) : 0),
    [movie],
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingSpinner message={strings.loadingMovieDetails} />
      </SafeAreaView>
    );
  }

  if (error || !movie) {
    return (
      <SafeAreaView style={styles.container}>
        <ErrorMessage
          message={
            typeof error === 'string'
              ? error
              : error?.message || strings.movieNotFound
          }
          onRetry={handleRetry}
        />
      </SafeAreaView>
    );
  }

  const director = crew.find(person => person.job === 'Director');
  const writer = crew.find(person => person.job === 'Writer');

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Backdrop Image */}
      <View style={styles.backdropContainer}>
        <Image
          source={{uri: graphqlService.getBackdropUrl(movie.backdrop_path)}}
          style={styles.backdrop}
          resizeMode="cover"
        />
        <View style={styles.backdropOverlay} />
      </View>

      {/* Movie Info */}

      <View style={styles.movieInfo}>
        <View style={styles.movieHeader}>
          <Image
            source={{uri: graphqlService.getPosterUrl(movie.poster_path)}}
            style={styles.poster}
            resizeMode="cover"
          />
          <View style={styles.movieDetails}>
            <Text style={styles.title}>{movie.title}</Text>
            <Text style={styles.year}>
              ({new Date(movie.release_date || '').getFullYear()})
            </Text>

            <View style={styles.movieMeta}>
              <View style={styles.certificationContainer}>
                <Text style={styles.certification}>
                  {getCertification(movie.adult)}
                </Text>
              </View>
              <Text style={styles.metaText}>
                {formatDate(movie.release_date)} •{' '}
                {formatRuntime(movie.runtime || 0)}
              </Text>
            </View>

            <Text style={styles.genres}>
              {movie.genres?.map((genre: any) => genre.name).join(', ') || ''}
            </Text>

            <Text style={styles.status}>
              {strings.status}: {movie.status}
            </Text>
            <Text style={styles.language}>
              {strings.originalLanguage}:{' '}
              {(movie.original_language || '').toUpperCase()}
            </Text>
          </View>
        </View>

        {/* User Score */}
        <View style={styles.userScoreContainer}>
          <View style={styles.scoreContainer}>
            <View style={styles.scoreCircle}>
              <CircularProgress score={movie.vote_average} />
              <Text style={styles.scoreText}>
                {scorePercentage}
                <Text style={styles.percentText}>%</Text>
              </Text>
            </View>
            <Text style={styles.userScoreLabel}>{strings.userScore}</Text>
          </View>

          <View style={styles.directorContainer}>
            {director && (
              <View style={styles.directorInfo}>
                <Text style={styles.directorName}>{director.name}</Text>
                <Text style={styles.directorJob}>{strings.director}</Text>
              </View>
            )}
            {writer && (
              <View style={styles.directorInfo}>
                <Text style={styles.directorName}>{writer.name}</Text>
                <Text style={styles.directorJob}>{strings.writer}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Tagline */}
        {movie.tagline && <Text style={styles.tagline}>{movie.tagline}</Text>}

        {/* Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{strings.overview}</Text>
          <Text style={styles.overview}>{movie.overview}</Text>
        </View>

        {/* Watchlist Button */}
        <TouchableOpacity
          style={[
            styles.watchlistButton,
            inWatchlist && styles.watchlistButtonActive,
          ]}
          onPress={handleWatchlistToggle}>
          <WatchListIcon />
          <Text style={styles.watchlistButtonText}>
            {inWatchlist ? strings.removeFromWatchlist : strings.addToWatchlist}
          </Text>
        </TouchableOpacity>

        {/* Cast */}
        {cast.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{strings.cast}</Text>
            <FlatList
              data={cast}
              renderItem={renderCastMember}
              keyExtractor={item => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.castList}
            />
          </View>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{strings.recommendedMovies}</Text>
            <FlatList
              data={recommendations}
              renderItem={renderRecommendation}
              keyExtractor={item => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recommendationsList}
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.accent,
  },
  backdropContainer: {
    position: 'relative',
    height: height * 0.3,
  },
  backdrop: {
    width: '100%',
    height: '100%',
  },
  backdropOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.backgroundOverlay,
  },
  movieInfo: {
    backgroundColor: COLORS.white,
    padding: 16,
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  movieHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: 8,
    marginRight: 16,
  },
  movieDetails: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 4,
  },
  year: {
    fontSize: 16,
    color: COLORS.black,
    marginBottom: 8,
  },
  movieMeta: {
    marginBottom: 8,
  },
  certificationContainer: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderColor: COLORS.white,
    borderWidth: 1,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  certification: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  metaText: {
    color: COLORS.black,
    fontSize: 14,
  },
  genres: {
    color: COLORS.black,
    fontSize: 14,
    marginBottom: 4,
  },
  status: {
    color: COLORS.black,
    fontSize: 12,
    marginBottom: 2,
  },
  language: {
    color: COLORS.black,
    fontSize: 12,
  },
  userScoreContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreContainer: {
    flex: 1,
    gap: 8,
  },
  svgAbsolute: {
    position: 'absolute',
  },
  directorContainer: {
    flex: 1,
    gap: 8,
  },
  scoreCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.black,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },
  scoreText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  percentText: {
    color: COLORS.white,
    fontSize: 8,
    fontWeight: 'normal',
    textAlignVertical: 'top',
  },
  userScoreLabel: {
    color: COLORS.black,
    fontSize: 14,
    fontWeight: '600',
    marginRight: 20,
  },
  directorInfo: {
    marginRight: 16,
  },
  directorName: {
    color: COLORS.black,
    fontSize: 14,
    fontWeight: '600',
  },
  directorJob: {
    color: COLORS.black,
    fontSize: 12,
  },
  tagline: {
    color: COLORS.black,
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 12,
  },
  overview: {
    color: COLORS.black,
    fontSize: 14,
    lineHeight: 20,
  },
  watchlistButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderColor: COLORS.black,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 24,
  },
  watchlistButtonActive: {
    backgroundColor: COLORS.success,
  },
  watchlistButtonText: {
    color: COLORS.black,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  castList: {
    paddingRight: 16,
  },
  castMember: {
    marginRight: 12,
    alignItems: 'center',
    width: 100,
  },
  castImage: {
    width: 80,
    height: 80,
    borderRadius: 2,
    marginBottom: 8,
  },
  castName: {
    color: COLORS.black,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 2,
  },
  castCharacter: {
    color: COLORS.black,
    fontSize: 10,
    textAlign: 'center',
  },
  recommendationsList: {
    paddingRight: 16,
  },
  recommendationItem: {
    marginRight: 12,
    width: 120,
  },
  recommendationPoster: {
    width: 120,
    height: 180,
    borderRadius: 8,
    marginBottom: 8,
  },
  recommendationTitle: {
    color: COLORS.black,
    fontSize: 12,
    textAlign: 'center',
  },
});
