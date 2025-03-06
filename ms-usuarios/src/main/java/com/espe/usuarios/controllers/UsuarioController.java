package com.espe.usuarios.controllers;

import com.espe.usuarios.model.entities.Usuario;
import com.espe.usuarios.model.entities.UsuarioDTO;
import com.espe.usuarios.services.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("api/usuarios")
@CrossOrigin(origins = "http://172.191.30.75:3000") // 🔥 Permitir solicitudes desde el frontend
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;


    @GetMapping
    public List<UsuarioDTO> getAllUsuarios() {
        List<Usuario> usuarios = usuarioService.findAll();
        return usuarios.stream()
                .map(usuario -> new UsuarioDTO(usuario.getEmail(), usuario.getPassword(), usuario.getTipoUsuario(),usuario.getId()))
                .collect(Collectors.toList());
    }

    @GetMapping("/buscar")
    public ResponseEntity<UsuarioDTO> getUsuarioByEmail(@RequestParam String email) {
        Optional<Usuario> usuarioOptional = usuarioService.findByEmail(email);

        return usuarioOptional
                .map(usuario -> ResponseEntity.ok(new UsuarioDTO(usuario.getEmail(), usuario.getPassword(), usuario.getTipoUsuario(),usuario.getId())))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }


}
