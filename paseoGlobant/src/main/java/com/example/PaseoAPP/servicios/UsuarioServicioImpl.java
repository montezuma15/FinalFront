package com.example.PaseoAPP.servicios;

import com.example.PaseoAPP.dtos.UsuarioDTO;
import com.example.PaseoAPP.mapeadores.IMapaUsuario;
import com.example.PaseoAPP.modelos.Usuario;
import com.example.PaseoAPP.repositorios.IRepositorioReserva;
import com.example.PaseoAPP.repositorios.IRepositorioUsuario;
import com.example.PaseoAPP.validadores.IValidadorUsuario;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UsuarioServicioImpl implements IUsuarioServicio {

    //1. Llamar a los helpers o dependencias que necesite
    private final IMapaUsuario mapaUsuario;
    private final IRepositorioUsuario repositorioUsuario;
    private final IRepositorioReserva repositorioReserva;

    private final IValidadorUsuario validadorUsuario;
    private final PasswordEncoder codificadorContraseña;


    public UsuarioServicioImpl(IMapaUsuario mapaUsuario, IRepositorioUsuario repositorioUsuario, IRepositorioReserva repositorioReserva, IValidadorUsuario validadorUsuario, PasswordEncoder codificadorContraseña) {
        this.mapaUsuario = mapaUsuario;
        this.repositorioUsuario = repositorioUsuario;
        this.repositorioReserva = repositorioReserva;
        this.validadorUsuario = validadorUsuario;
        this.codificadorContraseña = codificadorContraseña;
    }

    @Override
    public UsuarioDTO guardarUsuarioEnBD(Usuario datos) {

        this.validadorUsuario.validarNuevoUsuario(datos);

        //Nunca guardamos la contraseña en texto plano: se guarda su hash (BCrypt)
        datos.setContraseña(this.codificadorContraseña.encode(datos.getContraseña()));

        //Guardar los datos y convertir la respuesta en un DTO
        Usuario usuarioGuardado=this.repositorioUsuario.save(datos);
        return this.mapaUsuario.convertir_modelo_a_dto(usuarioGuardado);

    }

    @Override
    public UsuarioDTO modificarUsuarioEnBD(Usuario datos, UUID id) {

        //Buscando que el usuario exista en BD
        Optional<Usuario> usuarioQueEstoyBuscando=this.repositorioUsuario.findById(id);
        if(usuarioQueEstoyBuscando.isEmpty()){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,"usuario no encontrado");
        }
        //encontre el usuario
        Usuario usuarioQueEncontre=usuarioQueEstoyBuscando.get();


        //validando los datos con los que voy a editar
        this.validadorUsuario.validarDatosModificacion(datos);

        //Aplicar los cambios (el administrador puede cambiar nombre y rol)
        usuarioQueEncontre.setNombres(datos.getNombres());
        if(datos.getRol() != null){
            usuarioQueEncontre.setRol(datos.getRol());
        }
        Usuario usuarioModificado=this.repositorioUsuario.save(usuarioQueEncontre);

        //convierto la rspuesta a DTO
        return this.mapaUsuario.convertir_modelo_a_dto(usuarioModificado);


    }

    @Override
    public List<UsuarioDTO> buscarUsuariosEnBD() {

        List<Usuario> usuariosEncontrados=this.repositorioUsuario.findAll();
        return this.mapaUsuario.convertir_lista_de_modelo_a_lista_de_dto(usuariosEncontrados);

    }

    @Override
    public UsuarioDTO buscarUsuarioPorId(UUID id) {
        Usuario usuario=this.repositorioUsuario.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"usuario no encontrado"));
        return this.mapaUsuario.convertir_modelo_a_dto(usuario);
    }

    @Override
    @Transactional
    public void eliminarUsuarioEnBD(UUID id, UUID idUsuarioActual) {
        if(id.equals(idUsuarioActual)){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"No puedes eliminar tu propia cuenta");
        }
        Optional<Usuario> usuarioQueEstoyBuscando=this.repositorioUsuario.findById(id);
        if(usuarioQueEstoyBuscando.isEmpty()){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,"usuario no encontrado");
        }
        //primero sus reservas, para no dejar reservas sin dueño
        this.repositorioReserva.deleteByUsuarioId(id);
        this.repositorioUsuario.deleteById(id);

    }
}
