import type { Movie, MovieResponse } from "../types/movie.js";
import api from "./api.js";

export const getMoviesApi = () => {
  return api.get<MovieResponse>("/movies");
};

export const createMovieApi = (formData: FormData) => {
  return api.post<Movie>("/movies", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateMovieApi = (id: string, formData: FormData) => {
  return api.patch(`/movies/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
