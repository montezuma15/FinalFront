package com.example.PaseoAPP.dtos;

import com.example.PaseoAPP.enums.FranjaHoraria;

import java.time.LocalDate;
import java.util.UUID;

public record ReservaDTO(
        UUID id,
        LocalDate fecha,
        FranjaHoraria franja,
        UUID espacioId,
        String espacioNombre,
        String espacioFoto,
        UUID usuarioId,
        String usuarioNombres
) {}
