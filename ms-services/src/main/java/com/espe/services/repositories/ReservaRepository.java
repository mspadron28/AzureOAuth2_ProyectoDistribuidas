package com.espe.services.repositories;

import com.espe.services.model.entities.Reserva;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReservaRepository extends CrudRepository<Reserva, Long> {
    List<Reserva> findByClienteId(Long clienteId);
}
