package br.com.bagnascojhoel.portfolio_website_bff.controller;

import br.com.bagnascojhoel.portfolio_website_bff.model.RepositoryId;
import br.com.bagnascojhoel.portfolio_website_bff.model.SkipProjectException;
import br.com.bagnascojhoel.portfolio_website_bff.model.UnrecoverableError;
import br.com.bagnascojhoel.portfolio_website_bff.model.extra_portfolio_description.ExtraPortfolioDescription;
import br.com.bagnascojhoel.portfolio_website_bff.model.extra_portfolio_description.ExtraPortfolioDescriptionDao;
import br.com.bagnascojhoel.portfolio_website_bff.model.github_repository.GithubRepository;
import br.com.bagnascojhoel.portfolio_website_bff.model.github_repository.GithubRepositoryDao;
import br.com.bagnascojhoel.portfolio_website_bff.model.project.Project;
import br.com.bagnascojhoel.portfolio_website_bff.model.project.ProjectFactory;
import br.com.bagnascojhoel.portfolio_website_bff.model.project.ProjectSpecification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Controller;
import reactor.core.publisher.Flux;

import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Controller
@RequiredArgsConstructor
public class ProjectsController {

    private static final int NUMBER_OF_REPOSITORIES_TO_FETCH = 30;

    private final GithubRepositoryDao githubRepositoryDao;
    private final ExtraPortfolioDescriptionDao extraPortfolioDescriptionDao;
    private final ProjectFactory projectFactory;

    @Cacheable("projects")
    public Set<Project> getMyProjects() {
        List<GithubRepository> githubRepositories = githubRepositoryDao.getGithubRepositories(NUMBER_OF_REPOSITORIES_TO_FETCH);
        Flux<ExtraPortfolioDescription> flux = extraPortfolioDescriptionDao.getExtraPortfolioDescriptions(githubRepositories);

        return flux
                .map(extra -> this.createSpec(extra, this.getRepositoryById(githubRepositories, extra.getRepositoryId())))
                .filter(spec -> !spec.getGithubRepository().getIsArchived() || Boolean.TRUE.equals(spec.getExtraPortfolioDescription().getShowEvenArchived()))
                .map(projectFactory::create)
                .onErrorResume(SkipProjectException.class, ignored -> null)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet())
                .block();
    }

    private ProjectSpecification createSpec(
            final ExtraPortfolioDescription extraPortfolioDescription,
            final GithubRepository githubRepository
    ) {
        try {
            return ProjectSpecification.of(extraPortfolioDescription, githubRepository);
        } catch (NullPointerException nullPointerException) {
            throw new SkipProjectException();
        }
    }

    private GithubRepository getRepositoryById(
            final List<GithubRepository> githubRepositories,
            final RepositoryId repositoryId
    ) {
        return githubRepositories.stream()
                .filter(repo -> repo.getRepositoryId().equals(repositoryId))
                .findAny()
                .orElseThrow(() -> {
                    log.error("something is wrong while matching content with github repository, repository-id={}", repositoryId);
                    return new UnrecoverableError();
                });
    }
}
