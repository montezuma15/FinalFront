import { clienteApi } from './clienteApi.js'

const RUTA = '/auth'

// Devuelve { token, usuario } si el correo y la contraseña son correctos
export async function login(correo, contraseña) {
    const respuesta = await clienteApi.post(RUTA + '/login', { correo, contraseña })
    return respuesta.data
}

// Devuelve el usuario dueño del token (con su rol actual en la BD)
export async function obtenerUsuarioActual() {
    const respuesta = await clienteApi.get(RUTA + '/yo')
    return respuesta.data
}
