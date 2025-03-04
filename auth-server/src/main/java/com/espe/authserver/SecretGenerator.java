package com.espe.authserver;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class SecretGenerator {
    public static void main(String[] args) {
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

        // Generar un nuevo secreto
        String rawSecret = "rootroot";  // Cambia esto por tu contraseña deseada
        String encodedSecret = passwordEncoder.encode(rawSecret);

        // Imprimir el secreto encriptado
        System.out.println("Secreto encriptado (BCrypt): " + encodedSecret);
    }
}
