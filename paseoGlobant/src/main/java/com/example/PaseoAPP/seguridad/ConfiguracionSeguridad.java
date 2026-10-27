package com.example.PaseoAPP.seguridad;

import com.nimbusds.jose.jwk.source.ImmutableSecret;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;

@Configuration
@EnableMethodSecurity //habilita @PreAuthorize en los controladores
public class ConfiguracionSeguridad {

    public static final String CLAIM_ROL = "rol";

    private final SecretKey llaveSecreta;

    public ConfiguracionSeguridad(@Value("${paseo.jwt.secreto}") String secreto) {
        this.llaveSecreta = new SecretKeySpec(secreto.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
    }

    @Bean
    public SecurityFilterChain cadenaDeSeguridad(HttpSecurity http) throws Exception {
        http
                //API sin sesion: cada peticion se autentica con su token
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
                .sessionManagement(sesion -> sesion.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(reglas -> reglas
                        .requestMatchers(HttpMethod.POST, "/paseoapi/v1/auth/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/paseoapi/v1/usuarios").permitAll()
                        .requestMatchers("/error").permitAll()
                        //lo que depende del rol se controla con @PreAuthorize en cada controlador
                        .anyRequest().authenticated()
                )
                .oauth2ResourceServer(servidor -> servidor
                        .jwt(jwt -> jwt.jwtAuthenticationConverter(convertidorDeRoles()))
                );
        return http.build();
    }

    //Convierte el claim "rol" del token en la autoridad ROLE_<rol> que usa hasRole(...)
    private JwtAuthenticationConverter convertidorDeRoles() {
        JwtGrantedAuthoritiesConverter autoridades = new JwtGrantedAuthoritiesConverter();
        autoridades.setAuthoritiesClaimName(CLAIM_ROL);
        autoridades.setAuthorityPrefix("ROLE_");

        JwtAuthenticationConverter convertidor = new JwtAuthenticationConverter();
        convertidor.setJwtGrantedAuthoritiesConverter(autoridades);
        return convertidor;
    }

    @Bean
    public JwtEncoder codificadorJwt() {
        return new NimbusJwtEncoder(new ImmutableSecret<>(llaveSecreta));
    }

    @Bean
    public JwtDecoder decodificadorJwt() {
        return NimbusJwtDecoder.withSecretKey(llaveSecreta).macAlgorithm(MacAlgorithm.HS256).build();
    }

    @Bean
    public PasswordEncoder codificadorContraseña() {
        return new BCryptPasswordEncoder();
    }
}
