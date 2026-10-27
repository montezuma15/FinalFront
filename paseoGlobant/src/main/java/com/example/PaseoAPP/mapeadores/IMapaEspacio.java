package com.example.PaseoAPP.mapeadores;

import com.example.PaseoAPP.dtos.EspacioDTO;
import com.example.PaseoAPP.modelos.Espacio;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface IMapaEspacio {

    EspacioDTO convertir_modelo_a_dto(Espacio espacio);
    List<EspacioDTO> convertir_lista_de_modelo_a_lista_de_dto(List<Espacio> lista);
}
