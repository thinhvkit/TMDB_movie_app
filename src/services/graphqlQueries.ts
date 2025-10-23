import {gql} from '@apollo/client';

export const MOVIE_FRAGMENT = gql`
  fragment MovieFragment on Movie {
    id
    title
    overview
    releaseDate
    posterPath
    backdropPath
    voteAverage
    voteCount
    popularity
    adult
    originalLanguage
    originalTitle
    video
  }
`;

export const MOVIE_DETAILS_FRAGMENT = gql`
  fragment MovieDetailsFragment on Movie {
    ...MovieFragment
    genres {
      id
      name
    }
    runtime
    budget
    revenue
    status
    tagline
    homepage
    imdbId
    productionCompanies {
      id
      name
      logoPath
      originCountry
    }
    productionCountries {
      iso31661
      name
    }
    spokenLanguages {
      iso6391
      name
    }
  }
  ${MOVIE_FRAGMENT}
`;

export const GET_MOVIE = gql`
  query GetMovie($id: ID!) {
    movie(id: $id) {
      ...MovieDetailsFragment
    }
  }
  ${MOVIE_DETAILS_FRAGMENT}
`;

export const SEARCH_MOVIES = gql`
  query SearchMovies($query: String!, $page: Int = 1) {
    searchMovies(query: $query, page: $page) {
      page
      totalResults
      totalPages
      results {
        ...MovieFragment
      }
    }
  }
  ${MOVIE_FRAGMENT}
`;

export const GET_POPULAR_MOVIES = gql`
  query GetPopularMovies($page: Int = 1) {
    popularMovies(page: $page) {
      page
      totalResults
      totalPages
      results {
        ...MovieFragment
      }
    }
  }
  ${MOVIE_FRAGMENT}
`;

export const GET_TOP_RATED_MOVIES = gql`
  query GetTopRatedMovies($page: Int = 1) {
    topRatedMovies(page: $page) {
      page
      totalResults
      totalPages
      results {
        ...MovieFragment
      }
    }
  }
  ${MOVIE_FRAGMENT}
`;

export const GET_UPCOMING_MOVIES = gql`
  query GetUpcomingMovies($page: Int = 1) {
    upcomingMovies(page: $page) {
      page
      totalResults
      totalPages
      results {
        ...MovieFragment
      }
    }
  }
  ${MOVIE_FRAGMENT}
`;

export const GET_NOW_PLAYING_MOVIES = gql`
  query GetNowPlayingMovies($page: Int = 1) {
    nowPlayingMovies(page: $page) {
      page
      totalResults
      totalPages
      results {
        ...MovieFragment
      }
    }
  }
  ${MOVIE_FRAGMENT}
`;

export const GET_GENRES = gql`
  query GetGenres {
    genres {
      id
      name
    }
  }
`;

export const GET_MOVIES_BY_GENRE = gql`
  query GetMoviesByGenre($genreId: ID!, $page: Int = 1) {
    moviesByGenre(genreId: $genreId, page: $page) {
      page
      totalResults
      totalPages
      results {
        ...MovieFragment
      }
    }
  }
  ${MOVIE_FRAGMENT}
`;

export const GET_MOVIE_CREDITS = gql`
  query GetMovieCredits($id: ID!) {
    movieCredits(id: $id) {
      id
      cast {
        id
        name
        character
        profilePath
        order
        gender
        knownForDepartment
      }
      crew {
        id
        name
        job
        department
        profilePath
        gender
        knownForDepartment
      }
    }
  }
`;

export const GET_MOVIE_RECOMMENDATIONS = gql`
  query GetMovieRecommendations($id: ID!, $page: Int = 1) {
    movieRecommendations(id: $id, page: $page) {
      page
      totalResults
      totalPages
      results {
        ...MovieFragment
      }
    }
  }
  ${MOVIE_FRAGMENT}
`;
