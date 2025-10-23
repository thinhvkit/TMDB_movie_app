import {graphqlClient} from './graphqlClient';
import {
  GET_MOVIE,
  SEARCH_MOVIES,
  GET_POPULAR_MOVIES,
  GET_TOP_RATED_MOVIES,
  GET_UPCOMING_MOVIES,
  GET_NOW_PLAYING_MOVIES,
  GET_GENRES,
  GET_MOVIES_BY_GENRE,
  GET_MOVIE_CREDITS,
  GET_MOVIE_RECOMMENDATIONS,
} from './graphqlQueries';
import type {
  GetMovieResponse,
  SearchMoviesResponse,
  GetPopularMoviesResponse,
  GetTopRatedMoviesResponse,
  GetUpcomingMoviesResponse,
  GetNowPlayingMoviesResponse,
  GetGenresResponse,
  GetMoviesByGenreResponse,
  GetMovieCreditsResponse,
  GetMovieRecommendationsResponse,
  GraphQLMovie,
  GraphQLSearchResult,
  GraphQLGenre,
  GraphQLCredits,
  GraphQLCast,
  GraphQLCrew,
} from '../types/graphql';
import type {
  Movie,
  TMDBResponse,
  Genre,
  MovieCategory,
  Cast,
  Crew,
  Credits,
  MovieDetails,
} from '../types';

class GraphQLService {
  private transformGraphQLMovieToMovie(graphqlMovie: GraphQLMovie): Movie {
    return {
      id: parseInt(graphqlMovie.id, 10),
      title: graphqlMovie.title,
      overview: graphqlMovie.overview || '',
      poster_path: graphqlMovie.posterPath || null,
      backdrop_path: graphqlMovie.backdropPath || null,
      release_date: graphqlMovie.releaseDate || '',
      genre_ids: graphqlMovie.genres?.map(g => parseInt(g.id, 10)) || [],
      adult: graphqlMovie.adult || false,
      original_language: graphqlMovie.originalLanguage || '',
      original_title: graphqlMovie.originalTitle || '',
      popularity: graphqlMovie.popularity || 0,
      vote_count: graphqlMovie.voteCount || 0,
      video: graphqlMovie.video || false,
      vote_average: graphqlMovie.voteAverage || 0,
    };
  }

  private transformGraphQLSearchResult(
    graphqlResult: GraphQLSearchResult,
  ): TMDBResponse<Movie> {
    return {
      page: graphqlResult.page,
      results: graphqlResult.results.map(movie =>
        this.transformGraphQLMovieToMovie(movie),
      ),
      total_pages: graphqlResult.totalPages,
      total_results: graphqlResult.totalResults,
    };
  }

  private transformGraphQLGenre(graphqlGenre: GraphQLGenre): Genre {
    return {
      id: parseInt(graphqlGenre.id, 10),
      name: graphqlGenre.name,
    };
  }

  private transformGraphQLCast(graphqlCast: GraphQLCast): Cast {
    return {
      adult: false,
      gender: graphqlCast.gender || 0,
      id: parseInt(graphqlCast.id, 10),
      known_for_department: graphqlCast.knownForDepartment || '',
      name: graphqlCast.name,
      original_name: graphqlCast.name,
      popularity: 0,
      profile_path: graphqlCast.profilePath || null,
      cast_id: parseInt(graphqlCast.id, 10),
      character: graphqlCast.character,
      credit_id: graphqlCast.id,
      order: graphqlCast.order,
    };
  }

  private transformGraphQLCrew(graphqlCrew: GraphQLCrew): Crew {
    return {
      adult: false,
      gender: graphqlCrew.gender || 0,
      id: parseInt(graphqlCrew.id, 10),
      known_for_department:
        graphqlCrew.knownForDepartment || graphqlCrew.department,
      name: graphqlCrew.name,
      original_name: graphqlCrew.name,
      popularity: 0,
      profile_path: graphqlCrew.profilePath || null,
      credit_id: graphqlCrew.id,
      department: graphqlCrew.department,
      job: graphqlCrew.job,
    };
  }

