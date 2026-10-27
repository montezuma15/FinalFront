import { createContext, useCallback, useContext, useEffect, useState } from 'react'

import { login, obtenerUsuarioActual } from '../services/servicioAuth.js'
import { guardarUsuario } from '../services/servicioUsuarios.js'
import { borrarToken, guardarToken, leerToken } from '../services/almacenToken.js'
import { registrarManejadorNoAutorizado } from '../services/clienteApi.js'
import { ROLES, rolTienePermiso } from '../auth/permisos.js'

// 1. Creamos el contexto: una "caja" que cualquier componente puede abrir
const ContextoAuth = createContext(null)

// 2. El proveedor envuelve la app y sabe quien esta logueado y que puede hacer
export function ProveedorAuth({ children }) {

    const [usuario, setUsuario] = useState(null)
    // Si hay un token guardado, arrancamos "cargando" hasta preguntarle al backend quien es
    const [cargando, setCargando] = useState(() => leerToken() !== null)

    const cerrarSesion = useCallback(function cerrarSesion() {
        borrarToken()
        setUsuario(null)
    }, [])

    // Si el backend responde 401 (token vencido/alterado), cerramos la sesion
    useEffect(function escucharNoAutorizado() {
        registrarManejadorNoAutorizado(cerrarSesion)
    }, [cerrarSesion])

    // Al cargar la app: el rol SIEMPRE viene del backend, nunca de lo guardado en el navegador
    useEffect(function recuperarSesion() {
        if (!leerToken()) {
            return
        }
        obtenerUsuarioActual()
            .then(setUsuario)
            .catch(cerrarSesion)
            .finally(() => setCargando(false))
    }, [cerrarSesion])

    async function iniciarSesion(correo, contraseña) {
        const respuesta = await login(correo, contraseña)
        guardarToken(respuesta.token)
        setUsuario(respuesta.usuario)
        return respuesta.usuario
    }

    // Registra al usuario y lo deja logueado
    async function registrarse(datos) {
        await guardarUsuario(datos)
        return iniciarSesion(datos.correo, datos.contraseña)
    }

    function puede(permiso) {
        return usuario !== null && rolTienePermiso(usuario.rol, permiso)
    }

    function tieneRol(...roles) {
        return usuario !== null && roles.includes(usuario.rol)
    }

    // Lo que compartimos con toda la aplicacion
    const valor = {
        usuario,
        cargando,
        estaLogueado: usuario !== null,
        esAdministrador: usuario?.rol === ROLES.ADMINISTRADOR,
        iniciarSesion,
        registrarse,
        cerrarSesion,
        puede,
        tieneRol,
    }

    return (
        <ContextoAuth.Provider value={valor}>
            {children}
        </ContextoAuth.Provider>
    )
}

// 3. Hook para usar la autenticacion desde cualquier componente
// eslint-disable-next-line react/only-export-components
export function useAuth() {
    return useContext(ContextoAuth)
}
