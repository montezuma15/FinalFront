import { clienteApi } from './clienteApi.js'

const RUTA = '/reservas'


// El usuario NO se envia: el backend lo saca del token
export async function guardarReserva({ espacioId, fecha, franja }) {
    const respuesta = await clienteApi.post(RUTA, { espacioId, fecha, franja })
    return respuesta.data
}


export async function listarMisReservas() {
    const respuesta = await clienteApi.get(RUTA + '/mias')
    return respuesta.data
}


// Solo ADMINISTRADOR. Filtros opcionales: { espacioId, fecha }
export async function listarTodasLasReservas(filtros = {}) {
    const params = {}
    if (filtros.espacioId) params.espacioId = filtros.espacioId
    if (filtros.fecha) params.fecha = filtros.fecha
    const respuesta = await clienteApi.get(RUTA, { params })
    return respuesta.data
}


// Devuelve las franjas tomadas, ej: ['HORA_8', 'HORA_9']
export async function listarFranjasOcupadas(espacioId, fecha) {
    const respuesta = await clienteApi.get(RUTA + '/ocupadas', { params: { espacioId, fecha } })
    return respuesta.data
}


export async function cancelarReserva(id) {
    await clienteApi.delete(RUTA + '/' + id)
}
