import { useState } from 'react'
import { Link } from 'react-router-dom'

import { useDatosApi } from '../utilidades/useDatosApi.js'
import { eliminarEspacio, listarEspacios } from '../services/servicioEspacios.js'
import { mensajeDeError } from '../services/clienteApi.js'

import { Autorizado } from '../componentes/Autorizado.jsx'
import { EncabezadoPagina } from '../componentes/EncabezadoPagina.jsx'
import { AlertaError, EstadoCarga, EstadoVacio } from '../componentes/Estados.jsx'
import { ModalConfirmacion } from '../componentes/ModalConfirmacion.jsx'
import { TarjetaEspacio } from '../componentes/TarjetaEspacio.jsx'

export function ListaEspacios(){

    const { datos: espacios, cargando, error, setDatos } = useDatosApi(listarEspacios)
    const [busqueda, setBusqueda] = useState('')

    // Espacio que el administrador quiere eliminar (abre el modal)
    const [porEliminar, setPorEliminar] = useState(null)
    const [eliminando, setEliminando] = useState(false)
    const [errorEliminar, setErrorEliminar] = useState('')

    async function confirmarEliminacion() {
        setEliminando(true)
        setErrorEliminar('')
        try {
            await eliminarEspacio(porEliminar.id)
            setDatos((lista) => lista.filter((espacio) => espacio.id !== porEliminar.id))
        } catch (error) {
            setErrorEliminar(mensajeDeError(error, 'No fue posible eliminar el espacio'))
        } finally {
            setEliminando(false)
            setPorEliminar(null)
        }
    }

    function pintarEspacio(espacio){
        return(
            <div className="col-md-6 col-xl-4" key={espacio.id}>
                <TarjetaEspacio espacio={espacio} alEliminar={setPorEliminar}/>
            </div>
        )
    }

    function contenido() {
        if (cargando) return <EstadoCarga texto="Cargando espacios..." />
        if (error) return <AlertaError mensaje={error} />

        const texto = busqueda.trim().toLowerCase()
        const filtrados = espacios.filter((espacio) => espacio.nombre.toLowerCase().includes(texto))

        if (filtrados.length === 0) {
            return (
                <EstadoVacio icono="bi-search" titulo="No encontramos espacios">
                    {espacios.length === 0 ? 'Aún no hay espacios registrados.' : 'Prueba con otro nombre.'}
                </EstadoVacio>
            )
        }
        return <section className="row g-4">{filtrados.map(pintarEspacio)}</section>
    }

    return(
        <>
            <EncabezadoPagina titulo="Espacios" subtitulo="Zonas comunes disponibles para reservar.">
                <div className="buscador">
                    <i className="bi bi-search"></i>
                    <input
                        type="search"
                        className="form-control"
                        placeholder="Buscar espacio..."
                        value={busqueda}
                        onChange={(evento) => setBusqueda(evento.target.value)}
                        aria-label="Buscar espacio"
                    />
                </div>
                <Autorizado permiso="espacios:gestionar">
                    <Link to="/admin/espacios/nuevo" className="btn btn-primary">
                        <i className="bi bi-plus-lg me-2"></i>Nuevo espacio
                    </Link>
                </Autorizado>
            </EncabezadoPagina>

            <AlertaError mensaje={errorEliminar} />
            {contenido()}

            <ModalConfirmacion
                abierto={porEliminar !== null}
                titulo="¿Eliminar este espacio?"
                textoConfirmar="Sí, eliminar"
                procesando={eliminando}
                alConfirmar={confirmarEliminacion}
                alCerrar={() => setPorEliminar(null)}
            >
                Vas a eliminar <strong>{porEliminar?.nombre}</strong>. Si tiene reservas no se podrá eliminar.
            </ModalConfirmacion>
        </>
    )

}
