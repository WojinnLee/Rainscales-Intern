function StatusMessage({ error, message }) {
  if (!error && !message) return null;

  return (
    <div
      className={`rounded-md px-4 py-3 text-sm ${
        error ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
      }`}
    >
      {error || message}
    </div>
  );
}

export default StatusMessage;
