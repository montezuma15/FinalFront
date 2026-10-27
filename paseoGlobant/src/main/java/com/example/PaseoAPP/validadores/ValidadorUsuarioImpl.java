package com.example.PaseoAPP.validadores;

import com.example.PaseoAPP.modelos.Usuario;
import com.example.PaseoAPP.repositorios.IRepositorioUsuario;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

@Component
public class ValidadorUsuarioImpl implements IValidadorUsuario {

    private final IRepositorioUsuario repositorioUsuario;

    public ValidadorUsuarioImpl(IRepositorioUsuario repositorioUsuario) {
        this.repositorioUsuario = repositorioUsuario;
    }

    @Override
    public void validarNuevoUsuario(Usuario datos) {
        validarCorreoNoRepetido(datos.getCorreo());
        validarNombreVacio(datos.getNombres());
        validarLongitudContraseña(datos.getContraseña());

    }

    @Override
    public void validarDatosModificacion(Usuario datos) {
        validarNombreVacio(datos.getNombres());
    }

    //Reglas de validacion individuales
    public void validarCorreoNoRepetido(String correo){
        if(repositorioUsuario.findByCorreo(correo).isPresent()){
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Ya existe un usuario con el correo ingresado"
            );

        }
    }
    public void validarNombreVacio(String nombres){
        if(nombres.isEmpty() || nombres.isBlank()){
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El nombre es obligatorio, ingresalo por favor"
            );
        }
    }
    public void validarLongitudContraseña(String contraseña){
        if(contraseña.length()<6){
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Contraseña invalida, revisala por favor"
            );

        }
    }

}
