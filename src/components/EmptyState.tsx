interface EmptyStateProps {
  titlu: string;
  descriere: string;
}

export function EmptyState({ titlu, descriere }: EmptyStateProps) {
  return (
    <div className='empty-state'>
      <h3>{titlu}</h3>
      <p>{descriere}</p>
    </div>
  );
}
