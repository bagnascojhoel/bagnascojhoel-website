package br.com.bagnascojhoel.portfolio_website_bff;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

@Configuration
@ConditionalOnProperty(value = "project.scheduling.enabled", havingValue = "true")
@EnableScheduling
public class SchedulingConfiguration {
}
