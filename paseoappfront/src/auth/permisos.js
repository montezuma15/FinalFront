// Roles tal como llegan del backend (enum Rol de Spring)
export const ROLES = {
    ADMINISTRADOR: 'ADMINISTRADOR',
    USUARIO: 'USUARIO',
}

const TODOS = [ROLES.ADMINISTRADOR, ROLES.USUARIO]
const SOLO_ADMIN = [ROLES.ADMINISTRADOR]

// Unica fuente de verdad del front: que rol puede hacer que.
// Debe coincidir con los @PreAuthorize del backend (que es quien realmente protege los datos).
export const PERMISOS = {
    'espacios:ver': TODOS,
    'espacios:gestionar': SOLO_ADMIN,
    'reservas:crear': TODOS,
    'reservas:ver-propias': TODOS,
    'reservas:ver-todas': SOLO_ADMIN,
    'usuarios:gestionar': SOLO_ADMIN,
}

export function rolTienePermiso(rol, permiso) {
    return PERMISOS[permiso]?.includes(rol) ?? false
}
