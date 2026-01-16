interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="text-sm font-medium text-foreground/70 hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors px-2 py-1"
      >
        Prev
      </button>
      
      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 rounded-md text-sm font-medium transition-all duration-200 ${
              currentPage === page
                ? "bg-primary text-primary-foreground"
                : "bg-card text-foreground/70 hover:bg-secondary"
            }`}
          >
            {page}
          </button>
        ))}
      </div>
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="text-sm font-medium text-foreground/70 hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors px-2 py-1"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
