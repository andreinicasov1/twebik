interface PaginationProps {
  paginaCurenta: number;
  totalPagini: number;
  onPaginaChange: (pagina: number) => void;
}

export function Pagination({ paginaCurenta, totalPagini, onPaginaChange }: PaginationProps) {
  if (totalPagini <= 1) return null;

  return (
    <div className='pagination'>
      <button type='button' onClick={() => onPaginaChange(paginaCurenta - 1)} disabled={paginaCurenta <= 1}>
        Înapoi
      </button>
      <span>
        Pagina {paginaCurenta} din {totalPagini}
      </span>
      <button
        type='button'
        onClick={() => onPaginaChange(paginaCurenta + 1)}
        disabled={paginaCurenta >= totalPagini}
      >
        Înainte
      </button>
    </div>
  );
}
