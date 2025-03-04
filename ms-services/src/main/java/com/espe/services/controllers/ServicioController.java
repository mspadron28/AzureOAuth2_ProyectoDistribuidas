package com.espe.services.controllers;

import com.espe.services.model.entities.Servicio;
import com.espe.services.services.ServicioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/servicios")
public class ServicioController {

    @Autowired
    private ServicioService servicioService;

    // Endpoint para agregar un nuevo servicio con proveedorId
    @PostMapping("/{proveedorId}")
    public Optional<Servicio> addServicio(@RequestBody Servicio servicio, @PathVariable Long proveedorId) {
        // Llamamos al servicio para crear el servicio con el proveedorId proporcionado
        return servicioService.addServicio(servicio, proveedorId);
    }

    // Endpoint para obtener todos los servicios
    @GetMapping
    public List<Servicio> getAllServicios() {
        return servicioService.findAll();
    }

    // Endpoint para obtener un servicio por su ID
    @GetMapping("/{id}")
    public Optional<Servicio> getServicioById(@PathVariable Long id) {
        return servicioService.findById(id);
    }

    // Endpoint para eliminar un servicio por su ID
    @DeleteMapping("/{id}")
    public void deleteServicio(@PathVariable Long id) {
        servicioService.deleteById(id);
    }

    // Modificar un servicio
    @PutMapping("/{id}")
    public Optional<Servicio> updateServicio(@PathVariable Long id, @RequestBody Servicio servicio) {
        return servicioService.updateServicio(id, servicio);
    }

    // Obtener servicios de un proveedor
    @GetMapping("/proveedor/{proveedorId}")
    public List<Servicio> getServiciosByProveedorId(@PathVariable Long proveedorId) {
        return servicioService.findByProveedorId(proveedorId);
    }
}
