package com.espe.services.services;

import com.espe.services.model.entities.EstadoReserva;
import com.espe.services.model.entities.Reserva;
import java.util.List;
import java.util.Optional;

public interface ReservaService {

    // Obtener todas las reservas
    List<Reserva> findAll();

    // Obtener reserva por ID
    Optional<Reserva> findById(Long id);

    // Eliminar una reserva por ID
    void deleteById(Long id);

    // Agregar una reserva con el clienteId y servicioId
    Optional<Reserva> addReserva(Long clienteId, Long servicioId, Reserva reserva);

    // Obtener reservas por clienteId
    List<Reserva> findByClienteId(Long clienteId);

    // Cambiar estado de una reserva
    Optional<Reserva> updateEstadoReserva(Long id, EstadoReserva estado);
}
