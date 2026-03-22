interface Props {
  mensaje?: string;
  onReintentar?: () => void;
}

export function ErrorMsg({ mensaje = 'Ocurrió un error.', onReintentar }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
      <span className="text-5xl">⚠️</span>
      <p className="text-secondary">{mensaje}</p>
      {onReintentar && (
        <button
          onClick={onReintentar}
          className="px-4 py-2 bg-primary text-dark font-semibold rounded-lg hover:bg-primary-hover transition-colors text-sm"
        >
          Reintentar
        </button>
      )}
    </div>
  );
}
