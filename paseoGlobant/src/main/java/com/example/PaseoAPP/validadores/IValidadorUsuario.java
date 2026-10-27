package com.example.PaseoAPP.validadores;

import com.example.PaseoAPP.modelos.Usuario;

public interface IValidadorUsuario {

    void validarNuevoUsuario(Usuario datos);
    void validarDatosModificacion(Usuario datos);

}
