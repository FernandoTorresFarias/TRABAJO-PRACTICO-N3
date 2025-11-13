import React from "react";

export function ConfirmModal({ open, message, onConfirm, onCancel }) {
  if (!open) return null; // no renderiza si no está abierto

  return (
    <dialog open>
      <article>
        <h3>Confirmar acción</h3>
        <p>{message}</p>

        <footer>
          <button className="secondary" onClick={onCancel}>
            Cancelar
          </button>
          <button onClick={onConfirm}>Confirmar</button>
        </footer>
      </article>
    </dialog>
  );
}
