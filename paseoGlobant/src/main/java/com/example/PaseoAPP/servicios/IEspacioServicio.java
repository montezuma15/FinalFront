package com.example.PaseoAPP.servicios;

import com.example.PaseoAPP.dtos.EspacioDTO;
import com.example.PaseoAPP.modelos.Espacio;

import java.util.List;
import java.util.UUID;

public interface IEspacioServicio {

    //contrato que describe que se puede hacer en el servicio
    EspacioDTO guardarEspacioEnBD(Espacio datos);
    EspacioDTO modificarEspacioEnBD(Espacio datos, UUID id);
    List<EspacioDTO> buscarEspaciosEnBD();
    EspacioDTO buscarEspacioPorId(UUID id);
    void eliminarEspacioEnBD(UUID id);

}
