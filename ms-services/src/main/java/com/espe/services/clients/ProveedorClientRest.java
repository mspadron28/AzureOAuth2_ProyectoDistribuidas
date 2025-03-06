package com.espe.services.clients;

import com.espe.services.model.entities.Proveedor;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(name = "ms-usuarios",contextId = "proveedorClient", url ="${PROVEEDOR_URL}")
public interface ProveedorClientRest {

    @GetMapping
    List<Proveedor> listarProveedores();

    @GetMapping("/{id}")
    Proveedor findProveedorById(@PathVariable("id") Long id);

    @PostMapping
    Proveedor crearProveedor(@RequestBody Proveedor proveedor);

    @DeleteMapping("/{id}")
    void eliminarProveedor(@PathVariable("id") Long id);
}
