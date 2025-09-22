# Movie Database React Native App

A React Native movie database application built with TypeScript that allows users to browse movies, view details, and manage a personal watchlist.

iOS demo:
https://drive.google.com/file/d/1bKV09YI-7GaIro5uZGJ2fcP_41euKYwH/view?usp=sharing


## Features

### Core Features
- **Browse Movies**: View lists of "Now Playing", "Upcoming", and "Popular" movies
- **Movie Details**: Detailed view with cast, crew, ratings, and recommendations
- **Watchlist Management**: Add/remove movies from personal watchlist
- **Search Functionality**: Search for movies by title
- **Sorting & Filtering**: Sort movies by alphabetical order, rating, or release date

### Technical Features
- TypeScript for type safety
- React Navigation for navigation
- Context API for state management
- AsyncStorage for data persistence
- TMDB API integration
- Responsive design following the provided Figma mockups

## Prerequisites

- Node.js (v18 or higher)
- React Native development environment set up
- iOS Simulator (for iOS development)
- Android Studio and emulator (for Android development)

## API Setup

1. Create a TMDB account at https://www.themoviedb.org/signup
2. Go to Settings � API in your account
3. Generate an API Read Access Token
4. Update the API token in `src/services/api.ts`:
   ```typescript
   const API_TOKEN = 'YOUR_API_READ_ACCESS_TOKEN';
   ```

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd movie_database_rn
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Install iOS dependencies (iOS only):
   ```bash
   cd ios && pod install && cd ..
   ```

## Running the Application

### iOS
```bash
npm run ios
```

### Android
```bash
npm run android
```

### Development Server
```bash
npm start
```

## Project Structure


## Key Components

### HomeScreen
- Category dropdown (Now Playing, Upcoming, Popular)
- Sort dropdown (Alphabetical, Rating, Release Date)
- Search functionality
- Movie list with pull-to-refresh

### MovieDetailScreen
- Movie poster and backdrop
- Detailed movie information
- Cast and crew information
- Add/Remove from watchlist
- Movie recommendations

### WatchlistScreen
- User profile section
- Saved movies list
- Filtering and sorting options
- Remove movies from watchlist

## State Management

The app uses React Context API for state management with the following features:
- Selected movie category persistence
- Sort preference persistence
- Search query management
- Watchlist management with AsyncStorage persistence

## Data Persistence

- **Watchlist**: Stored in AsyncStorage and persists across app sessions
- **User Preferences**: Category and sort preferences are saved locally
- **Search History**: Search queries are maintained during app session

## API Integration

The app integrates with The Movie Database (TMDB) API for:
- Now Playing movies
- Upcoming movies
- Popular movies
- Movie search
- Movie details
- Movie credits
- Movie recommendations

## Error Handling

- Network error handling with retry functionality
- Loading states for all async operations
- Empty state handling for lists
- API error message display

## UI/UX Features

- Responsive design matching Figma specifications
- Smooth navigation transitions
- Pull-to-refresh functionality
- Loading indicators
- Empty state illustrations
- Consistent color scheme and typography

## Scripts

- `npm start`: Start the Metro bundler
- `npm run ios`: Run on iOS simulator
- `npm run android`: Run on Android emulator
- `npm run lint`: Run ESLint
- `npm run typecheck`: Run TypeScript type checking

## Dependencies

### Production
- React Native 0.74.1
- React Navigation 6.x
- AsyncStorage for data persistence
- Vector Icons for UI icons

### Development
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting

## Assumptions Made

1. **User Authentication**: Not implemented as it wasn't specified in requirements
2. **Offline Support**: Basic caching through normal HTTP caching, no advanced offline features
3. **Image Handling**: Using TMDB's image CDN with fallback placeholders
4. **Rating System**: Using TMDB's 10-point rating system converted to percentage
5. **User Profile**: Static user profile in watchlist (John Lee, August 2023)

## Future Enhancements

- User authentication and personalized profiles
- Offline support with local database
- Push notifications for new movie releases
- Social features (sharing, reviews)
- Advanced filtering options
- Movie trailers integration

## Troubleshooting

### Common Issues

1. **Metro bundler issues**:
   ```bash
   npx react-native start --reset-cache
   ```

2. **iOS build issues**:
   ```bash
   cd ios && pod install && cd ..
   ```

3. **Android build issues**: Ensure Android SDK and build tools are properly installed

4. **API not working**: Verify your TMDB API token is correctly set in `src/services/api.ts`

## License

This project is created for assessment purposes.
