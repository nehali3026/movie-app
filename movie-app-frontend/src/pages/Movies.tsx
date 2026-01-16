import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, LogOut } from "lucide-react";

import MovieCard from "@/components/MovieCard";
import MovieForm from "@/components/MovieForm";
import Pagination from "@/components/Pagination";
import WaveDecoration from "@/components/WaveDecoration";

import { Movie } from "@/types/movie";
import { useToast } from "@/hooks/use-toast";
import { createMovieApi, getMoviesApi, updateMovieApi } from "@/lib/movies.api";

const ITEMS_PER_PAGE = 8;

const Movies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  /* =========================
     FETCH MOVIES
  ========================== */
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");

    if (!isAuthenticated) {
      navigate("/");
      return;
    }

    const fetchMovies = async () => {
      try {
        setLoading(true);

        const { data } = await getMoviesApi();
        console.log("🚀 Movies API:", data);

        if (!Array.isArray(data?.data)) {
          throw new Error("Invalid movies response");
        }

        setMovies(data.data);
        localStorage.setItem("movies", JSON.stringify(data.data));
      } catch (error: any) {
        toast({
          title: "Failed to load movies",
          description:
            error?.response?.data?.message ||
            "Unable to fetch movies. Please try again.",
          variant: "destructive",
        });

        setMovies([]);
        localStorage.setItem("movies", JSON.stringify([]));
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [navigate, toast]);

  /* =========================
     HELPERS
  ========================== */
  const saveMovies = (newMovies: Movie[]) => {
    setMovies(newMovies);
    localStorage.setItem("movies", JSON.stringify(newMovies));
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    navigate("/");
  };

  /* =========================
     ADD MOVIE (POST)
  ========================== */
  const handleAddMovie = async (movieData: Omit<Movie, "id">) => {
    try {
      const formData = new FormData();

      Object.entries(movieData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as string | Blob);
        }
      });

      const { data: newMovie } = await createMovieApi(formData);

      saveMovies([newMovie, ...movies]);
      setShowForm(false);

      toast({
        title: "Movie added",
        description: `"${newMovie.title}" has been added.`,
      });
    } catch (error: any) {
      toast({
        title: "Failed to add movie",
        description: error?.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  /* =========================
     EDIT MOVIE (LOCAL)
  ========================== */
  const handleEditMovie = async (movieData: Omit<Movie, "id">) => {
    if (!editingMovie) return;

    try {
      const formData = new FormData();

      Object.entries(movieData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as string | Blob);
        }
      });

      // CALL UPDATE API
      const { data: updatedMovie } = await updateMovieApi(
        String(editingMovie?.id) || "",
        formData
      );

      // UPDATE LOCAL STATE
      const updatedMovies = movies.map((movie) =>
        movie.id === editingMovie.id ? updatedMovie : movie
      );

      saveMovies(updatedMovies);
      setEditingMovie(null);

      toast({
        title: "Movie updated",
        description: `"${updatedMovie.title}" has been updated.`,
      });
    } catch (error: any) {
      toast({
        title: "Failed to update movie",
        description: error?.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  /* =========================
     PAGINATION
  ========================== */
  const totalPages = Math.ceil(movies.length / ITEMS_PER_PAGE);
  const paginatedMovies = movies.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  /* =========================
     LOADER
  ========================== */
  if (loading) {
    return (
      <div className="min-h-screen app-gradient flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-foreground/70">Loading movies...</p>
        </div>
      </div>
    );
  }

  /* =========================
     EMPTY STATE
  ========================== */
  if (movies.length === 0 && !showForm) {
    return (
      <div className="min-h-screen app-gradient flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="text-center z-10">
          <h2 className="text-xl font-semibold mb-6">
            Your movie list is empty
          </h2>
          <button onClick={() => setShowForm(true)} className="btn-primary">
            Add a new movie
          </button>
        </div>
        <WaveDecoration />
      </div>
    );
  }

  /* =========================
     FORM VIEW
  ========================== */
  if (showForm || editingMovie) {
    return (
      <div className="min-h-screen app-gradient p-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto z-10 relative">
          <MovieForm
            movie={editingMovie || undefined}
            isEditing={!!editingMovie}
            onSubmit={editingMovie ? handleEditMovie : handleAddMovie}
            onCancel={() => {
              setShowForm(false);
              setEditingMovie(null);
            }}
          />
        </div>
        <WaveDecoration />
      </div>
    );
  }

  /* =========================
     LIST VIEW
  ========================== */
  return (
    <div className="min-h-screen app-gradient p-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto pb-24 relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold">My Movies</h1>
            <button
              onClick={() => setShowForm(true)}
              className="p-2 rounded-full hover:bg-secondary"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-foreground/80 hover:text-foreground"
          >
            Logout <LogOut className="w-5 h-5" />
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {paginatedMovies.map((movie, index) => (
            <div key={movie.id} style={{ animationDelay: `${index * 50}ms` }}>
              <MovieCard movie={movie} onClick={() => setEditingMovie(movie)} />
            </div>
          ))}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      <WaveDecoration />
    </div>
  );
};

export default Movies;
