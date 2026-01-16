import { Movie } from "@/types/movie";

interface MovieCardProps {
  movie: Movie;
  onClick?: () => void;
}

const MovieCard = ({ movie, onClick }: MovieCardProps) => {
  return (
    <div
      className="movie-card group animate-fade-in cursor-pointer"
      onClick={onClick}
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl">
        <img
          src={movie.image}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
        
        {/* Title and year overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
          <h3 className="font-semibold text-sm md:text-base text-white truncate">
            {movie.title}
          </h3>
          <p className="text-xs md:text-sm text-white/80 mt-0.5">
            {movie.year}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
