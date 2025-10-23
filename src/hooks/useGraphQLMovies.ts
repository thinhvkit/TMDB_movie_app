import {useQuery} from '@apollo/client/react';
import {useMemo} from 'react';
import {
  GET_POPULAR_MOVIES,
  GET_UPCOMING_MOVIES,
  GET_NOW_PLAYING_MOVIES,
  SEARCH_MOVIES,
  GET_MOVIE,
  GET_GENRES,
  GET_MOVIES_BY_GENRE,
  GET_MOVIE_CREDITS,
  GET_MOVIE_RECOMMENDATIONS,
} from '../services/graphqlQueries';
import type {
  SearchMoviesResponse,
  GetMovieResponse,
  GetGenresResponse,
  GetMoviesByGenreResponse,
  GetMovieCreditsResponse,
  GetMovieRecommendationsResponse,
  GraphQLMovie,
  GraphQLGenre,
} from '../types/graphql';
import type {
  Movie,
  TMDBResponse,
  Genre,
  MovieCategory,
  Credits,
} from '../types';

export function useMovies(category: MovieCategory, page: number = 1) {
  const getQuery = () => {
    switch (category) {
      case 'popular':
        return GET_POPULAR_MOVIES;
      case 'now_playing':
        return GET_NOW_PLAYING_MOVIES;
      case 'upcoming':
        return GET_UPCOMING_MOVIES;
      default:
        return GET_POPULAR_MOVIES;
    }
  };

  const {data, loading, error, refetch} = useQuery(getQuery(), {
    variables: {page},
    errorPolicy: 'all',
  });

  const transformedData = useMemo((): TMDBResponse<Movie> | null => {
    if (!data) {
      return null;
    }

    const result =
      (data as any).popularMovies ||
      (data as any).nowPlayingMovies ||
      (data as any).upcomingMovies;
    if (!result) {
      return null;
    }

    return {
      page: result.page,
      total_pages: result.totalPages,
      total_results: result.totalResults,
      results: result.results.map((movie: GraphQLMovie) => ({
        id: parseInt(movie.id, 10),
        title: movie.title,
        overview: movie.overview || '',
        poster_path: movie.posterPath || null,
        backdrop_path: movie.backdropPath || null,
        release_date: movie.releaseDate || '',
        genre_ids:
          movie.genres?.map((g: GraphQLGenre) => parseInt(g.id, 10)) || [],
        adult: movie.adult || false,
        original_language: movie.originalLanguage || '',
        original_title: movie.originalTitle || '',
        popularity: movie.popularity || 0,
        vote_count: movie.voteCount || 0,
        video: movie.video || false,
        vote_average: movie.voteAverage || 0,
      })),
    };
  }, [data]);

  return {
    data: transformedData,
    loading,
    error,
    refetch,
  };
}

export function useSearchMovies(query: string, page: number = 1) {
  const {data, loading, error, refetch} = useQuery<SearchMoviesResponse>(
    SEARCH_MOVIES,
    {
      variables: {query, page},
      skip: !query.trim(),
      errorPolicy: 'all',
    },
  );

  const transformedData = useMemo((): TMDBResponse<Movie> | null => {
    if (!data?.searchMovies) {
      return null;
    }

    return {
      page: data.searchMovies.page,
      total_pages: data.searchMovies.totalPages,
      total_results: data.searchMovies.totalResults,
      results: data.searchMovies.results.map((movie: GraphQLMovie) => ({
        id: parseInt(movie.id, 10),
        title: movie.title,
        overview: movie.overview || '',
        poster_path: movie.posterPath || null,
        backdrop_path: movie.backdropPath || null,
        release_date: movie.releaseDate || '',
        genre_ids:
          movie.genres?.map((g: GraphQLGenre) => parseInt(g.id, 10)) || [],
        adult: movie.adult || false,
        original_language: movie.originalLanguage || '',
        original_title: movie.originalTitle || '',
        popularity: movie.popularity || 0,
        vote_count: movie.voteCount || 0,
        video: movie.video || false,
        vote_average: movie.voteAverage || 0,
      })),
    };
  }, [data]);

  return {
    data: transformedData,
    loading,
    error,
    refetch,
  };
}

export function useMovie(movieId: number) {
  const {data, loading, error, refetch} = useQuery<GetMovieResponse>(
    GET_MOVIE,
    {
      variables: {id: movieId.toString()},
      skip: !movieId,
      errorPolicy: 'all',
    },
  );

  return {
    data: data?.movie || null,
    loading,
    error,
    refetch,
  };
}

