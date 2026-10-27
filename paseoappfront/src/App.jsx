import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ProveedorAuth } from './contexto/ContextoAuth'
import { RutaPublica } from './rutas/RutaPublica'
import { RutaPrivada } from './rutas/RutaPrivada'
import { RutaPorRol } from './rutas/RutaPorRol'
import { LayoutApp } from './componentes/LayoutApp'
import { RegistroUsuario } from './paginas/RegistroUsuario'
import { Login } from './paginas/Login'
import { Inicio } from './paginas/Inicio'
import { ListaEspacios } from './paginas/ListaEspacios'
import { RegistroReserva } from './paginas/RegistroReserva'
import { MisReservas } from './paginas/MisReservas'
import { FormularioEspacio } from './paginas/FormularioEspacio'
import { TodasLasReservas } from './paginas/TodasLasReservas'
import { ListaUsuarios } from './paginas/ListaUsuarios'
import { SinPermiso } from './paginas/SinPermiso'

export function App() {
  return (
    <ProveedorAuth>
      <BrowserRouter>
        <Routes>
          {/* Rutas publicas: si ya hay sesion redirigen a /inicio */}
          <Route element={<RutaPublica />}>
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<RegistroUsuario />} />
          </Route>

          {/* Rutas privadas: solo usuarios logueados, dentro del layout con menu */}
          <Route element={<RutaPrivada />}>
            <Route element={<LayoutApp />}>
              <Route path="/inicio" element={<Inicio />} />
              <Route path="/espacios" element={<ListaEspacios />} />
              <Route path="/espacios/:id/reservar" element={<RegistroReserva />} />
              <Route path="/mis-reservas" element={<MisReservas />} />
              <Route path="/sin-permiso" element={<SinPermiso />} />

              {/* Rutas por permiso: solo ADMINISTRADOR (ver auth/permisos.js) */}
              <Route element={<RutaPorRol permiso="espacios:gestionar" />}>
                <Route path="/admin/espacios/nuevo" element={<FormularioEspacio />} />
                <Route path="/admin/espacios/:id/editar" element={<FormularioEspacio />} />
              </Route>
              <Route element={<RutaPorRol permiso="reservas:ver-todas" />}>
                <Route path="/admin/reservas" element={<TodasLasReservas />} />
              </Route>
              <Route element={<RutaPorRol permiso="usuarios:gestionar" />}>
                <Route path="/admin/usuarios" element={<ListaUsuarios />} />
              </Route>
            </Route>
          </Route>

          {/* Cualquier otra ruta: RutaPrivada decide si va a /inicio o a /login */}
          <Route path="*" element={<Navigate to="/inicio" replace />} />
        </Routes>
      </BrowserRouter>
    </ProveedorAuth>
  )
}
