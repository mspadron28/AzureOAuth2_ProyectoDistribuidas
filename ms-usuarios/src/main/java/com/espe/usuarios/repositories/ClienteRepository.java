package com.espe.usuarios.repositories;

import com.espe.usuarios.model.entities.Cliente;
import org.springframework.data.repository.CrudRepository;

public interface ClienteRepository extends CrudRepository<Cliente, Long> {

}
