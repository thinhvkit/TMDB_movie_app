export interface GraphQLMovie {
  id: string;
  title: string;
  overview?: string;
  releaseDate?: string;
  posterPath?: string;
  backdropPath?: string;
  voteAverage?: number;
  voteCount?: number;
  popularity?: number;
  adult?: boolean;
  originalLanguage?: string;
  originalTitle?: string;
  video?: boolean;
  genres?: GraphQLGenre[];
  runtime?: number;
  budget?: number;
  revenue?: number;
  status?: string;
  tagline?: string;
  homepage?: string;
  imdbId?: string;
  productionCompanies?: GraphQLProductionCompany[];
  productionCountries?: GraphQLProductionCountry[];
  spokenLanguages?: GraphQLSpokenLanguage[];
}

export interface GraphQLGenre {
  id: string;
  name: string;
}

export interface GraphQLProductionCompany {
  id: string;
  name: string;
  logoPath?: string;
  originCountry?: string;
}

export interface GraphQLProductionCountry {
  iso31661: string;
  name: string;
}

export interface GraphQLSpokenLanguage {
  iso6391: string;
  name: string;
}

export interface GraphQLSearchResult {
  page: number;
  totalResults: number;
  totalPages: number;
  results: GraphQLMovie[];
}

export interface GetMovieResponse {
  movie: GraphQLMovie | null;
}

export interface SearchMoviesResponse {
  searchMovies: GraphQLSearchResult;
}

export interface GetPopularMoviesResponse {
  popularMovies: GraphQLSearchResult;
}

export interface GetTopRatedMoviesResponse {
  topRatedMovies: GraphQLSearchResult;
}

export interface GetUpcomingMoviesResponse {
  upcomingMovies: GraphQLSearchResult;
}

export interface GetNowPlayingMoviesResponse {
  nowPlayingMovies: GraphQLSearchResult;
}

export interface GetGenresResponse {
  genres: GraphQLGenre[];
}

export interface GetMoviesByGenreResponse {
  moviesByGenre: GraphQLSearchResult;
}

export interface GraphQLCast {
  id: string;
  name: string;
  character: string;
  profilePath?: string;
  order: number;
  gender?: number;
  knownForDepartment?: string;
}

export interface GraphQLCrew {
  id: string;
  name: string;
  job: string;
  department: string;
  profilePath?: string;
  gender?: number;
  knownForDepartment?: string;
}

export interface GraphQLCredits {
  id: string;
  cast: GraphQLCast[];
  crew: GraphQLCrew[];
}

export interface GetMovieCreditsResponse {
  movieCredits: GraphQLCredits;
}

export interface GetMovieRecommendationsResponse {
  movieRecommendations: GraphQLSearchResult;
}
