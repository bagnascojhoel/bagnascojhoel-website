package br.com.bagnascojhoel.portfolio_website_bff.controller;

import br.com.bagnascojhoel.portfolio_website_bff.model.scheduling_manager.SchedulingManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
@Slf4j
public class ProjectSchedulingController {

    private final ProjectsController projectsController;
    private final SchedulingManager schedulingManager;

    @Scheduled(initialDelayString = "${project.scheduling.initial-delay.load-projects}",
            fixedDelayString = "${project.scheduling.fixed-delay.load-projects}")
    public void setupProjectCache() {
        if (schedulingManager.canSetupProjectCache()) {
            log.info("scheduling setup project is enabled");
            this.projectsController.getMyProjects();
        } else {
            log.info("scheduling setup project is disabled");
        }
    }


    @Scheduled(fixedDelayString = "${project.scheduling.fixed-delay.evict-projects}")
    @CacheEvict(value = "projects", allEntries = true)
    protected void evictCache() {
        log.info("evicting projects");
    }
}
