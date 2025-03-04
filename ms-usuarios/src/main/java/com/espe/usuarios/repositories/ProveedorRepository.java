package com.espe.usuarios.repositories;

import com.espe.usuarios.model.entities.Proveedor;
import org.springframework.data.repository.CrudRepository;

public interface ProveedorRepository  extends CrudRepository<Proveedor, Long> {
}
