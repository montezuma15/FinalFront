// Franjas horarias: deben coincidir con el enum FranjaHoraria del backend (HORA_6 ... HORA_21)
export const FRANJAS = Array.from({ length: 16 }, (_, i) => `HORA_${i + 6}`)

function dosDigitos(numero) {
    return String(numero).padStart(2, '0')
}

// 'HORA_8' -> 8
export function horaInicio(franja) {
    return Number(franja.split('_')[1])
}

// 'HORA_8' -> '08:00 – 09:00'
export function textoFranja(franja) {
    const hora = horaInicio(franja)
    return `${dosDigitos(hora)}:00 – ${dosDigitos(hora + 1)}:00`
}

// Fecha de hoy en formato yyyy-mm-dd usando la hora LOCAL
// (toISOString usa UTC y en Colombia despues de las 7pm ya daria "mañana")
export function fechaHoyISO() {
    const hoy = new Date()
    return `${hoy.getFullYear()}-${dosDigitos(hoy.getMonth() + 1)}-${dosDigitos(hoy.getDate())}`
}

// '2026-11-02' -> 'lunes, 2 de noviembre'
export function textoFecha(fechaISO, opciones = { weekday: 'long', day: 'numeric', month: 'long' }) {
    return new Date(`${fechaISO}T00:00`).toLocaleDateString('es-CO', opciones)
}

// true si la franja de esa fecha ya empezo o paso
export function yaPaso(fechaISO, franja) {
    const hoy = fechaHoyISO()
    if (fechaISO !== hoy) {
        return fechaISO < hoy
    }
    return horaInicio(franja) <= new Date().getHours()
}
