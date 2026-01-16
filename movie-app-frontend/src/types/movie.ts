export interface Movie {
  id?: string | number;
  title: string;
  publishingYear: string;
  poster: File | null | string;
}

export interface MovieResponse {
  data: Movie[];
  total: number;
  page: number;
  limit: number;
}

export interface User {
  email: string;
  isAuthenticated: boolean;
}
