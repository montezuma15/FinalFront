import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexto/ContextoAuth.jsx'

// Deja pasar solo si el usuario tiene el permiso (o uno de los roles) indicado.
// Ejemplos:
//   <RutaPorRol permiso="usuarios:gestionar" />
//   <RutaPorRol rolesPermitidos={['ADMINISTRADOR']} />
// Va dentro de <RutaPrivada />, asi que aqui ya sabemos que hay sesion.
export function RutaPorRol({ permiso, rolesPermitidos = [] }) {
    const { puede, tieneRol } = useAuth()

    const autorizado = permiso ? puede(permiso) : tieneRol(...rolesPermitidos)

    if (!autorizado) {
        return <Navigate to="/sin-permiso" replace />
    }

    return <Outlet />
}
