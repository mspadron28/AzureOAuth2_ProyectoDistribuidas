package com.espe.usuarios.model.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Entity
@Getter
@Setter
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "tipo_usuario", discriminatorType = DiscriminatorType.STRING)
@Table(name = "Usuarios")
public abstract class Usuario {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @NotBlank(message = "El nombre es obligatorio")
        @Column(nullable = false)
        private String nombre;

        @NotBlank(message = "El apellido es obligatorio")
        @Column(nullable = false)
        private String apellido;

        @Email(message = "Debe ser un correo válido")
        @NotBlank(message = "El email es obligatorio")
        @Column(nullable = false, unique = true)
        private String email;

        @NotBlank(message = "La contraseña es obligatoria")
        @Size(min = 6, message = "La contraseña debe tener al menos 6 caracteres")
        private String password;

        @Size(min = 10, max = 10, message = "El teléfono debe tener exactamente 10 dígitos")
        @Column(length = 10, nullable = false)
        private String telefono;

        @NotNull(message = "La fecha de nacimiento no puede ser nula")
        @Past(message = "La fecha de nacimiento debe estar en el pasado")
        @Temporal(TemporalType.DATE)
        @Column(nullable = false)
        private Date fechaNacimiento;

        @Column(name = "tipo_usuario", insertable = false, updatable = false)
        private String tipoUsuario; // Cliente o Proveedor

        @Temporal(TemporalType.TIMESTAMP)
        @Column(nullable = false, updatable = false)
        private Date creadoEn;

        @PrePersist
        protected void onCreate() {
            this.creadoEn = new Date();
        }


}
