package com.example.PaseoAPP.seguridad;

import com.example.PaseoAPP.modelos.Usuario;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

//Genera el JWT que el front envia en cada peticion (Authorization: Bearer <token>)
@Service
public class ServicioToken {

    private final JwtEncoder codificadorJwt;
    private final long minutosExpiracion;

    public ServicioToken(JwtEncoder codificadorJwt, @Value("${paseo.jwt.expiracion-minutos}") long minutosExpiracion) {
        this.codificadorJwt = codificadorJwt;
        this.minutosExpiracion = minutosExpiracion;
    }

    public String generarToken(Usuario usuario) {
        Instant ahora = Instant.now();
        JwtClaimsSet datosDelToken = JwtClaimsSet.builder()
                .issuer("paseoapp")
                .issuedAt(ahora)
                .expiresAt(ahora.plus(minutosExpiracion, ChronoUnit.MINUTES))
                .subject(usuario.getId().toString())
                .claim(ConfiguracionSeguridad.CLAIM_ROL, usuario.getRol().name())
                .claim("nombres", usuario.getNombres())
                .claim("correo", usuario.getCorreo())
                .build();

        JwsHeader cabecera = JwsHeader.with(MacAlgorithm.HS256).build();
        return this.codificadorJwt.encode(JwtEncoderParameters.from(cabecera, datosDelToken)).getTokenValue();
    }
}
