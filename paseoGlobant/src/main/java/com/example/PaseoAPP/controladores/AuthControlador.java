package com.example.PaseoAPP.controladores;

import com.example.PaseoAPP.dtos.LoginRespuestaDTO;
import com.example.PaseoAPP.dtos.LoginSolicitudDTO;
import com.example.PaseoAPP.dtos.UsuarioDTO;
import com.example.PaseoAPP.seguridad.UsuarioAutenticado;
import com.example.PaseoAPP.servicios.IAuthServicio;
import com.example.PaseoAPP.servicios.IUsuarioServicio;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/paseoapi/v1/auth")
public class AuthControlador {

    private final IAuthServicio servicioAuth;
    private final IUsuarioServicio servicioUsuario;

    public AuthControlador(IAuthServicio servicioAuth, IUsuarioServicio servicioUsuario) {
        this.servicioAuth = servicioAuth;
        this.servicioUsuario = servicioUsuario;
    }

    //funcion para iniciar sesion: devuelve el token y los datos del usuario (con su rol)
    @PostMapping("/login")
    public ResponseEntity<LoginRespuestaDTO>controlarLogin(@RequestBody LoginSolicitudDTO datos){
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(this.servicioAuth.iniciarSesion(datos));
    }

    //funcion para saber quien soy: el front la usa al recargar para traer el rol desde la BD
    @GetMapping("/yo")
    public ResponseEntity<UsuarioDTO>controlarUsuarioActual(@AuthenticationPrincipal Jwt token){
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(this.servicioUsuario.buscarUsuarioPorId(UsuarioAutenticado.id(token)));
    }

}