export function useGenres() {
  const {data, loading, error, refetch} = useQuery<GetGenresResponse>(
    GET_GENRES,
    {
      errorPolicy: 'all',
    },
  );

  const transformedData = useMemo((): Genre[] | null => {
    if (!data?.genres) {
      return null;
    }

    return data.genres.map((genre: GraphQLGenre) => ({
      id: parseInt(genre.id, 10),
      name: genre.name,
    }));
  }, [data]);

  return {
    data: transformedData,
    loading,
    error,
    refetch,
  };
}

export function useMoviesByGenre(genreId: number, page: number = 1) {
  const {data, loading, error, refetch} = useQuery<GetMoviesByGenreResponse>(
    GET_MOVIES_BY_GENRE,
    {
      variables: {genreId: genreId.toString(), page},
      skip: !genreId,
      errorPolicy: 'all',
    },
  );

  const transformedData = useMemo((): TMDBResponse<Movie> | null => {
    if (!data?.moviesByGenre) {
      return null;
    }

    return {
      page: data.moviesByGenre.page,
      total_pages: data.moviesByGenre.totalPages,
      total_results: data.moviesByGenre.totalResults,
      results: data.moviesByGenre.results.map((movie: GraphQLMovie) => ({
        id: parseInt(movie.id, 10),
        title: movie.title,
        overview: movie.overview || '',
        poster_path: movie.posterPath || null,
        backdrop_path: movie.backdropPath || null,
        release_date: movie.releaseDate || '',
        genre_ids:
          movie.genres?.map((g: GraphQLGenre) => parseInt(g.id, 10)) || [],
        adult: movie.adult || false,
        original_language: movie.originalLanguage || '',
        original_title: movie.originalTitle || '',
        popularity: movie.popularity || 0,
        vote_count: movie.voteCount || 0,
        video: movie.video || false,
        vote_average: movie.voteAverage || 0,
      })),
    };
  }, [data]);

  return {
    data: transformedData,
    loading,
    error,
    refetch,
  };
}

export function useMovieCredits(movieId: number) {
  const {data, loading, error, refetch} = useQuery<GetMovieCreditsResponse>(
    GET_MOVIE_CREDITS,
    {
      variables: {id: movieId.toString()},
      skip: !movieId,
      errorPolicy: 'all',
    },
  );

  const transformedData = useMemo((): Credits | null => {
    if (!data?.movieCredits) {
      return null;
    }

    const credits = data.movieCredits;
    return {
      id: parseInt(credits.id, 10),
      cast: credits.cast.map(castMember => ({
        adult: false,
        gender: castMember.gender || 0,
        id: parseInt(castMember.id, 10),
        known_for_department: castMember.knownForDepartment || '',
        name: castMember.name,
        original_name: castMember.name,
        popularity: 0,
        profile_path: castMember.profilePath || null,
        cast_id: parseInt(castMember.id, 10),
        character: castMember.character,
        credit_id: castMember.id,
        order: castMember.order,
      })),
      crew: credits.crew.map(crewMember => ({
        adult: false,
        gender: crewMember.gender || 0,
        id: parseInt(crewMember.id, 10),
        known_for_department:
          crewMember.knownForDepartment || crewMember.department,
        name: crewMember.name,
        original_name: crewMember.name,
        popularity: 0,
        profile_path: crewMember.profilePath || null,
        credit_id: crewMember.id,
        department: crewMember.department,
        job: crewMember.job,
      })),
    };
  }, [data]);

  return {
    data: transformedData,
    loading,
    error,
    refetch,
  };
}

export function useMovieRecommendations(movieId: number, page: number = 1) {
  const {data, loading, error, refetch} =
    useQuery<GetMovieRecommendationsResponse>(GET_MOVIE_RECOMMENDATIONS, {
      variables: {id: movieId.toString(), page},
      skip: !movieId,
      errorPolicy: 'all',
    });

  const transformedData = useMemo((): TMDBResponse<Movie> | null => {
    if (!data?.movieRecommendations) {
      return null;
    }

    return {
      page: data.movieRecommendations.page,
      total_pages: data.movieRecommendations.totalPages,
      total_results: data.movieRecommendations.totalResults,
      results: data.movieRecommendations.results.map((movie: GraphQLMovie) => ({
        id: parseInt(movie.id, 10),
        title: movie.title,
        overview: movie.overview || '',
        poster_path: movie.posterPath || null,
        backdrop_path: movie.backdropPath || null,
        release_date: movie.releaseDate || '',
        genre_ids:
          movie.genres?.map((g: GraphQLGenre) => parseInt(g.id, 10)) || [],
        adult: movie.adult || false,
        original_language: movie.originalLanguage || '',
        original_title: movie.originalTitle || '',
        popularity: movie.popularity || 0,
        vote_count: movie.voteCount || 0,
        video: movie.video || false,
        vote_average: movie.voteAverage || 0,
      })),
    };
  }, [data]);

  return {
    data: transformedData,
    loading,
    error,
    refetch,
  };
}
