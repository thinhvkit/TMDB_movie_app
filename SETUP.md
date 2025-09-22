# Movie App Setup Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure TMDB API**
   - Create account at https://www.themoviedb.org/signup
   - Go to Settings → API
   - Generate API Read Access Token
   - Update `src/services/api.ts` line 6:
     ```typescript
     const API_TOKEN = 'YOUR_ACTUAL_TOKEN_HERE';
     ```

3. **Run the App**
   ```bash
   # iOS
   npm run ios

   # Android
   npm run android
   ```

## Important Notes

- **API Token**: Replace `YOUR_API_READ_ACCESS_TOKEN` in `src/services/api.ts` with your actual token
- **Platform Setup**: Ensure you have React Native development environment configured
- **Vector Icons**: May require additional setup for icons to display properly

## Features Included

✅ Browse movies by category (Now Playing, Upcoming, Popular)
✅ Search movies by title
✅ Sort movies (Alphabetical, Rating, Release Date)
✅ View detailed movie information
✅ Cast and crew information
✅ Movie recommendations
✅ Add/Remove movies from watchlist
✅ Persistent watchlist storage
✅ Persistent user preferences
✅ Error handling and loading states
✅ Pull-to-refresh functionality
✅ TypeScript support

## Architecture

- **TypeScript**: Full type safety
- **React Navigation**: Tab + Stack navigation
- **Context API**: State management
- **AsyncStorage**: Data persistence
- **TMDB API**: Movie data source

## Troubleshooting

**Icons not showing**: Run `react-native link react-native-vector-icons`
**Build errors**: Clear cache with `npx react-native start --reset-cache`
**API errors**: Verify your TMDB token is correctly set
