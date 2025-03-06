package com.espe.usuarios.model.entities;

import jakarta.persistence.*;


@Entity
@DiscriminatorValue("CLIENTE")
@Table(name = "Clientes")
public class Cliente extends Usuario {

    @Column(nullable = false)
    private String direccion;

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }
}
