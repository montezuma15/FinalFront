package com.example.PaseoAPP.servicios;

import com.example.PaseoAPP.dtos.ReservaDTO;
import com.example.PaseoAPP.dtos.ReservaSolicitudDTO;
import com.example.PaseoAPP.enums.FranjaHoraria;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface IReservaServicio {

    //contrato que describe que se puede hacer en el servicio
    ReservaDTO guardarReservaEnBD(ReservaSolicitudDTO datos, UUID usuarioId);
    List<ReservaDTO> buscarReservasEnBD(UUID espacioId, LocalDate fecha);
    List<ReservaDTO> buscarReservasDeUsuario(UUID usuarioId);
    List<FranjaHoraria> buscarFranjasOcupadas(UUID espacioId, LocalDate fecha);
    void eliminarReservaEnBD(UUID id, UUID usuarioId, boolean esAdministrador);

}
