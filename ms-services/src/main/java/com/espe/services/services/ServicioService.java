package com.espe.services.services;

import com.espe.services.model.entities.Servicio;
import com.espe.services.model.entities.Proveedor;

import java.util.List;
import java.util.Optional;

public interface ServicioService {

    // Obtener todos los servicios
    List<Servicio> findAll();

    // Obtener servicio por ID
    Optional<Servicio> findById(Long id);

    // Eliminar un servicio
    void deleteById(Long id);

    // Agregar un servicio con el proveedorId
    Optional<Servicio> addServicio(Servicio servicio, Long proveedorId);

    // Modificar un servicio
    Optional<Servicio> updateServicio(Long id, Servicio servicio);

    // Obtener servicios por proveedorId
    List<Servicio> findByProveedorId(Long proveedorId);
}
