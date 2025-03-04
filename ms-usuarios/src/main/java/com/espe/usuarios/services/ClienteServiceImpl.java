package com.espe.usuarios.services;

import com.espe.usuarios.model.entities.Cliente;
import com.espe.usuarios.repositories.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClienteServiceImpl implements ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public List<Cliente> findAll() {
        return (List<Cliente>) clienteRepository.findAll();
    }

    @Override
    public Optional<Cliente> findById(Long id) {
        return clienteRepository.findById(id);
    }

    @Override
    public Cliente save(Cliente cliente) {
        // Hashear la contraseña solo si es nueva o ha cambiado
        if (cliente.getPassword() != null) {
            cliente.setPassword(passwordEncoder.encode(cliente.getPassword()));
        }
        return clienteRepository.save(cliente);
    }
    @Override
    public void deleteById(Long id) {
        clienteRepository.deleteById(id);
    }
}
