package com.espe.usuarios.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests((authHttp) -> authHttp
                        // 🚀 Permitir acceso público a los endpoints necesarios
                        .requestMatchers(HttpMethod.GET, "/api/usuarios/**").permitAll()


                        // 🔐 Proteger los demás endpoints con JWT y scopes
                        .requestMatchers(HttpMethod.GET, "/api/clientes/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/clientes").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/api/clientes/{id}").hasAuthority("SCOPE_write")
                        .requestMatchers(HttpMethod.DELETE, "/api/clientes/{id}").hasAuthority("SCOPE_write")


                        .requestMatchers(HttpMethod.GET, "/api/proveedores/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/proveedores").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/api/proveedores/{id}").permitAll()
                        .requestMatchers(HttpMethod.DELETE, "/api/proveedores/{id}").permitAll()

                        .anyRequest().authenticated()
                )
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // 🔥 Aplica OAuth2 solo a los endpoints protegidos, no a `/api/usuarios/buscar`
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(Customizer.withDefaults())
                        /*
                        .authenticationEntryPoint((request, response, authException) -> {
                            if (request.getRequestURI().startsWith("/api/usuarios/buscar")) {
                                response.setStatus(200); // Permitir acceso sin autenticación
                            } else {
                                response.sendError(401, "Unauthorized");
                            }
                        })

                         */
                );
        return http.build();
    }
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
