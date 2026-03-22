const CLAVE = 'jamgym_favoritos';

export function obtenerFavoritos(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(CLAVE) ?? '[]');
  } catch {
    return [];
  }
}

export function esFavorito(id: string): boolean {
  return obtenerFavoritos().includes(id);
}

export function toggleFavorito(id: string): boolean {
  const favs = obtenerFavoritos();
  const idx = favs.indexOf(id);
  if (idx >= 0) {
    favs.splice(idx, 1);
  } else {
    favs.push(id);
  }
  localStorage.setItem(CLAVE, JSON.stringify(favs));
  return idx < 0;
}
