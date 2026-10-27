package com.example.PaseoAPP.servicios;

import com.example.PaseoAPP.dtos.LoginRespuestaDTO;
import com.example.PaseoAPP.dtos.LoginSolicitudDTO;
import com.example.PaseoAPP.mapeadores.IMapaUsuario;
import com.example.PaseoAPP.modelos.Usuario;
import com.example.PaseoAPP.repositorios.IRepositorioUsuario;
import com.example.PaseoAPP.seguridad.ServicioToken;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthServicioImpl implements IAuthServicio {

    private final IRepositorioUsuario repositorioUsuario;
    private final IMapaUsuario mapaUsuario;
    private final PasswordEncoder codificadorContraseña;
    private final ServicioToken servicioToken;

    public AuthServicioImpl(IRepositorioUsuario repositorioUsuario, IMapaUsuario mapaUsuario, PasswordEncoder codificadorContraseña, ServicioToken servicioToken) {
        this.repositorioUsuario = repositorioUsuario;
        this.mapaUsuario = mapaUsuario;
        this.codificadorContraseña = codificadorContraseña;
        this.servicioToken = servicioToken;
    }

    @Override
    public LoginRespuestaDTO iniciarSesion(LoginSolicitudDTO datos) {
        //Mismo mensaje si falla el correo o la contraseña: no revelamos cual de los dos esta mal
        Usuario usuario = this.repositorioUsuario.findByCorreo(datos.correo())
                .filter(encontrado -> this.codificadorContraseña.matches(datos.contraseña(), encontrado.getContraseña()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Correo o contraseña incorrectos"));

        String token = this.servicioToken.generarToken(usuario);
        return new LoginRespuestaDTO(token, this.mapaUsuario.convertir_modelo_a_dto(usuario));
    }
}
