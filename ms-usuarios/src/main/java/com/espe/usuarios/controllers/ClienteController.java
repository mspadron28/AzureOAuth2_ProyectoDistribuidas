package com.espe.usuarios.controllers;

import com.espe.usuarios.model.entities.Cliente;
import com.espe.usuarios.services.ClienteService;
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
@RequestMapping("api/clientes")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true") // 🔥 Permitir Next.js
public class ClienteController {

    @Autowired
    private ClienteService service;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping
    public ResponseEntity<?> crear(@Valid @RequestBody Cliente cliente, BindingResult result) {
        if (result.hasErrors()) {
            Map<String, String> errores = new HashMap<>();
            result.getFieldErrors().forEach(
                    err -> errores.put(
                            err.getField(), err.getDefaultMessage()
                    )
            );
            return ResponseEntity.badRequest().body(errores);
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(service.save(cliente));
    }

    @GetMapping
    public List<Cliente> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cliente> getById(@PathVariable Long id) {
        Optional<Cliente> clienteOptional = service.findById(id);
        if (clienteOptional.isPresent()) {
            return ResponseEntity.ok(clienteOptional.get());
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @Valid @RequestBody Cliente cliente, BindingResult result) {
        if (result.hasErrors()) {
            Map<String, String> errores = new HashMap<>();
            result.getFieldErrors().forEach(
                    err -> errores.put(
                            err.getField(), err.getDefaultMessage()
                    )
            );
            return ResponseEntity.badRequest().body(errores);
        }
        Optional<Cliente> clienteOptional = service.findById(id);
        if (clienteOptional.isPresent()) {
            Cliente clienteDB = clienteOptional.get();
            clienteDB.setNombre(cliente.getNombre());
            clienteDB.setApellido(cliente.getApellido());
            clienteDB.setEmail(cliente.getEmail());
            clienteDB.setTelefono(cliente.getTelefono());
            clienteDB.setFechaNacimiento(cliente.getFechaNacimiento());
            clienteDB.setDireccion(cliente.getDireccion());

            // Si el usuario envía una nueva contraseña, la hasheamos antes de guardarla
            if (cliente.getPassword() != null && !cliente.getPassword().isEmpty()) {
                clienteDB.setPassword(passwordEncoder.encode(cliente.getPassword()));
            }

            return ResponseEntity.status(HttpStatus.CREATED).body(service.save(clienteDB));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}