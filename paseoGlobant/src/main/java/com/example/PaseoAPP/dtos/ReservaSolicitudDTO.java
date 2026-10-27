package com.example.PaseoAPP.dtos;

import com.example.PaseoAPP.enums.FranjaHoraria;

import java.time.LocalDate;
import java.util.UUID;

//Lo que el front envia para reservar.
//El usuario NO viene aqui: se toma del token
public record ReservaSolicitudDTO(
        UUID espacioId,
        LocalDate fecha,
        FranjaHoraria franja
) {}
