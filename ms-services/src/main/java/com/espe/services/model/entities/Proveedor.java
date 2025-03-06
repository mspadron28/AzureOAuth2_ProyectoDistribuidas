package com.espe.services.model.entities;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Proveedor {
    private Long id;
    private String nombre;
    private String apellido;
    private String email;
    private String password;
    private String telefono;
    private String empresa;

    public Long getId() {
        return id;
    }
}
