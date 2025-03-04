package com.espe.usuarios.model.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@DiscriminatorValue("PROVEEDOR")
@Table(name = "Proveedores")
public class Proveedor extends Usuario {

    @Column(nullable = false)
    private String empresa;

}