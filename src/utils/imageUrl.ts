/**
 * Utility functions for handling image URLs
 */

const BACKEND_BASE_URL = 'http://localhost:8080/bachhoa';

/**
 * Convert relative image path to full URL
 * @param imagePath - Relative path like "images/bachibo.jpg" or full URL
 * @returns Full image URL
 */
export const getImageUrl = (imagePath?: string | null): string => {
  if (!imagePath) {
    return '/images/placeholder.jpg'; // Frontend placeholder
  }
  
  // If already full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If starts with /images/, use backend URL
  if (imagePath.startsWith('images/')) {
    return `${BACKEND_BASE_URL}/${imagePath}`;
  }
  
  // If just filename, assume it's in images folder
  if (!imagePath.includes('/')) {
    return `${BACKEND_BASE_URL}/images/${imagePath}`;
  }
  
  // Default: prepend backend base URL
  return `${BACKEND_BASE_URL}/${imagePath}`;
};

export default getImageUrl;