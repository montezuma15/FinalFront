import { useCallback, useEffect, useState } from 'react'
import { mensajeDeError } from '../services/clienteApi.js'

// Encapsula el patron que repiten todas las paginas al consumir el API:
// 1. guardar los datos, 2. saber si esta cargando, 3. guardar el error.
//
//   const { datos, cargando, error, recargar, setDatos } = useDatosApi(listarEspacios)
//
// "dependencias" funciona igual que en useEffect: si cambian, se vuelve a pedir.
export function useDatosApi(cargar, dependencias = []) {
    const [estado, setEstado] = useState({ datos: null, cargando: true, error: '' })
    const [version, setVersion] = useState(0)

    useEffect(function pedirDatos() {
        // Si el componente cambia de dependencias antes de que responda el API,
        // ignoramos la respuesta vieja
        let vigente = true
        setEstado((anterior) => ({ ...anterior, cargando: true, error: '' }))

        cargar()
            .then((datos) => {
                if (vigente) setEstado({ datos, cargando: false, error: '' })
            })
            .catch((error) => {
                if (vigente) setEstado({ datos: null, cargando: false, error: mensajeDeError(error, 'No fue posible cargar la información') })
            })

        return () => { vigente = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...dependencias, version])

    const recargar = useCallback(() => setVersion((v) => v + 1), [])

    // Para actualizar la lista en pantalla sin volver a pedirla (ej: despues de eliminar)
    const setDatos = useCallback((actualizar) => {
        setEstado((anterior) => ({ ...anterior, datos: actualizar(anterior.datos) }))
    }, [])

    return { ...estado, recargar, setDatos }
}