  private transformGraphQLCredits(graphqlCredits: GraphQLCredits): Credits {
    return {
      id: parseInt(graphqlCredits.id, 10),
      cast: graphqlCredits.cast.map(cast => this.transformGraphQLCast(cast)),
      crew: graphqlCredits.crew.map(crew => this.transformGraphQLCrew(crew)),
    };
  }

  private transformGraphQLMovieToMovieDetails(
    graphqlMovie: GraphQLMovie,
  ): MovieDetails {
    return {
      ...this.transformGraphQLMovieToMovie(graphqlMovie),
      belongs_to_collection: null,
      budget: graphqlMovie.budget || 0,
      genres:
        graphqlMovie.genres?.map(g => this.transformGraphQLGenre(g)) || [],
      homepage: graphqlMovie.homepage || '',
      imdb_id: graphqlMovie.imdbId || '',
      production_companies:
        graphqlMovie.productionCompanies?.map(pc => ({
          id: parseInt(pc.id, 10),
          logo_path: pc.logoPath || null,
          name: pc.name,
          origin_country: pc.originCountry || '',
        })) || [],
      production_countries:
        graphqlMovie.productionCountries?.map(pc => ({
          iso_3166_1: pc.iso31661,
          name: pc.name,
        })) || [],
      revenue: graphqlMovie.revenue || 0,
      runtime: graphqlMovie.runtime || 0,
      spoken_languages:
        graphqlMovie.spokenLanguages?.map(sl => ({
          english_name: sl.name,
          iso_639_1: sl.iso6391,
          name: sl.name,
        })) || [],
      status: graphqlMovie.status || '',
      tagline: graphqlMovie.tagline || '',
    };
  }

  async getMovie(movieId: number): Promise<GraphQLMovie | null> {
    try {
      const {data} = await graphqlClient.query<GetMovieResponse>({
        query: GET_MOVIE,
        variables: {id: movieId.toString()},
      });
      return data?.movie || null;
    } catch (error) {
      console.error('GraphQL getMovie error:', error);
      throw error;
    }
  }

  async searchMovies(
    query: string,
    page: number = 1,
  ): Promise<TMDBResponse<Movie>> {
    try {
      const {data} = await graphqlClient.query<SearchMoviesResponse>({
        query: SEARCH_MOVIES,
        variables: {query, page},
      });
      return this.transformGraphQLSearchResult(
        data?.searchMovies || {
          page: 1,
          totalPages: 0,
          totalResults: 0,
          results: [],
        },
      );
    } catch (error) {
      console.error('GraphQL searchMovies error:', error);
      throw error;
    }
  }

  async getPopularMovies(page: number = 1): Promise<TMDBResponse<Movie>> {
    try {
      const {data} = await graphqlClient.query<GetPopularMoviesResponse>({
        query: GET_POPULAR_MOVIES,
        variables: {page},
      });
      return this.transformGraphQLSearchResult(
        data?.popularMovies || {
          page: 1,
          totalPages: 0,
          totalResults: 0,
          results: [],
        },
      );
    } catch (error) {
      console.error('GraphQL getPopularMovies error:', error);
      throw error;
    }
  }

  async getTopRatedMovies(page: number = 1): Promise<TMDBResponse<Movie>> {
    try {
      const {data} = await graphqlClient.query<GetTopRatedMoviesResponse>({
        query: GET_TOP_RATED_MOVIES,
        variables: {page},
      });
      return this.transformGraphQLSearchResult(
        data?.topRatedMovies || {
          page: 1,
          totalPages: 0,
          totalResults: 0,
          results: [],
        },
      );
    } catch (error) {
      console.error('GraphQL getTopRatedMovies error:', error);
      throw error;
    }
  }

  async getUpcomingMovies(page: number = 1): Promise<TMDBResponse<Movie>> {
    try {
      const {data} = await graphqlClient.query<GetUpcomingMoviesResponse>({
        query: GET_UPCOMING_MOVIES,
        variables: {page},
      });
      return this.transformGraphQLSearchResult(
        data?.upcomingMovies || {
          page: 1,
          totalPages: 0,
          totalResults: 0,
          results: [],
        },
      );
    } catch (error) {
      console.error('GraphQL getUpcomingMovies error:', error);
      throw error;
    }
  }

