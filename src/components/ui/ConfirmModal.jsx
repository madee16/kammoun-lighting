import { useEffect, useRef } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  danger = true,
  onConfirm,
  onCancel,
}) {
  const confirmRef = useRef(null);
  const lastFocusedRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    lastFocusedRef.current = document.activeElement;
    confirmRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onCancel();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      lastFocusedRef.current?.focus?.();
    };
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="confirm-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
    >
      <div
        className="confirm-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
      >
        <header className="confirm-card-head">
          <span className="confirm-card-icon" aria-hidden="true">
            <AlertTriangle size={22} />
          </span>
          <div>
            <h2 id="confirm-modal-title">{title}</h2>
            {message && <p>{message}</p>}
          </div>
          <button
            className="icon-button"
            type="button"
            onClick={onCancel}
            aria-label={cancelLabel}
            title={cancelLabel}
          >
            <X size={18} />
          </button>
        </header>
        <div className="confirm-actions">
          <button className="secondary-button" type="button" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            className={danger ? 'primary-button danger' : 'primary-button'}
            type="button"
            ref={confirmRef}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}