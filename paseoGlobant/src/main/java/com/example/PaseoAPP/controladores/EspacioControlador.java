package com.example.PaseoAPP.controladores;

import com.example.PaseoAPP.dtos.EspacioDTO;
import com.example.PaseoAPP.modelos.Espacio;
import com.example.PaseoAPP.servicios.IEspacioServicio;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/paseoapi/v1/espacios")
public class EspacioControlador {

    //Por cada serivicio ofrecido
    //configuro 1 funcion controladora

    private final IEspacioServicio servicio;

    public EspacioControlador(IEspacioServicio servicio) {
        this.servicio = servicio;
    }

    //funcion para controlar el guardado (solo administrador)
    @PostMapping
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<EspacioDTO>controlarGuardado(@RequestBody Espacio datos){
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(this.servicio.guardarEspacioEnBD(datos));
    }
    //funcion para controlar las modificaciones (solo administrador)
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<EspacioDTO>controlarModificado(@RequestBody Espacio datos, @PathVariable UUID id){
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(this.servicio.modificarEspacioEnBD(datos,id));
    }

    //funcion para controlar el borrado (solo administrador)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Void>controlarBorrado(@PathVariable UUID id){
        this.servicio.eliminarEspacioEnBD(id);
        return ResponseEntity.noContent().build(); //204
    }


    //funcion para controlar el listar (cualquier usuario logueado)
    @GetMapping
    public ResponseEntity<List<EspacioDTO>>controlarListado(){
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(this.servicio.buscarEspaciosEnBD());
    }

    //funcion para buscar un espacio (cualquier usuario logueado)
    @GetMapping("/{id}")
    public ResponseEntity<EspacioDTO>controlarBusqueda(@PathVariable UUID id){
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(this.servicio.buscarEspacioPorId(id));
    }

}
