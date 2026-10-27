package com.example.PaseoAPP.controladores;

import com.example.PaseoAPP.dtos.UsuarioDTO;
import com.example.PaseoAPP.modelos.Usuario;
import com.example.PaseoAPP.seguridad.UsuarioAutenticado;
import com.example.PaseoAPP.servicios.IUsuarioServicio;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/paseoapi/v1/usuarios")
public class UsuarioControlador {

    //Por cada serivicio ofrecido
    //configuro 1 funcion controladora

    private final IUsuarioServicio servicio;

    public UsuarioControlador(IUsuarioServicio servicio) {
        this.servicio = servicio;
    }

    //funcion para controlar el guardado (publica: es el registro)
    @PostMapping
    public ResponseEntity<UsuarioDTO>controlarGuardado(@RequestBody Usuario datos){
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(this.servicio.guardarUsuarioEnBD(datos));
    }
    //funcion para controlar las modificaciones (solo administrador)
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<UsuarioDTO>controlarModificado(@RequestBody Usuario datos, @PathVariable UUID id){
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(this.servicio.modificarUsuarioEnBD(datos,id));
    }

    //funcion para controlar el borrado (solo administrador)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Void>controlarBorrado(@PathVariable UUID id, @AuthenticationPrincipal Jwt token){
       this.servicio.eliminarUsuarioEnBD(id, UsuarioAutenticado.id(token));
       return ResponseEntity.noContent().build(); //204
    }


    //funcion para controlar el listar (solo administrador)
    @GetMapping
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<List<UsuarioDTO>>controlarListado(){
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(this.servicio.buscarUsuariosEnBD());
    }

}
