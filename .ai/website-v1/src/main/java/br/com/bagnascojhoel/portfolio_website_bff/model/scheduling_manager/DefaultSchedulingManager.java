package br.com.bagnascojhoel.portfolio_website_bff.model.scheduling_manager;

import org.springframework.stereotype.Component;

@Component
public class DefaultSchedulingManager implements SchedulingManager {
    @Override
    public boolean canSetupProjectCache() {
        return true;
    }
}
