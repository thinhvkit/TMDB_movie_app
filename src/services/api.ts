import {
  Movie,
  MovieDetails,
  Credits,
  TMDBResponse,
  User,
  MovieCategory,
} from '../types';
import {API_READ_ACCESS_TOKEN} from '@env';

const BASE_URL = 'https://api.themoviedb.org/3';

const headers = {
  Authorization: `Bearer ${API_READ_ACCESS_TOKEN}`,
  'Content-Type': 'application/json;charset=utf-8',
};

class APIService {
  private async makeRequest<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async getNowPlayingMovies(page: number = 1): Promise<TMDBResponse<Movie>> {
    return this.makeRequest<TMDBResponse<Movie>>(
      `/movie/now_playing?page=${page}`,
    );
  }

  async getUpcomingMovies(page: number = 1): Promise<TMDBResponse<Movie>> {
    return this.makeRequest<TMDBResponse<Movie>>(
      `/movie/upcoming?page=${page}`,
    );
  }

  async getPopularMovies(page: number = 1): Promise<TMDBResponse<Movie>> {
    return this.makeRequest<TMDBResponse<Movie>>(`/movie/popular?page=${page}`);
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

  async getMovieDetails(movieId: number): Promise<MovieDetails> {
    return this.makeRequest<MovieDetails>(`/movie/${movieId}`);
  }

  async getMovieCredits(movieId: number): Promise<Credits> {
    return this.makeRequest<Credits>(`/movie/${movieId}/credits`);
  }

  async getMovieRecommendations(
    movieId: number,
    page: number = 1,
  ): Promise<TMDBResponse<Movie>> {
    return this.makeRequest<TMDBResponse<Movie>>(
      `/movie/${movieId}/recommendations?page=${page}`,
    );
  }

  async searchMovies(
    query: string,
    page: number = 1,
  ): Promise<TMDBResponse<Movie>> {
    if (!query.trim()) {
      throw new Error('Search query cannot be empty');
    }

    const encodedQuery = encodeURIComponent(query);
    return this.makeRequest<TMDBResponse<Movie>>(
      `/search/movie?query=${encodedQuery}&page=${page}`,
    );
  }

  async getAccountDetails(): Promise<User> {
    return this.makeRequest<User>('/account');
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

export const apiService = new APIService();
