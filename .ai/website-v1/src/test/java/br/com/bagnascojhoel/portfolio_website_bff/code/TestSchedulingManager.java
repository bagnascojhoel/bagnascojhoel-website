package br.com.bagnascojhoel.portfolio_website_bff.code;

import br.com.bagnascojhoel.portfolio_website_bff.model.scheduling_manager.SchedulingManager;
import org.springframework.boot.test.context.TestComponent;
import org.springframework.context.annotation.Primary;

@TestComponent
@Primary
public class TestSchedulingManager implements SchedulingManager {
    private boolean canSetupProjectCache = false;

    @Override
    public boolean canSetupProjectCache() {
        return this.canSetupProjectCache;
    }

    public void allowSetupProjectCache() {
        this.canSetupProjectCache = true;
    }
}
