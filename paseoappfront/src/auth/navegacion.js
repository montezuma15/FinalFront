// Menu lateral. Cada opcion declara el permiso que necesita;
// LayoutApp solo pinta las que el usuario puede ver.
export const GRUPOS_MENU = [
    {
        titulo: 'General',
        opciones: [
            { ruta: '/inicio', texto: 'Inicio', icono: 'bi-house-door' },
            { ruta: '/espacios', texto: 'Espacios', icono: 'bi-grid-1x2', permiso: 'espacios:ver' },
            { ruta: '/mis-reservas', texto: 'Mis reservas', icono: 'bi-calendar-check', permiso: 'reservas:ver-propias' },
        ],
    },
    {
        titulo: 'Administración',
        opciones: [
            { ruta: '/admin/reservas', texto: 'Todas las reservas', icono: 'bi-calendar3', permiso: 'reservas:ver-todas' },
            { ruta: '/admin/usuarios', texto: 'Usuarios', icono: 'bi-people', permiso: 'usuarios:gestionar' },
            { ruta: '/admin/espacios/nuevo', texto: 'Nuevo espacio', icono: 'bi-plus-square', permiso: 'espacios:gestionar' },
        ],
    },
]
