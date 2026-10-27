import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../contexto/ContextoAuth.jsx'
import { EstadoCarga } from '../componentes/Estados.jsx'

// Deja pasar solo a usuarios logueados.
// <Outlet /> pinta la ruta hija que el usuario pidio.
export function RutaPrivada() {
    const { estaLogueado, cargando } = useAuth()
    const ubicacion = useLocation()

    // Mientras el backend confirma el token no decidimos nada (evita "parpadear" al login)
    if (cargando) {
        return <EstadoCarga texto="Verificando tu sesión..." pantallaCompleta />
    }

    if (!estaLogueado) {
        // Guardamos a donde queria ir para devolverlo alli despues del login
        return <Navigate to="/login" replace state={{ desde: ubicacion }} />
    }

    return <Outlet />
}
