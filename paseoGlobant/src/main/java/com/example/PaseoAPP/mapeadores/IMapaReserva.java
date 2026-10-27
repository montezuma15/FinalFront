package com.example.PaseoAPP.mapeadores;

import com.example.PaseoAPP.dtos.ReservaDTO;
import com.example.PaseoAPP.modelos.Reserva;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface IMapaReserva {

    //Aplanamos el espacio y el usuario para que el front no reciba datos de mas (ej: contraseña)
    @Mapping(source = "espacio.id", target = "espacioId")
    @Mapping(source = "espacio.nombre", target = "espacioNombre")
    @Mapping(source = "espacio.foto", target = "espacioFoto")
    @Mapping(source = "usuario.id", target = "usuarioId")
    @Mapping(source = "usuario.nombres", target = "usuarioNombres")
    ReservaDTO convertir_modelo_a_dto(Reserva reserva);
    List<ReservaDTO> convertir_lista_de_modelo_a_lista_de_dto(List<Reserva> lista);
}
