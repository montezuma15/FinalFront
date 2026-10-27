package com.example.PaseoAPP.dtos;

import java.util.UUID;

public record EspacioDTO(
        UUID id,
        String nombre,
        String descripcion,
        String foto,
        int aforo
) {}
