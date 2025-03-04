package com.espe.usuarios.model.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@DiscriminatorValue("CLIENTE")
@Table(name = "Clientes")
public class Cliente extends Usuario {

    @Column(nullable = false)
    private String direccion;

}
