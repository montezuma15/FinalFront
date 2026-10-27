package com.example.PaseoAPP.validadores;

import com.example.PaseoAPP.dtos.ReservaSolicitudDTO;
import com.example.PaseoAPP.enums.FranjaHoraria;
import com.example.PaseoAPP.repositorios.IRepositorioReserva;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Component
public class ValidadorReservaImpl implements IValidadorReserva {

    private final IRepositorioReserva repositorioReserva;

    public ValidadorReservaImpl(IRepositorioReserva repositorioReserva) {
        this.repositorioReserva = repositorioReserva;
    }

    @Override
    public void validarNuevaReserva(ReservaSolicitudDTO datos) {
        validarCamposObligatorios(datos);
        validarFechaNoPasada(datos.fecha(), datos.franja());
        validarFranjaLibre(datos.espacioId(), datos.fecha(), datos.franja());
    }

    //Reglas de validacion individuales
    public void validarCamposObligatorios(ReservaSolicitudDTO datos){
        if(datos.espacioId() == null || datos.fecha() == null || datos.franja() == null){
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Espacio, fecha y franja horaria son obligatorios"
            );
        }
    }
    public void validarFechaNoPasada(LocalDate fecha, FranjaHoraria franja){
        LocalDate hoy = LocalDate.now();
        boolean esFechaPasada = fecha.isBefore(hoy);
        boolean esFranjaPasadaDeHoy = fecha.equals(hoy) && franja.horaInicio() <= LocalTime.now().getHour();
        if(esFechaPasada || esFranjaPasadaDeHoy){
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "No puedes reservar en una fecha u hora que ya pasó"
            );
        }
    }
    public void validarFranjaLibre(UUID espacioId, LocalDate fecha, FranjaHoraria franja){
        if(repositorioReserva.existsByEspacioIdAndFechaAndFranja(espacioId, fecha, franja)){
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Esa franja ya está reservada, elige otra"
            );
        }
    }

}
