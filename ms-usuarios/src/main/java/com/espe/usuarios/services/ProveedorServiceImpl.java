package com.espe.usuarios.services;

import com.espe.usuarios.model.entities.Proveedor;
import com.espe.usuarios.repositories.ProveedorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProveedorServiceImpl implements ProveedorService {

    @Autowired
    private ProveedorRepository proveedorRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public List<Proveedor> findAll() {
        return (List<Proveedor>) proveedorRepository.findAll();
    }

    @Override
    public Optional<Proveedor> findById(Long id) {
        return proveedorRepository.findById(id);
    }

    @Override
    public Proveedor save(Proveedor proveedor) {

        if (proveedor.getPassword() != null) {
            proveedor.setPassword(passwordEncoder.encode(proveedor.getPassword()));
        }
        return proveedorRepository.save(proveedor);
    }

    @Override
    public void deleteById(Long id) {
        proveedorRepository.deleteById(id);
    }
}
