package com.espe.usuarios.model.entities;

import jakarta.persistence.*;

@Entity

@DiscriminatorValue("PROVEEDOR")
@Table(name = "Proveedores")
public class Proveedor extends Usuario {

    @Column(nullable = false)
    private String empresa;

    public String getEmpresa() {
        return empresa;
    }

    public void setEmpresa(String empresa) {
        this.empresa = empresa;
    }
}