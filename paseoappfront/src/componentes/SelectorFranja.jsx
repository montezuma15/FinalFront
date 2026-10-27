import { FRANJAS, textoFranja, yaPaso } from '../utilidades/fechas.js'

// Grilla con las franjas del dia. Las ocupadas o que ya pasaron no se pueden elegir.
export function SelectorFranja({ fecha, ocupadas, seleccionada, alSeleccionar }) {

    function pintarFranja(franja) {
        const estaOcupada = ocupadas.includes(franja)
        const pasada = yaPaso(fecha, franja)
        const deshabilitada = estaOcupada || pasada
        const estado = estaOcupada ? 'ocupada' : pasada ? 'pasada' : seleccionada === franja ? 'seleccionada' : 'libre'

        return (
            <button
                key={franja}
                type="button"
                className={`chip-franja chip-franja-${estado}`}
                disabled={deshabilitada}
                aria-pressed={seleccionada === franja}
                onClick={() => alSeleccionar(franja)}
            >
                <span className="fw-semibold">{textoFranja(franja)}</span>
                <small>{estaOcupada ? 'Ocupada' : pasada ? 'No disponible' : 'Libre'}</small>
            </button>
        )
    }

    return (
        <div className="grilla-franjas">
            {FRANJAS.map(pintarFranja)}
        </div>
    )
}
