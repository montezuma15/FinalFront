import axios from 'axios'
import { leerToken } from './almacenToken.js'

// Cliente de axios con la URL base del API
// La URL se puede cambiar con la variable VITE_API_URL en un archivo .env
export const clienteApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080/paseoapi/v1',
    headers: { 'Content-Type': 'application/json' },
})

// 1. Antes de cada peticion: si hay token, lo enviamos en la cabecera Authorization
clienteApi.interceptors.request.use(function agregarToken(configuracion) {
    const token = leerToken()
    if (token) {
        configuracion.headers.Authorization = `Bearer ${token}`
    }
    return configuracion
})

// 2. Despues de cada respuesta: si el backend dice 401 (token vencido o invalido)
//    avisamos al proveedor de auth para que cierre la sesion
let manejadorNoAutorizado = null

export function registrarManejadorNoAutorizado(funcion) {
    manejadorNoAutorizado = funcion
}

clienteApi.interceptors.response.use(
    (respuesta) => respuesta,
    (error) => {
        const enviabaToken = Boolean(error.config?.headers?.Authorization)
        if (error.response?.status === 401 && enviabaToken && manejadorNoAutorizado) {
            manejadorNoAutorizado()
        }
        return Promise.reject(error)
    }
)

// Saca el mensaje que manda Spring (error.response.data.message) o uno por defecto
export function mensajeDeError(error, porDefecto = 'Ocurrió un error inesperado') {
    return error.response?.data?.message || porDefecto
}
