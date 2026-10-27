// Ventana para confirmar acciones que no se pueden deshacer (eliminar, cancelar).
// Se controla con la prop "abierto" desde la pagina que la usa.
export function ModalConfirmacion({
    abierto,
    titulo,
    children,
    textoConfirmar = 'Confirmar',
    procesando = false,
    alConfirmar,
    alCerrar,
}) {
    if (!abierto) {
        return null
    }

    return (
        <>
            <div className="modal d-block" tabIndex="-1" role="dialog" aria-modal="true" onClick={alCerrar}>
                <div className="modal-dialog modal-dialog-centered" onClick={(evento) => evento.stopPropagation()}>
                    <div className="modal-content">
                        <div className="modal-body p-4 text-center">
                            <div className="icono-circulo icono-circulo-peligro mx-auto mb-3">
                                <i className="bi bi-exclamation-triangle"></i>
                            </div>
                            <h5 className="fw-bold">{titulo}</h5>
                            <div className="text-muted">{children}</div>
                        </div>
                        <div className="modal-footer border-0 pt-0 px-4 pb-4 justify-content-center">
                            <button type="button" className="btn btn-light" onClick={alCerrar} disabled={procesando}>
                                Volver
                            </button>
                            <button type="button" className="btn btn-danger" onClick={alConfirmar} disabled={procesando}>
                                {procesando ? 'Procesando...' : textoConfirmar}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop show"></div>
        </>
    )
}
