package com.espe.services.services;

import com.espe.services.clients.ClienteClientRest;
import com.espe.services.model.entities.EstadoReserva;
import com.espe.services.model.entities.Reserva;
import com.espe.services.model.entities.Cliente;
import com.espe.services.model.entities.Servicio;
import com.espe.services.repositories.ReservaRepository;
import com.espe.services.repositories.ServicioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReservaServiceImpl implements ReservaService {

    @Autowired
    private ReservaRepository reservaRepository;

    @Autowired
    private ServicioRepository servicioRepository;

    @Autowired
    private ClienteClientRest clienteClientRest;

    // Obtener todas las reservas
    @Override
    public List<Reserva> findAll() {
        return (List<Reserva>) reservaRepository.findAll();
    }

    // Obtener reserva por ID
    @Override
    public Optional<Reserva> findById(Long id) {
        return reservaRepository.findById(id);
    }

    // Eliminar una reserva por ID
    @Override
    public void deleteById(Long id) {
        reservaRepository.deleteById(id);
    }

    // Agregar una reserva con clienteId y servicioId
    @Override
    public Optional<Reserva> addReserva(Long clienteId, Long servicioId, Reserva reserva) {
        // Validamos si el cliente existe llamando al microservicio de usuarios
        Cliente cliente = clienteClientRest.findClienteById(clienteId);
        if (cliente == null) {
            return Optional.empty(); // Cliente no encontrado
        }

        // Validamos si el servicio existe en la base de datos
        Optional<Servicio> servicioOpt = servicioRepository.findById(servicioId);
        if (servicioOpt.isEmpty()) {
            return Optional.empty(); // Servicio no encontrado
        }

        // Asociamos la reserva con el cliente y servicio
        reserva.setClienteId(cliente.getId());
        reserva.setServicio(servicioOpt.get());
        reserva.setEstado(EstadoReserva.PENDIENTE); // Siempre inicia como PENDIENTE

        // Guardamos la reserva y la retornamos
        return Optional.of(reservaRepository.save(reserva));
    }

    // Obtener reservas por clienteId
    @Override
    public List<Reserva> findByClienteId(Long clienteId) {
        return reservaRepository.findByClienteId(clienteId);
    }

    @Override
    public Optional<Reserva> updateEstadoReserva(Long id, EstadoReserva estado) {
        return reservaRepository.findById(id).map(reserva -> {
            reserva.setEstado(estado);
            return reservaRepository.save(reserva);
        });
    }
}
