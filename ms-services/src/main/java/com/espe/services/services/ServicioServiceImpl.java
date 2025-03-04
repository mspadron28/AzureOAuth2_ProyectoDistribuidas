package com.espe.services.services;

import com.espe.services.clients.ProveedorClientRest;
import com.espe.services.model.entities.Servicio;
import com.espe.services.model.entities.Proveedor;
import com.espe.services.repositories.ServicioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ServicioServiceImpl implements ServicioService {

    @Autowired
    private ServicioRepository servicioRepository;

    @Autowired
    private ProveedorClientRest proveedorClientRest;

    // Obtener todos los servicios
    @Override
    public List<Servicio> findAll() {
        return (List<Servicio>) servicioRepository.findAll();
    }

    // Obtener servicio por ID
    @Override
    public Optional<Servicio> findById(Long id) {
        return servicioRepository.findById(id);
    }


    // Eliminar un servicio
    @Override
    public void deleteById(Long id) {
        servicioRepository.deleteById(id);
    }

    // Agregar un servicio con el proveedorId
    @Override
    public Optional<Servicio> addServicio(Servicio servicio, Long proveedorId) {
        // Llamamos al microservicio de proveedores para obtener el proveedor
        Proveedor proveedor = proveedorClientRest.findProveedorById(proveedorId);

        // Verificamos si el proveedor existe
        if (proveedor != null) {
            servicio.setProveedorId(proveedor.getId()); // Establecer el ID del proveedor en el servicio

            // Guardamos el servicio con el proveedorId
            return Optional.of(servicioRepository.save(servicio));
        }

        return Optional.empty(); // Si el proveedor no existe
    }
    // Modificar un servicio
    @Override
    public Optional<Servicio> updateServicio(Long id, Servicio servicio) {
        return servicioRepository.findById(id).map(servicioExistente -> {
            servicioExistente.setNombre(servicio.getNombre());
            servicioExistente.setDescripcion(servicio.getDescripcion());
            servicioExistente.setPrecio(servicio.getPrecio());
            return servicioRepository.save(servicioExistente);
        });
    }

    // Obtener servicios por proveedorId
    @Override
    public List<Servicio> findByProveedorId(Long proveedorId) {
        return servicioRepository.findByProveedorId(proveedorId);
    }
}
