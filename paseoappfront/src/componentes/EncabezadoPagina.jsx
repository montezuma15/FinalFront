// Titulo de cada pagina privada. "children" son los botones de accion de la derecha.
export function EncabezadoPagina({ titulo, subtitulo, children }) {
    return (
        <div className="encabezado-pagina">
            <div>
                <h1 className="h3 fw-bold mb-1">{titulo}</h1>
                {subtitulo && <p className="text-muted mb-0">{subtitulo}</p>}
            </div>
            {children && <div className="d-flex flex-wrap gap-2">{children}</div>}
        </div>
    )
}
