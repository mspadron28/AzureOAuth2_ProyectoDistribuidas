package com.espe.authserver.clients;


import com.espe.authserver.model.entities.UsuarioDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "ms-usuarios", contextId = "usuarioClient", url = "http://localhost:8003/api/usuarios")
public interface ClienteClientRest {

    @GetMapping("/buscar")
    UsuarioDTO getUsuarioByEmail(@RequestParam String email);
}