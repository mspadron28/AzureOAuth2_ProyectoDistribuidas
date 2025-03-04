package com.espe.services.controllers;

import com.espe.services.model.entities.EstadoReserva;
import com.espe.services.model.entities.Reserva;
import com.espe.services.services.ReservaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/reservas")
public class ReservaController {

    @Autowired
    private ReservaService reservaService;

    // Endpoint para agregar una reserva con clienteId y servicioId
    @PostMapping("/{clienteId}/{servicioId}")
    public Optional<Reserva> addReserva(@PathVariable Long clienteId, @PathVariable Long servicioId, @RequestBody Reserva reserva) {
        return reservaService.addReserva(clienteId, servicioId, reserva);
    }

    // Endpoint para obtener todas las reservas
    @GetMapping
    public List<Reserva> getAllReservas() {
        return reservaService.findAll();
    }

    // Endpoint para obtener una reserva por su ID
    @GetMapping("/{id}")
    public Optional<Reserva> getReservaById(@PathVariable Long id) {
        return reservaService.findById(id);
    }

    // Obtener reservas de un cliente
    @GetMapping("/cliente/{clienteId}")
    public List<Reserva> getReservasByClienteId(@PathVariable Long clienteId) {
        return reservaService.findByClienteId(clienteId);
    }

    // Cambiar estado de una reserva
    @PutMapping("/{id}/estado/{estado}")
    public Optional<Reserva> updateEstadoReserva(@PathVariable Long id, @PathVariable EstadoReserva estado) {
        return reservaService.updateEstadoReserva(id, estado);
    }

    // Endpoint para eliminar una reserva por su ID
    @DeleteMapping("/{id}")
    public void deleteReserva(@PathVariable Long id) {
        reservaService.deleteById(id);
    }



}
