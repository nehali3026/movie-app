import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";
import type { Movie } from "@/types/movie.js";

interface MovieFormProps {
  movie?: Movie;
  onSubmit: (movie: Omit<Movie, "id">) => Promise<void>;
  onCancel: () => void;
  isEditing?: boolean;
}

const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
const CURRENT_YEAR = new Date().getFullYear();

const MovieForm = ({
  movie,
  onSubmit,
  onCancel,
  isEditing,
}: MovieFormProps) => {
  const [title, setTitle] = useState(movie?.title || "");
  const [year, setYear] = useState(movie?.publishingYear?.toString() || "");
  const [image, setImage] = useState<string | File | null>(
    movie?.poster || null
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    typeof movie?.poster === "string" ? movie.poster : null
  );
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ---------------- IMAGE HANDLER ---------------- */
  const handleFileChange = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrors({ image: "Only image files are allowed" });
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setErrors({ image: "Image size must be less than 2MB" });
      return;
    }

    setErrors((prev) => ({ ...prev, image: "" }));
    setImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /* ---------------- DROP HANDLER ---------------- */
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileChange(file);
  };

  /* ---------------- FORM VALIDATION ---------------- */
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim() || title.trim().length < 2) {
      newErrors.title = "Title must be at least 2 characters";
    }

    const yearNumber = Number(year);
    if (!year) {
      newErrors.year = "Year is required";
    } else if (isNaN(yearNumber) || year.length !== 4) {
      newErrors.year = "Year must be a 4-digit number";
    } else if (yearNumber < 1888 || yearNumber > CURRENT_YEAR + 1) {
      newErrors.year = "Enter a valid year";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || isSubmitting) return;

    try {
      setIsSubmitting(true);

      await onSubmit({
        title: title.trim(),
        publishingYear: year,
        poster: image,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in">
      <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-6 md:mb-8">
        {isEditing ? "Edit movie" : "Create a new movie"}
      </h2>

      <div className="flex flex-col-reverse lg:flex-row gap-6 lg:gap-12">
        {/* ---------- FORM FIELDS ---------- */}
        <div className="flex flex-col gap-4 md:gap-6 flex-1 lg:max-w-sm">
          <div>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
              disabled={isSubmitting}
            />
            {errors.title && (
              <p className="text-sm text-red-500 mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <input
              type="text"
              placeholder="Publishing year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="input-field lg:w-2/3"
              disabled={isSubmitting}
            />
            {errors.year && (
              <p className="text-sm text-red-500 mt-1">{errors.year}</p>
            )}
          </div>

          <div className="flex gap-3 md:gap-4 mt-4 md:mt-8">
            <button
              type="button"
              onClick={onCancel}
              className="btn-outline flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`btn-primary flex-1 flex items-center justify-center gap-2 ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? (
                <>
                  <span className="loader" />
                  {isEditing ? "Updating..." : "Submitting..."}
                </>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </div>

        {/* ---------- UPLOAD POSTER ---------- */}
        <div className="w-full lg:w-auto">
          <div
            className={`upload-zone relative w-full lg:w-72 h-64 md:h-80 lg:h-96 ${
              isDragging ? "border-primary bg-primary/5" : ""
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => !isSubmitting && fileInputRef.current?.click()}
          >
            {previewUrl ? (
              <>
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage();
                  }}
                  className="absolute top-2 right-2 bg-black/60 hover:bg-black text-white rounded-full p-1"
                  disabled={isSubmitting}
                >
                  <X size={16} />
                </button>
              </>
            ) : (
              <>
                <Upload className="w-6 h-6 text-foreground/70" />
                <span className="text-sm text-foreground/70">
                  Drop an image here
                </span>
              </>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              disabled={isSubmitting}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileChange(file);
              }}
            />
          </div>

          {errors.image && (
            <p className="text-sm text-red-500 mt-2">{errors.image}</p>
          )}
        </div>
      </div>
    </form>
  );
};

export default MovieForm;
