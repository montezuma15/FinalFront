package com.example.PaseoAPP.controladores;

import com.example.PaseoAPP.dtos.ReservaDTO;
import com.example.PaseoAPP.dtos.ReservaSolicitudDTO;
import com.example.PaseoAPP.enums.FranjaHoraria;
import com.example.PaseoAPP.seguridad.UsuarioAutenticado;
import com.example.PaseoAPP.servicios.IReservaServicio;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/paseoapi/v1/reservas")
public class ReservaControlador {

    //Por cada serivicio ofrecido
    //configuro 1 funcion controladora

    private final IReservaServicio servicio;

    public ReservaControlador(IReservaServicio servicio) {
        this.servicio = servicio;
    }

    //funcion para controlar el guardado: la reserva queda a nombre de quien esta logueado
    @PostMapping
    public ResponseEntity<ReservaDTO>controlarGuardado(@RequestBody ReservaSolicitudDTO datos, @AuthenticationPrincipal Jwt token){
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(this.servicio.guardarReservaEnBD(datos, UsuarioAutenticado.id(token)));
    }

    //funcion para controlar el borrado (cancelar): el dueño o el administrador
    @DeleteMapping("/{id}")
    public ResponseEntity<Void>controlarBorrado(@PathVariable UUID id, @AuthenticationPrincipal Jwt token){
        this.servicio.eliminarReservaEnBD(id, UsuarioAutenticado.id(token), UsuarioAutenticado.esAdministrador(token));
        return ResponseEntity.noContent().build(); //204
    }


    //funcion para controlar el listar de TODAS las reservas (solo administrador)
    @GetMapping
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<List<ReservaDTO>>controlarListado(
            @RequestParam(required = false) UUID espacioId,
            @RequestParam(required = false) LocalDate fecha){
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(this.servicio.buscarReservasEnBD(espacioId, fecha));
    }

    //funcion para listar solo las reservas de quien esta logueado
    @GetMapping("/mias")
    public ResponseEntity<List<ReservaDTO>>controlarListadoPropio(@AuthenticationPrincipal Jwt token){
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(this.servicio.buscarReservasDeUsuario(UsuarioAutenticado.id(token)));
    }

    //funcion para saber que franjas ya estan tomadas (no expone quien reservo)
    @GetMapping("/ocupadas")
    public ResponseEntity<List<FranjaHoraria>>controlarFranjasOcupadas(
            @RequestParam UUID espacioId,
            @RequestParam LocalDate fecha){
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(this.servicio.buscarFranjasOcupadas(espacioId, fecha));
    }

}
