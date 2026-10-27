import { useAuth } from '../contexto/ContextoAuth.jsx'

// Muestra su contenido solo si el usuario tiene el permiso.
// Ejemplo: <Autorizado permiso="espacios:gestionar"><button>Eliminar</button></Autorizado>
// OJO: esto solo oculta botones; quien protege los datos es el backend.
export function Autorizado({ permiso, children, alternativa = null }) {
    const { puede } = useAuth()
    return puede(permiso) ? children : alternativa
}
