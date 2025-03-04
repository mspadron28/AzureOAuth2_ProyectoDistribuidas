package com.espe.services.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.expression.WebExpressionAuthorizationManager;

@Configuration
public class SecurityConfig {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.GET, "/api/servicios/**").hasAuthority("SCOPE_read")
                        .requestMatchers(HttpMethod.POST, "/api/servicios/**").hasAuthority("SCOPE_write")
                        .requestMatchers(HttpMethod.PUT, "/api/servicios/**").hasAuthority("SCOPE_write")

                        .requestMatchers(HttpMethod.GET, "/api/reservas/**").hasAuthority("SCOPE_read")
                        .requestMatchers(HttpMethod.POST, "/api/reservas/**").hasAuthority("SCOPE_write")
                        .requestMatchers(HttpMethod.PUT, "/api/reservas/**").hasAuthority("SCOPE_write")

                        .anyRequest().authenticated()
                )
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()));

        return http.build();
    }

}
