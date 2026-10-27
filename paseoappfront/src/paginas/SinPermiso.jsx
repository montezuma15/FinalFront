import { Link } from 'react-router-dom'
import { EstadoVacio } from '../componentes/Estados.jsx'

// A donde llega quien intenta entrar a una ruta que su rol no permite
export function SinPermiso() {
  return (
    <EstadoVacio icono="bi-shield-lock" titulo="No tienes permiso para ver esta página">
      <p>Esta sección es solo para administradores del conjunto.</p>
      <Link to="/inicio" className="btn btn-primary">Volver al inicio</Link>
    </EstadoVacio>
  )
}