  async getNowPlayingMovies(page: number = 1): Promise<TMDBResponse<Movie>> {
    try {
      const {data} = await graphqlClient.query<GetNowPlayingMoviesResponse>({
        query: GET_NOW_PLAYING_MOVIES,
        variables: {page},
      });
      return this.transformGraphQLSearchResult(
        data?.nowPlayingMovies || {
          page: 1,
          totalPages: 0,
          totalResults: 0,
          results: [],
        },
      );
    } catch (error) {
      console.error('GraphQL getNowPlayingMovies error:', error);
      throw error;
    }
  }

  async getMoviesByCategory(
    category: MovieCategory,
    page: number = 1,
  ): Promise<TMDBResponse<Movie>> {
    switch (category) {
      case 'now_playing':
        return this.getNowPlayingMovies(page);
      case 'upcoming':
        return this.getUpcomingMovies(page);
      case 'popular':
        return this.getPopularMovies(page);
      default:
        throw new Error(`Unknown category: ${category}`);
    }
  }

  async getGenres(): Promise<Genre[]> {
    try {
      const {data} = await graphqlClient.query<GetGenresResponse>({
        query: GET_GENRES,
      });
      return (
        data?.genres?.map(genre => this.transformGraphQLGenre(genre)) || []
      );
    } catch (error) {
      console.error('GraphQL getGenres error:', error);
      throw error;
    }
  }

  async getMoviesByGenre(
    genreId: number,
    page: number = 1,
  ): Promise<TMDBResponse<Movie>> {
    try {
      const {data} = await graphqlClient.query<GetMoviesByGenreResponse>({
        query: GET_MOVIES_BY_GENRE,
        variables: {genreId: genreId.toString(), page},
      });
      return this.transformGraphQLSearchResult(
        data?.moviesByGenre || {
          page: 1,
          totalPages: 0,
          totalResults: 0,
          results: [],
        },
      );
    } catch (error) {
      console.error('GraphQL getMoviesByGenre error:', error);
      throw error;
    }
  }

  async getMovieDetails(movieId: number): Promise<MovieDetails> {
    try {
      const {data} = await graphqlClient.query<GetMovieResponse>({
        query: GET_MOVIE,
        variables: {id: movieId.toString()},
      });
      if (!data?.movie) {
        throw new Error('Movie not found');
      }
      return this.transformGraphQLMovieToMovieDetails(data.movie);
    } catch (error) {
      console.error('GraphQL getMovieDetails error:', error);
      throw error;
    }
  }

  async getMovieCredits(movieId: number): Promise<Credits> {
    try {
      const {data} = await graphqlClient.query<GetMovieCreditsResponse>({
        query: GET_MOVIE_CREDITS,
        variables: {id: movieId.toString()},
      });
      return this.transformGraphQLCredits(
        data?.movieCredits || {id: '0', cast: [], crew: []},
      );
    } catch (error) {
      console.error('GraphQL getMovieCredits error:', error);
      throw error;
    }
  }

  async getMovieRecommendations(
    movieId: number,
    page: number = 1,
  ): Promise<TMDBResponse<Movie>> {
    try {
      const {data} = await graphqlClient.query<GetMovieRecommendationsResponse>(
        {
          query: GET_MOVIE_RECOMMENDATIONS,
          variables: {id: movieId.toString(), page},
        },
      );
      return this.transformGraphQLSearchResult(
        data?.movieRecommendations || {
          page: 1,
          totalPages: 0,
          totalResults: 0,
          results: [],
        },
      );
    } catch (error) {
      console.error('GraphQL getMovieRecommendations error:', error);
      throw error;
    }
  }

  getImageUrl(path: string | null, size: string = 'w500'): string {
    if (!path) {
      return 'https://via.placeholder.com/500x750?text=No+Image';
    }
    return `https://image.tmdb.org/t/p/${size}${path}`;
  }

  getPosterUrl(posterPath: string | null): string {
    return this.getImageUrl(posterPath, 'w500');
  }

  getBackdropUrl(backdropPath: string | null): string {
    return this.getImageUrl(backdropPath, 'w1280');
  }

  getProfileUrl(profilePath: string | null): string {
    return this.getImageUrl(profilePath, 'w185');
  }
}

export const graphqlService = new GraphQLService();
