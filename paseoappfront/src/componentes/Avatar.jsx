// Circulo con las iniciales: "Ana María López" -> "AM"
export function Avatar({ nombres = '', tamaño = 'md' }) {
    const iniciales = nombres
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((palabra) => palabra[0].toUpperCase())
        .join('')

    return <span className={`avatar avatar-${tamaño}`} aria-hidden="true">{iniciales || '?'}</span>
}
