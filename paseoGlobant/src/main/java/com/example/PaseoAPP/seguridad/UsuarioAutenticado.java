package com.example.PaseoAPP.seguridad;

import com.example.PaseoAPP.enums.Rol;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.UUID;

//Ayudas para leer quien hace la peticion a partir de su token
public final class UsuarioAutenticado {

    private UsuarioAutenticado() {
    }

    public static UUID id(Jwt token) {
        return UUID.fromString(token.getSubject());
    }

    public static boolean esAdministrador(Jwt token) {
        return Rol.ADMINISTRADOR.name().equals(token.getClaimAsString(ConfiguracionSeguridad.CLAIM_ROL));
    }
}
