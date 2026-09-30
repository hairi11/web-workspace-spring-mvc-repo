package com.company.web.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.view.InternalResourceViewResolver;

import com.company.web.common.rest.OAuthClientCredentialsSettings;

@Configuration
@EnableWebMvc
@PropertySource(
        "classpath:application-${app.env:local}.properties")
@ComponentScan(basePackages = {
        "com.company.web.controller",
        "com.company.web.fx",
        "com.company.web.fc"
})
public class WebMvcConfig
        implements WebMvcConfigurer {

    @Bean
    public OAuthClientCredentialsSettings
            oauthClientCredentialsSettings(
                    Environment environment) {
        return OAuthClientCredentialsSettings
                .fromEnvironment(
                        environment,
                        "web.oauth");
    }

    @Bean
    public ViewResolver viewResolver() {
        InternalResourceViewResolver resolver =
                new InternalResourceViewResolver();

        resolver.setPrefix(
                "/WEB-INF/views/");
        resolver.setSuffix(
                ".jsp");

        return resolver;
    }

    @Override
    public void addResourceHandlers(
            ResourceHandlerRegistry registry) {
        registry.addResourceHandler(
                        "/assets/**")
                .addResourceLocations(
                        "/assets/");

        registry.addResourceHandler(
                        "/webfonts/**")
                .addResourceLocations(
                        "/webfonts/");

        registry.addResourceHandler(
                        "/fx/**")
                .addResourceLocations(
                        "/fx/");

        registry.addResourceHandler(
                        "/fc/**")
                .addResourceLocations(
                        "/fc/");
    }
}
