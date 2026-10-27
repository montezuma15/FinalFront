import { useState } from 'react'

import { useAuth } from '../contexto/ContextoAuth.jsx'
import { useDatosApi } from '../utilidades/useDatosApi.js'
import { eliminarUsuario, listarUsuarios, modificarUsuario } from '../services/servicioUsuarios.js'
import { mensajeDeError } from '../services/clienteApi.js'
import { ROLES } from '../auth/permisos.js'

import { Avatar } from '../componentes/Avatar.jsx'
import { EncabezadoPagina } from '../componentes/EncabezadoPagina.jsx'
import { AlertaError, EstadoCarga, EstadoVacio } from '../componentes/Estados.jsx'
import { InsigniaRol } from '../componentes/InsigniaRol.jsx'
import { ModalConfirmacion } from '../componentes/ModalConfirmacion.jsx'


// Solo ADMINISTRADOR: ver, cambiar el rol y eliminar usuarios
export function ListaUsuarios(){

    const { usuario: yo } = useAuth()

    //1. Datos, estado de carga y error del API (ver useDatosApi)
    const { datos: usuarios, cargando, error, setDatos } = useDatosApi(listarUsuarios)

    //2. Errores de las acciones (cambiar rol / eliminar)
    const [errorAccion, setErrorAccion] = useState('')
    const [porEliminar, setPorEliminar] = useState(null)
    const [eliminando, setEliminando] = useState(false)

    function reemplazarEnLista(usuarioActualizado) {
        setDatos((lista) => lista.map((usuario) => usuario.id === usuarioActualizado.id ? usuarioActualizado : usuario))
    }

    async function cambiarRol(usuario, rol) {
        setErrorAccion('')
        try {
            const actualizado = await modificarUsuario(usuario.id, { nombres: usuario.nombres, rol })
            reemplazarEnLista(actualizado)
        } catch (error) {
            setErrorAccion(mensajeDeError(error, 'No fue posible cambiar el rol'))
        }
    }

    async function confirmarEliminacion() {
        setEliminando(true)
        setErrorAccion('')
        try {
            await eliminarUsuario(porEliminar.id)
            setDatos((lista) => lista.filter((usuario) => usuario.id !== porEliminar.id))
        } catch (error) {
            setErrorAccion(mensajeDeError(error, 'No fue posible eliminar el usuario'))
        } finally {
            setEliminando(false)
            setPorEliminar(null)
        }
    }

    //3. Funcion para pintar cada usuario
    function pintarUsuario(usuario){
        const soyYo = usuario.id === yo.id
        return(
            <tr key={usuario.id}>
                <td>
                    <span className="d-inline-flex align-items-center gap-2">
                        <Avatar nombres={usuario.nombres} />
                        <span>
                            <span className="fw-semibold d-block">{usuario.nombres} {soyYo && <small className="text-muted">(tú)</small>}</span>
                            <small className="text-muted">{usuario.correo}</small>
                        </span>
                    </span>
                </td>
                <td><InsigniaRol rol={usuario.rol} /></td>
                <td style={{ minWidth: '180px' }}>
                    {/* No dejamos que el admin se quite su propio rol por accidente */}
                    <select
                        className="form-select form-select-sm"
                        value={usuario.rol}
                        disabled={soyYo}
                        onChange={(evento) => cambiarRol(usuario, evento.target.value)}
                        aria-label={`Rol de ${usuario.nombres}`}
                    >
                        <option value={ROLES.USUARIO}>Residente</option>
                        <option value={ROLES.ADMINISTRADOR}>Administrador</option>
                    </select>
                </td>
                <td className="text-end">
                    <button
                        type="button"
                        className="btn btn-icono btn-icono-peligro"
                        disabled={soyYo}
                        onClick={() => setPorEliminar(usuario)}
                        title={soyYo ? 'No puedes eliminar tu propia cuenta' : 'Eliminar'}
                        aria-label={`Eliminar ${usuario.nombres}`}
                    >
                        <i className="bi bi-trash3"></i>
                    </button>
                </td>
            </tr>
        )
    }

    //4. Rutina para el manejo de la carga y el render de informacion
    function contenido() {
        if(cargando){
            return <EstadoCarga texto="Cargando usuarios..." />
        }
        if(error){
            return <AlertaError mensaje={error} />
        }
        if(usuarios.length === 0){
            return <EstadoVacio icono="bi-people" titulo="No hay usuarios registrados" />
        }
        return(
            <div className="card tabla-tarjeta">
                <div className="table-responsive">
                    <table className="table align-middle mb-0">
                        <thead>
                            <tr>
                                <th>Usuario</th>
                                <th>Rol actual</th>
                                <th>Cambiar rol</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>{usuarios.map(pintarUsuario)}</tbody>
                    </table>
                </div>
            </div>
        )
    }

    return(
        <>
            <EncabezadoPagina
                titulo="Usuarios"
                subtitulo={usuarios ? `${usuarios.length} cuentas registradas en el conjunto.` : 'Cuentas registradas en el conjunto.'}
            />

            <AlertaError mensaje={errorAccion} />
            {contenido()}

            <ModalConfirmacion
                abierto={porEliminar !== null}
                titulo="¿Eliminar este usuario?"
                textoConfirmar="Sí, eliminar"
                procesando={eliminando}
                alConfirmar={confirmarEliminacion}
                alCerrar={() => setPorEliminar(null)}
            >
                Se eliminará la cuenta de <strong>{porEliminar?.nombres}</strong> y todas sus reservas.
            </ModalConfirmacion>
        </>
    )

}
