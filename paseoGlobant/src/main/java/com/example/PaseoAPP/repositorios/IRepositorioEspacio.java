package com.example.PaseoAPP.repositorios;

import com.example.PaseoAPP.modelos.Espacio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface IRepositorioEspacio extends JpaRepository<Espacio, UUID> {

    Optional<Espacio> findByNombre(String nombre);

}
