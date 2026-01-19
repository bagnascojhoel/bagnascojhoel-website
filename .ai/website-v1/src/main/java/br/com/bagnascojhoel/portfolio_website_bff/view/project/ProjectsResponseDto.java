package br.com.bagnascojhoel.portfolio_website_bff.view.project;

import br.com.bagnascojhoel.portfolio_website_bff.model.project.Project;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public final class ProjectsResponseDto {
    private Set<Project> projects;
}
