interface ConfirmModalProps {
  deschis: boolean;
  titlu: string;
  descriere: string;
  textConfirmare?: string;
  textAnulare?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  deschis,
  titlu,
  descriere,
  textConfirmare = 'Confirmă',
  textAnulare = 'Anulează',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!deschis) return null;

  return (
    <div className='modal-backdrop' onClick={onCancel} role='presentation'>
      <div className='modal-content' onClick={(event) => event.stopPropagation()} role='dialog' aria-modal='true'>
        <h3>{titlu}</h3>
        <p>{descriere}</p>
        <div className='modal-actions'>
          <button type='button' className='btn btn-ghost' onClick={onCancel}>
            {textAnulare}
          </button>
          <button type='button' className='btn btn-danger' onClick={onConfirm}>
            {textConfirmare}
          </button>
        </div>
      </div>
    </div>
  );
}
