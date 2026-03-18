function Toast({ toast }) {
  if (!toast) {
    return null;
  }

  return (
    <div className={`toast toast--${toast.tone}`} role="status" aria-live="polite">
      {toast.message}
    </div>
  );
}

export default Toast;
