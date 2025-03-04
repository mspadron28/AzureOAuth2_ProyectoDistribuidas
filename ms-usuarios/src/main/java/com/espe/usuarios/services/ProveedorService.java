package com.espe.usuarios.services;

import com.espe.usuarios.model.entities.Proveedor;

import java.util.List;
import java.util.Optional;

public interface ProveedorService {
    List<Proveedor> findAll();

    Optional<Proveedor> findById(Long id);

    Proveedor save(Proveedor proveedor);

    void deleteById(Long id);
}
