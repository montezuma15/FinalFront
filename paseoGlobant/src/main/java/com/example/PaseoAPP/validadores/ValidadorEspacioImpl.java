package com.example.PaseoAPP.validadores;

import com.example.PaseoAPP.modelos.Espacio;
import com.example.PaseoAPP.repositorios.IRepositorioEspacio;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;
import java.util.UUID;

@Component
public class ValidadorEspacioImpl implements IValidadorEspacio {

    private final IRepositorioEspacio repositorioEspacio;

    public ValidadorEspacioImpl(IRepositorioEspacio repositorioEspacio) {
        this.repositorioEspacio = repositorioEspacio;
    }

    @Override
    public void validarNuevoEspacio(Espacio datos) {
        validarNombreVacio(datos.getNombre());
        validarNombreNoRepetido(datos.getNombre(), null);
        validarAforo(datos.getAforo());
    }

    @Override
    public void validarDatosModificacion(Espacio datos, UUID id) {
        validarNombreVacio(datos.getNombre());
        validarNombreNoRepetido(datos.getNombre(), id);
        validarAforo(datos.getAforo());
    }

    //Reglas de validacion individuales
    public void validarNombreVacio(String nombre){
        if(nombre == null || nombre.isBlank()){
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El nombre del espacio es obligatorio"
            );
        }
    }
    //idActual permite que al editar un espacio conserve su mismo nombre
    public void validarNombreNoRepetido(String nombre, UUID idActual){
        Optional<Espacio> espacioConEseNombre = repositorioEspacio.findByNombre(nombre);
        if(espacioConEseNombre.isPresent() && !espacioConEseNombre.get().getId().equals(idActual)){
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Ya existe un espacio con ese nombre"
            );
        }
    }
    public void validarAforo(int aforo){
        if(aforo <= 0){
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El aforo debe ser mayor a 0"
            );
        }
    }

}
