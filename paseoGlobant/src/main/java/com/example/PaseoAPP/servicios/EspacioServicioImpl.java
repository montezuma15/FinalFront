package com.example.PaseoAPP.servicios;

import com.example.PaseoAPP.dtos.EspacioDTO;
import com.example.PaseoAPP.mapeadores.IMapaEspacio;
import com.example.PaseoAPP.modelos.Espacio;
import com.example.PaseoAPP.repositorios.IRepositorioEspacio;
import com.example.PaseoAPP.repositorios.IRepositorioReserva;
import com.example.PaseoAPP.validadores.IValidadorEspacio;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
public class EspacioServicioImpl implements IEspacioServicio {

    private final IMapaEspacio mapaEspacio;
    private final IRepositorioEspacio repositorioEspacio;
    private final IRepositorioReserva repositorioReserva;
    private final IValidadorEspacio validadorEspacio;

    public EspacioServicioImpl(IMapaEspacio mapaEspacio, IRepositorioEspacio repositorioEspacio, IRepositorioReserva repositorioReserva, IValidadorEspacio validadorEspacio) {
        this.mapaEspacio = mapaEspacio;
        this.repositorioEspacio = repositorioEspacio;
        this.repositorioReserva = repositorioReserva;
        this.validadorEspacio = validadorEspacio;
    }

    @Override
    public EspacioDTO guardarEspacioEnBD(Espacio datos) {
        this.validadorEspacio.validarNuevoEspacio(datos);
        Espacio espacioGuardado = this.repositorioEspacio.save(datos);
        return this.mapaEspacio.convertir_modelo_a_dto(espacioGuardado);
    }

    @Override
    public EspacioDTO modificarEspacioEnBD(Espacio datos, UUID id) {
        Espacio espacioQueEncontre = buscarOFallar(id);

        this.validadorEspacio.validarDatosModificacion(datos, id);

        espacioQueEncontre.setNombre(datos.getNombre());
        espacioQueEncontre.setDescripcion(datos.getDescripcion());
        espacioQueEncontre.setFoto(datos.getFoto());
        espacioQueEncontre.setAforo(datos.getAforo());
        Espacio espacioModificado = this.repositorioEspacio.save(espacioQueEncontre);

        return this.mapaEspacio.convertir_modelo_a_dto(espacioModificado);
    }

    @Override
    public List<EspacioDTO> buscarEspaciosEnBD() {
        List<Espacio> espaciosEncontrados = this.repositorioEspacio.findAll();
        return this.mapaEspacio.convertir_lista_de_modelo_a_lista_de_dto(espaciosEncontrados);
    }

    @Override
    public EspacioDTO buscarEspacioPorId(UUID id) {
        return this.mapaEspacio.convertir_modelo_a_dto(buscarOFallar(id));
    }

    @Override
    public void eliminarEspacioEnBD(UUID id) {
        buscarOFallar(id);
        //No borramos espacios con reservas para no dejar reservas huerfanas
        if(this.repositorioReserva.existsByEspacioId(id)){
            throw new ResponseStatusException(HttpStatus.CONFLICT, "No se puede eliminar: el espacio tiene reservas");
        }
        this.repositorioEspacio.deleteById(id);
    }

    private Espacio buscarOFallar(UUID id) {
        return this.repositorioEspacio.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "espacio no encontrado"));
    }
}
