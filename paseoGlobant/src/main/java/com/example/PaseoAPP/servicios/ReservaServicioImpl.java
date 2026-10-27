package com.example.PaseoAPP.servicios;

import com.example.PaseoAPP.dtos.ReservaDTO;
import com.example.PaseoAPP.dtos.ReservaSolicitudDTO;
import com.example.PaseoAPP.enums.FranjaHoraria;
import com.example.PaseoAPP.mapeadores.IMapaReserva;
import com.example.PaseoAPP.modelos.Espacio;
import com.example.PaseoAPP.modelos.Reserva;
import com.example.PaseoAPP.modelos.Usuario;
import com.example.PaseoAPP.repositorios.IRepositorioEspacio;
import com.example.PaseoAPP.repositorios.IRepositorioReserva;
import com.example.PaseoAPP.repositorios.IRepositorioUsuario;
import com.example.PaseoAPP.validadores.IValidadorReserva;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
public class ReservaServicioImpl implements IReservaServicio {

    //Ordenamos en Java y no en la BD: la franja se guarda como texto y "HORA_10" quedaria antes que "HORA_6".
    //Comparar el enum usa su orden de declaracion (HORA_6, HORA_7, ...)
    private static final Comparator<Reserva> POR_FECHA_Y_FRANJA =
            Comparator.comparing(Reserva::getFecha).thenComparing(Reserva::getFranja);

    private final IMapaReserva mapaReserva;
    private final IRepositorioReserva repositorioReserva;
    private final IRepositorioEspacio repositorioEspacio;
    private final IRepositorioUsuario repositorioUsuario;
    private final IValidadorReserva validadorReserva;

    public ReservaServicioImpl(IMapaReserva mapaReserva, IRepositorioReserva repositorioReserva, IRepositorioEspacio repositorioEspacio, IRepositorioUsuario repositorioUsuario, IValidadorReserva validadorReserva) {
        this.mapaReserva = mapaReserva;
        this.repositorioReserva = repositorioReserva;
        this.repositorioEspacio = repositorioEspacio;
        this.repositorioUsuario = repositorioUsuario;
        this.validadorReserva = validadorReserva;
    }

    @Override
    public ReservaDTO guardarReservaEnBD(ReservaSolicitudDTO datos, UUID usuarioId) {
        this.validadorReserva.validarNuevaReserva(datos);

        Espacio espacio = this.repositorioEspacio.findById(datos.espacioId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "espacio no encontrado"));
        //el usuario sale del token, nunca del body
        Usuario usuario = this.repositorioUsuario.findById(usuarioId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "usuario no encontrado"));

        Reserva nuevaReserva = new Reserva(null, datos.fecha(), datos.franja(), usuario, espacio);
        Reserva reservaGuardada = this.repositorioReserva.save(nuevaReserva);
        return this.mapaReserva.convertir_modelo_a_dto(reservaGuardada);
    }

    @Override
    public List<ReservaDTO> buscarReservasEnBD(UUID espacioId, LocalDate fecha) {
        //los filtros son opcionales: si llegan null no filtran
        List<Reserva> reservasEncontradas = this.repositorioReserva.findAll()
                .stream()
                .filter(reserva -> espacioId == null || reserva.getEspacio().getId().equals(espacioId))
                .filter(reserva -> fecha == null || reserva.getFecha().equals(fecha))
                .sorted(POR_FECHA_Y_FRANJA)
                .toList();
        return this.mapaReserva.convertir_lista_de_modelo_a_lista_de_dto(reservasEncontradas);
    }

    @Override
    public List<ReservaDTO> buscarReservasDeUsuario(UUID usuarioId) {
        List<Reserva> reservasEncontradas = this.repositorioReserva.findByUsuarioId(usuarioId)
                .stream()
                .sorted(POR_FECHA_Y_FRANJA)
                .toList();
        return this.mapaReserva.convertir_lista_de_modelo_a_lista_de_dto(reservasEncontradas);
    }

    @Override
    public List<FranjaHoraria> buscarFranjasOcupadas(UUID espacioId, LocalDate fecha) {
        return this.repositorioReserva.findByEspacioIdAndFecha(espacioId, fecha)
                .stream()
                .map(Reserva::getFranja)
                .toList();
    }

    @Override
    public void eliminarReservaEnBD(UUID id, UUID usuarioId, boolean esAdministrador) {
        Reserva reserva = this.repositorioReserva.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "reserva no encontrada"));

        //el usuario normal solo puede cancelar sus propias reservas
        boolean esPropia = reserva.getUsuario().getId().equals(usuarioId);
        if(!esAdministrador && !esPropia){
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Solo puedes cancelar tus propias reservas");
        }
        this.repositorioReserva.deleteById(id);
    }
}
