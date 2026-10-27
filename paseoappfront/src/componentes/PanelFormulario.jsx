// Layout de login y registro: imagen con mensaje a la izquierda, formulario a la derecha
export function PanelFormulario({ imagen, titulo, subtitulo, children }) {
  return (
    <div className="panel-formulario">
      <div className="panel-imagen d-none d-lg-flex" style={{ backgroundImage: `url(${imagen})` }}>
        <div className="panel-imagen-texto">
          <span className="marca-icono mb-4"><i className="bi bi-buildings"></i></span>
          <h1 className="display-6 fw-bold">{titulo}</h1>
          <p className="lead mb-0">{subtitulo}</p>
        </div>
      </div>

      <div className="panel-lado-formulario">
        <div className="w-100" style={{ maxWidth: '440px' }}>
          <div className="d-flex align-items-center gap-2 mb-5">
            <span className="marca-icono marca-icono-sm"><i className="bi bi-buildings"></i></span>
            <span className="fs-5 fw-bold">Paseo<span className="text-acento">.</span></span>
          </div>

          {children}
        </div>
      </div>
    </div>
  )
}
