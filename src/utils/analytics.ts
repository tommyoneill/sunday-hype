import { track } from '@vercel/analytics';

// Reading-related events
export const trackReadingView = (readingId: string, readingType: string) => {
  track('Reading View', {
    readingId,
    readingType,
  });
};

export const trackReadingShare = (readingId: string, platform: string) => {
  track('Reading Share', {
    readingId,
    platform,
  });
};

// Navigation events
export const trackNavigation = (from: string, to: string) => {
  track('Navigation', {
    from,
    to,
  });
};

// Search and filter events
export const trackSearch = (query: string, resultsCount: number) => {
  track('Search', {
    query,
    resultsCount,
  });
};

export const trackFilter = (filterType: string, value: string) => {
  track('Filter', {
    filterType,
    value,
  });
};

// User engagement events
export const trackEngagement = (action: string, readingId: string) => {
  track('Engagement', {
    action,
    readingId,
  });
};

// Error tracking
export const trackError = (errorType: string, message: string) => {
  track('Error', {
    errorType,
    message,
  });
}; 