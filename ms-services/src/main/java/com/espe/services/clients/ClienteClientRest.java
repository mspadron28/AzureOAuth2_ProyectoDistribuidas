package com.espe.services.clients;

import com.espe.services.model.entities.Cliente;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(name = "ms-usuarios",contextId = "clienteClient", url = "${CLIENTE_URL}")
public interface ClienteClientRest {

    @GetMapping
    List<Cliente> listarClientes();

    @GetMapping("/{id}")
    Cliente findClienteById(@PathVariable("id") Long id);

    @PostMapping
    Cliente crearCliente(@RequestBody Cliente cliente);

    @DeleteMapping("/{id}")
    void eliminarCliente(@PathVariable("id") Long id);
}


