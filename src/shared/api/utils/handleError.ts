import type { ApiError } from '../types';
import axios from 'axios';

export const handleApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    return {
      code: error.response?.status || 500,
      message: error.response?.data?.message || 'Server error',
    };
  }
  return {
    code: 500,
    message: 'Unknown error',
  };
};