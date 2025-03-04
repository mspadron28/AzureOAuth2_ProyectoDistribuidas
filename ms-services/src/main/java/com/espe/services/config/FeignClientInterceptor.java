package com.espe.services.config;

import feign.RequestInterceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.client.*;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.DefaultOAuth2AuthorizedClientManager;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizedClientRepository;
import org.springframework.security.oauth2.core.OAuth2AccessToken;

import java.util.Objects;

@Configuration
public class FeignClientInterceptor {

    private final OAuth2AuthorizedClientManager authorizedClientManager;

    public FeignClientInterceptor(ClientRegistrationRepository clientRegistrationRepository,
                                  OAuth2AuthorizedClientService authorizedClientService,
                                  OAuth2AuthorizedClientRepository authorizedClientRepository) {
        this.authorizedClientManager = createAuthorizedClientManager(clientRegistrationRepository, authorizedClientService, authorizedClientRepository);
    }

    @Bean
    public RequestInterceptor requestInterceptor() {
        return requestTemplate -> {
            String token = getAccessToken();
            System.out.println("🔐 Token usado por ms-services: " + token);
            requestTemplate.header("Authorization", "Bearer " + token);
        };
    }

    private String getAccessToken() {
        OAuth2AuthorizeRequest authorizeRequest = OAuth2AuthorizeRequest.withClientRegistrationId("ms-services")
                .principal("ms-services")
                .build();

        OAuth2AuthorizedClient authorizedClient = authorizedClientManager.authorize(authorizeRequest);

        Objects.requireNonNull(authorizedClient, "No se pudo obtener un token de acceso");
        OAuth2AccessToken accessToken = authorizedClient.getAccessToken();
        Objects.requireNonNull(accessToken, "No se pudo obtener un token de acceso");

        return accessToken.getTokenValue();
    }

    private OAuth2AuthorizedClientManager createAuthorizedClientManager(
            ClientRegistrationRepository clientRegistrationRepository,
            OAuth2AuthorizedClientService authorizedClientService,
            OAuth2AuthorizedClientRepository authorizedClientRepository) {

        OAuth2AuthorizedClientProvider authorizedClientProvider = OAuth2AuthorizedClientProviderBuilder.builder()
                .clientCredentials()
                .build();

        DefaultOAuth2AuthorizedClientManager authorizedClientManager = new DefaultOAuth2AuthorizedClientManager(
                clientRegistrationRepository, authorizedClientRepository);
        authorizedClientManager.setAuthorizedClientProvider(authorizedClientProvider);

        return authorizedClientManager;
    }
}
