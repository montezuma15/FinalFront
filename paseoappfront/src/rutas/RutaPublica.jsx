import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../contexto/ContextoAuth.jsx'
import { EstadoCarga } from '../componentes/Estados.jsx'

// Login y registro: si ya hay sesion no tiene sentido verlos.
// Tambien hace la redireccion despues de iniciar sesion: vuelve a la pagina
// que el usuario queria ver (RutaPrivada la guarda en state.desde) o a /inicio.
export function RutaPublica() {
    const { estaLogueado, cargando } = useAuth()
    const ubicacion = useLocation()

    if (cargando) {
        return <EstadoCarga texto="Cargando..." pantallaCompleta />
    }

    if (estaLogueado) {
        const destino = ubicacion.state?.desde?.pathname ?? '/inicio'
        return <Navigate to={destino} replace />
    }

    return <Outlet />
}
