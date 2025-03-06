package com.espe.usuarios.model.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;


import java.util.Date;

@Entity
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

        public Long getId() {
                return id;
        }

        public void setId(Long id) {
                this.id = id;
        }

        public String getApellido() {
                return apellido;
        }

        public void setApellido(String apellido) {
                this.apellido = apellido;
        }

        public String getNombre() {
                return nombre;
        }

        public void setNombre(String nombre) {
                this.nombre = nombre;
        }

        public String getPassword() {
                return password;
        }

        public void setPassword(String password) {
                this.password = password;
        }

        public String getEmail() {
                return email;
        }

        public void setEmail(String email) {
                this.email = email;
        }

        public String getTelefono() {
                return telefono;
        }

        public void setTelefono(String telefono) {
                this.telefono = telefono;
        }

        public Date getFechaNacimiento() {
                return fechaNacimiento;
        }

        public void setFechaNacimiento(Date fechaNacimiento) {
                this.fechaNacimiento = fechaNacimiento;
        }

        public String getTipoUsuario() {
                return tipoUsuario;
        }

        public void setTipoUsuario(String tipoUsuario) {
                this.tipoUsuario = tipoUsuario;
        }

        public Date getCreadoEn() {
                return creadoEn;
        }

        public void setCreadoEn(Date creadoEn) {
                this.creadoEn = creadoEn;
        }
}
