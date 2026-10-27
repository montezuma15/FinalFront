package com.example.PaseoAPP.validadores;

import com.example.PaseoAPP.modelos.Espacio;

import java.util.UUID;

public interface IValidadorEspacio {

    void validarNuevoEspacio(Espacio datos);
    void validarDatosModificacion(Espacio datos, UUID id);

}
