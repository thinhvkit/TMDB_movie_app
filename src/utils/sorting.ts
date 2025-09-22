import {Movie, SortBy, SortOrder} from '../types';

export function sortMovies(
  movies: Movie[],
  sortBy: SortBy,
  order: SortOrder = 'asc',
): Movie[] {
  const sortedMovies = [...movies];

  sortedMovies.sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'alphabetical':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'rating':
        comparison = a.vote_average - b.vote_average;
        break;
      case 'release_date':
        comparison =
          new Date(a.release_date).getTime() -
          new Date(b.release_date).getTime();
        break;
      default:
        return 0;
    }

    return order === 'desc' ? -comparison : comparison;
  });

  return sortedMovies;
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    return dateString;
  }
}

export function formatRuntime(minutes: number): string {
  if (!minutes || minutes <= 0) {
    return 'N/A';
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes}m`;
  }

  return `${hours}h ${remainingMinutes}m`;
}

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

export function getCertification(adult: boolean): string {
  return adult ? 'R' : 'PG-13';
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength).trim() + '...';
}
