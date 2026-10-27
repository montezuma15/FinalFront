package com.example.PaseoAPP.repositorios;

import com.example.PaseoAPP.enums.FranjaHoraria;
import com.example.PaseoAPP.modelos.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface IRepositorioReserva extends JpaRepository<Reserva, UUID> {

    boolean existsByEspacioIdAndFechaAndFranja(UUID espacioId, LocalDate fecha, FranjaHoraria franja);
    boolean existsByEspacioId(UUID espacioId);

    List<Reserva> findByUsuarioId(UUID usuarioId);
    List<Reserva> findByEspacioIdAndFecha(UUID espacioId, LocalDate fecha);

    void deleteByUsuarioId(UUID usuarioId);

}
