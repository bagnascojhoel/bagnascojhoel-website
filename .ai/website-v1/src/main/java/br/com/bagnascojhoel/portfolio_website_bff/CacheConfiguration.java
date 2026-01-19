package br.com.bagnascojhoel.portfolio_website_bff;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConditionalOnProperty(value = "project.cache.enabled", havingValue = "true")
@EnableCaching
public class CacheConfiguration {
}
