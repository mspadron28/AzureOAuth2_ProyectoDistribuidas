package com.espe.usuarios.services;

import com.espe.usuarios.model.entities.Usuario;

import java.util.List;
import java.util.Optional;

public interface UsuarioService {
    List<Usuario> findAll();
    Optional<Usuario> findByEmail(String email);
}
