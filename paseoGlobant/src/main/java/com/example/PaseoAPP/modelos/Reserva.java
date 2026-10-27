package com.example.PaseoAPP.modelos;

import com.example.PaseoAPP.enums.FranjaHoraria;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(
        name = "reservas",
        //un espacio no se puede reservar dos veces en la misma fecha y franja
        uniqueConstraints = @UniqueConstraint(columnNames = {"espacio_id", "fecha", "franja"})
)
public class Reserva {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private LocalDate fecha;
    @Enumerated(EnumType.STRING)
    private FranjaHoraria franja;

    @ManyToOne(optional = false)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @ManyToOne(optional = false)
    @JoinColumn(name = "espacio_id")
    private Espacio espacio;

    public Reserva() {
    }
    public Reserva(UUID id, LocalDate fecha, FranjaHoraria franja, Usuario usuario, Espacio espacio) {
        this.id = id;
        this.fecha = fecha;
        this.franja = franja;
        this.usuario = usuario;
        this.espacio = espacio;
    }
    public UUID getId() {
        return id;
    }
    public void setId(UUID id) {
        this.id = id;
    }
    public LocalDate getFecha() {
        return fecha;
    }
    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }
    public FranjaHoraria getFranja() {
        return franja;
    }
    public void setFranja(FranjaHoraria franja) {
        this.franja = franja;
    }
    public Usuario getUsuario() {
        return usuario;
    }
    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
    public Espacio getEspacio() {
        return espacio;
    }
    public void setEspacio(Espacio espacio) {
        this.espacio = espacio;
    }


}
