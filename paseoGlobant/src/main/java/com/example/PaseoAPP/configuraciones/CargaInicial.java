package com.example.PaseoAPP.configuraciones;

import com.example.PaseoAPP.modelos.Espacio;
import com.example.PaseoAPP.repositorios.IRepositorioEspacio;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

//Si la BD no tiene espacios, crea los de ejemplo para que la app no arranque vacia
@Component
public class CargaInicial implements CommandLineRunner {

    private final IRepositorioEspacio repositorioEspacio;

    public CargaInicial(IRepositorioEspacio repositorioEspacio) {
        this.repositorioEspacio = repositorioEspacio;
    }

    @Override
    public void run(String... args) {
        if (this.repositorioEspacio.count() > 0) {
            return;
        }
        this.repositorioEspacio.saveAll(List.of(
                new Espacio(null, "Piscina", "Zona húmeda con piscina para niños y adultos",
                        "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=1200&q=80", 40),
                new Espacio(null, "Salón social", "Espacio para celebraciones, reuniones y eventos familiares",
                        "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=80", 80),
                new Espacio(null, "Gimnasio", "Equipos de cardio y fuerza para tu salud",
                        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80", 10),
                new Espacio(null, "Zona BBQ", "Asadores y mesas al aire libre para tus encuentros",
                        "https://plus.unsplash.com/premium_photo-1693221705288-7a2531eaa5e5?w=1200&q=80", 60),
                new Espacio(null, "Cancha múltiple", "Cancha para microfútbol y baloncesto",
                        "https://plus.unsplash.com/premium_photo-1724155541930-7cde0213dcc9?w=1200&q=80", 25)
        ));
    }
}
