# GraphQL Client Setup for TMDB Movie App

This document explains how to use the GraphQL client that has been integrated into your TMDB Movie App.

## Overview

The GraphQL client has been set up using Apollo Client and provides an alternative way to fetch movie data from a GraphQL server instead of directly from the TMDB REST API.

## Files Added

### Core GraphQL Files
- `src/services/graphqlClient.ts` - Apollo Client configuration
- `src/services/graphqlQueries.ts` - GraphQL query definitions
- `src/services/graphqlService.ts` - Service layer for GraphQL operations
- `src/types/graphql.ts` - TypeScript interfaces for GraphQL responses
- `src/hooks/useGraphQLMovies.ts` - React hooks for GraphQL operations
- `src/components/GraphQLMovieList.tsx` - Example component using GraphQL

## Configuration

### 1. GraphQL Server URL
Update the GraphQL server URL in `src/services/graphqlClient.ts`:

```typescript
const GRAPHQL_URI = 'http://localhost:4000/graphql'; // Update this URL
```

### 2. Apollo Provider
The Apollo Provider has been added to `src/App.tsx` to provide GraphQL context throughout the app.

## Usage

### Using React Hooks (Recommended)

```typescript
import { useMovies, useSearchMovies, useMovie } from '../hooks/useGraphQLMovies';

// Get movies by category
const { data, loading, error } = useMovies('popular', 1);

// Search movies
const { data, loading, error } = useSearchMovies('Avengers', 1);

// Get single movie details
const { data, loading, error } = useMovie(123);
```

### Using GraphQL Service Directly

```typescript
import { graphqlService } from '../services/graphqlService';

// Get popular movies
const movies = await graphqlService.getPopularMovies(1);

// Search movies
const searchResults = await graphqlService.searchMovies('Avengers', 1);

// Get movie details
const movie = await graphqlService.getMovie(123);
```

## Available Queries

The GraphQL client supports the following operations:

### Movies
- `getPopularMovies(page?)` - Get popular movies
- `getTopRatedMovies(page?)` - Get top-rated movies
- `getUpcomingMovies(page?)` - Get upcoming movies
- `getNowPlayingMovies(page?)` - Get now playing movies
- `searchMovies(query, page?)` - Search movies
- `getMovie(id)` - Get movie details
- `getMoviesByGenre(genreId, page?)` - Get movies by genre

### Genres
- `getGenres()` - Get all genres

## Data Transformation

The GraphQL service automatically transforms GraphQL responses to match your existing TMDB API types, so you can use the GraphQL client as a drop-in replacement for the REST API service.

## Error Handling

All hooks and service methods include proper error handling. Errors are logged to the console and can be accessed through the `error` property in hooks.

## Example Component

See `src/components/GraphQLMovieList.tsx` for an example of how to use the GraphQL hooks in a React component.

## Switching Between REST and GraphQL

To switch from using the REST API to GraphQL:

1. Replace imports from `../services/api` with `../hooks/useGraphQLMovies`
2. Use the appropriate hook instead of calling API methods directly
3. The data structure remains the same, so no other changes are needed

Example:
```typescript
// Before (REST API)
import { apiService } from '../services/api';
const movies = await apiService.getPopularMovies();

// After (GraphQL)
import { useMovies } from '../hooks/useGraphQLMovies';
const { data: movies, loading, error } = useMovies('popular');
```

## Dependencies Added

- `@apollo/client` - Apollo Client for GraphQL
- `graphql` - GraphQL JavaScript implementation

## Next Steps

1. Start your GraphQL server (from the TMDB_movie_graphql project)
2. Update the GRAPHQL_URI in `graphqlClient.ts` to point to your server
3. Test the GraphQL client by using the provided hooks in your components
4. Gradually migrate existing components to use GraphQL instead of REST API calls