package com.example.PaseoAPP.servicios;

import com.example.PaseoAPP.dtos.UsuarioDTO;
import com.example.PaseoAPP.modelos.Usuario;

import java.util.List;
import java.util.UUID;

public interface IUsuarioServicio {

    //contrato que describe que se puede hacer en el servicio
    UsuarioDTO guardarUsuarioEnBD(Usuario datos);
    UsuarioDTO modificarUsuarioEnBD(Usuario datos, UUID id);
    List<UsuarioDTO> buscarUsuariosEnBD();
    UsuarioDTO buscarUsuarioPorId(UUID id);
    void eliminarUsuarioEnBD(UUID id, UUID idUsuarioActual);


}
