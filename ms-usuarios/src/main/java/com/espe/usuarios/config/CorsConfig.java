package com.espe.usuarios.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("*") // Permitir todos los orígenes
                        .allowedMethods("*") // Permitir todos los métodos HTTP
                        .allowedHeaders("*") // Permitir todos los encabezados
                        .exposedHeaders("*") // Exponer todos los encabezados
                        .allowCredentials(false); // Sin credenciales
            }
        };
    }
}
