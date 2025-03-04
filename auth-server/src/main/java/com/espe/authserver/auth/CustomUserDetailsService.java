package com.espe.authserver.auth;



import com.espe.authserver.clients.ClienteClientRest;
import com.espe.authserver.model.entities.UsuarioDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private ClienteClientRest clienteClientRest;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UsuarioDTO usuario = clienteClientRest.getUsuarioByEmail(username);

        if (usuario == null) {
            throw new UsernameNotFoundException("Usuario no encontrado");
        }

        return User.builder()
                .username(usuario.email())
                .password(usuario.password())
                .roles(usuario.tipoUsuario().toUpperCase())
                .build();
    }
}
