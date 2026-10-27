// Guarda el JWT en el navegador para no perder la sesion al recargar.
// OJO: solo guardamos el token. El usuario y su rol SIEMPRE se piden al backend (/auth/yo).
const CLAVE = 'tokenPaseoApp'

export function leerToken() {
    try {
        return localStorage.getItem(CLAVE)
    } catch {
        return null
    }
}

export function guardarToken(token) {
    localStorage.setItem(CLAVE, token)
}

export function borrarToken() {
    localStorage.removeItem(CLAVE)
}
