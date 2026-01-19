package br.com.bagnascojhoel.portfolio_website_bff.view.project;

import br.com.bagnascojhoel.portfolio_website_bff.controller.ProjectsController;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class ProjectsRestView {
    private final ProjectsController projectsController;

    @CrossOrigin(originPatterns = "*")
    @GetMapping("/projects")
    public ProjectsResponseDto getProjects() {
        return new ProjectsResponseDto(projectsController.getMyProjects());
    }

    @PostMapping("/projects/meta/refresh")
    @CacheEvict("projects")
    public void evictCache() {

    }

}
