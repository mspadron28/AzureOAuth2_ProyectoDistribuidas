package com.espe.services.repositories;

import com.espe.services.model.entities.Servicio;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServicioRepository extends CrudRepository<Servicio, Long> {
    List<Servicio> findByProveedorId(Long proveedorId);
}
