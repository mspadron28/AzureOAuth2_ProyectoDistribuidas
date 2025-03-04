package com.espe.usuarios.services;

import com.espe.usuarios.model.entities.Cliente;

import java.util.List;
import java.util.Optional;

public interface ClienteService {

    List<Cliente> findAll();

    Optional<Cliente> findById(Long id);

    Cliente save(Cliente cliente);

    void deleteById(Long id);
}
