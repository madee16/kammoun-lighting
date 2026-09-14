export function FormStatus({ status }) {
  if (!status?.text) return null;

  return (
    <p className={`form-status ${status.type}`} role="status">
      {status.text}
    </p>
  );
}