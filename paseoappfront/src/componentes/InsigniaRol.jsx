import { ROLES } from '../auth/permisos.js'

const TEXTOS = {
    [ROLES.ADMINISTRADOR]: { texto: 'Administrador', icono: 'bi-shield-lock' },
    [ROLES.USUARIO]: { texto: 'Residente', icono: 'bi-person' },
}

export function InsigniaRol({ rol }) {
    const datos = TEXTOS[rol] ?? { texto: rol, icono: 'bi-person' }
    return (
        <span className={`insignia-rol insignia-rol-${rol?.toLowerCase()}`}>
            <i className={`bi ${datos.icono}`}></i>{datos.texto}
        </span>
    )
}
