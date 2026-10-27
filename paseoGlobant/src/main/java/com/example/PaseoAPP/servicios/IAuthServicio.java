package com.example.PaseoAPP.servicios;

import com.example.PaseoAPP.dtos.LoginRespuestaDTO;
import com.example.PaseoAPP.dtos.LoginSolicitudDTO;

public interface IAuthServicio {

    LoginRespuestaDTO iniciarSesion(LoginSolicitudDTO datos);

}
