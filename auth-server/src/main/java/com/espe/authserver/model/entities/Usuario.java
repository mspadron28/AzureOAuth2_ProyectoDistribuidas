package com.espe.authserver.model.entities;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter

public abstract class Usuario {

    private Long id;
    private String nombre;
    private String apellido;
    private String email;
    private String password;
    private String telefono;
    private Date fechaNacimiento;
    private String tipoUsuario;
    private Date creadoEn;



}
