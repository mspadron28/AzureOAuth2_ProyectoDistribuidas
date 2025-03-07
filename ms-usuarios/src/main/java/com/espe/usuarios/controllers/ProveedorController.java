package com.espe.usuarios.controllers;

import com.espe.usuarios.model.entities.Proveedor;
import com.espe.usuarios.services.ProveedorService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("api/proveedores")
@CrossOrigin(origins = "http://localhost:3000") // 🔥 Permitir solicitudes desde el frontend
public class ProveedorController {

    @Autowired
    private ProveedorService service;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping
    public ResponseEntity<?> crear(@Valid @RequestBody Proveedor proveedor, BindingResult result) {
        if (result.hasErrors()) {
            Map<String, String> errores = new HashMap<>();
            result.getFieldErrors().forEach(
                    err -> errores.put(
                            err.getField(), err.getDefaultMessage()
                    )
            );
            return ResponseEntity.badRequest().body(errores);
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(service.save(proveedor));
    }

    @GetMapping
    public List<Proveedor> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Proveedor> getById(@PathVariable Long id) {
        Optional<Proveedor> proveedorOptional = service.findById(id);
        if (proveedorOptional.isPresent()) {
            return ResponseEntity.ok(proveedorOptional.get());
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @Valid @RequestBody Proveedor proveedor, BindingResult result) {
        if (result.hasErrors()) {
            Map<String, String> errores = new HashMap<>();
            result.getFieldErrors().forEach(
                    err -> errores.put(
                            err.getField(), err.getDefaultMessage()
                    )
            );
            return ResponseEntity.badRequest().body(errores);
        }
        Optional<Proveedor> proveedorOptional = service.findById(id);
        if (proveedorOptional.isPresent()) {
            Proveedor proveedorDB = proveedorOptional.get();
            proveedorDB.setNombre(proveedor.getNombre());
            proveedorDB.setApellido(proveedor.getApellido());
            proveedorDB.setEmail(proveedor.getEmail());
            proveedorDB.setTelefono(proveedor.getTelefono());
            proveedorDB.setFechaNacimiento(proveedor.getFechaNacimiento());
            proveedorDB.setEmpresa(proveedor.getEmpresa());
            // Si el usuario envía una nueva contraseña, la hasheamos antes de guardarla
            if (proveedorDB.getPassword() != null && !proveedorDB.getPassword().isEmpty()) {
                proveedorDB.setPassword(passwordEncoder.encode(proveedorDB.getPassword()));
            }

            return ResponseEntity.status(HttpStatus.CREATED).body(service.save(proveedorDB));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
