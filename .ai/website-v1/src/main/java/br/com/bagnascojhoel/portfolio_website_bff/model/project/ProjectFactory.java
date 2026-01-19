package br.com.bagnascojhoel.portfolio_website_bff.model.project;

import br.com.bagnascojhoel.portfolio_website_bff.model.SkipProjectException;
import br.com.bagnascojhoel.portfolio_website_bff.model.extra_portfolio_description.Complexity;
import br.com.bagnascojhoel.portfolio_website_bff.model.extra_portfolio_description.ExtraPortfolioDescription;
import br.com.bagnascojhoel.portfolio_website_bff.model.github_repository.GithubRepository;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.time.ZoneOffset;
import java.util.HashSet;
import java.util.Optional;

import static java.util.Collections.emptySet;
import static java.util.Objects.requireNonNullElse;

@Slf4j
@Component
public class ProjectFactory {
    public Project create(@NonNull final ProjectSpecification projectSpecification) {
        final ExtraPortfolioDescription extra = projectSpecification.getExtraPortfolioDescription();
        final GithubRepository mainRepository = projectSpecification.getGithubRepository();

        final Project.ProjectBuilder builder = Project.builder()
                .repositoryId(mainRepository.getRepositoryId().getValue())
                .repositoryUrl(mainRepository.getHtmlUrl())
                .title(extra.getTitle())
                .lastChangedDateTime(mainRepository.getPushedAt().toInstant(ZoneOffset.UTC))
                .startsOpen(Boolean.TRUE.equals(extra.getStartsOpen()));

        Optional.ofNullable(mainRepository.getWebsiteUrl())
                .filter(StringUtils::hasText)
                .ifPresentOrElse(
                        builder::websiteUrl,
                        () -> Optional.ofNullable(extra.getWebsiteUrl())
                                .ifPresent(builder::websiteUrl)
                );

        Optional.ofNullable(mainRepository.getTopics())
                .map(HashSet::new)
                .ifPresentOrElse(
                        mainTopics -> {
                            Optional.ofNullable(extra.getCustomTopics())
                                    .ifPresent(mainTopics::addAll);

                            builder.tags(mainTopics);
                        },
                        () -> builder.tags(requireNonNullElse(extra.getCustomTopics(), emptySet()))
                );

        Optional.ofNullable(mainRepository.getDescription())
                .filter(StringUtils::hasText)
                .ifPresentOrElse(
                        builder::description,
                        () -> Optional.ofNullable(extra.getCustomDescription())
                                .map(builder::description)
                                .orElseThrow(() -> {
                                    log.error(
                                            "there is no description on github repository or project description file, repository={}",
                                            mainRepository.getRepositoryId()
                                    );
                                    return new SkipProjectException();
                                })
                );

        Optional.ofNullable(extra.getStartsOpen())
                .ifPresentOrElse(
                        builder::startsOpen,
                        () -> builder.startsOpen(false)
                );

        Optional.ofNullable(extra.getComplexity())
                .ifPresentOrElse(
                        builder::complexity,
                        () -> builder.complexity(Complexity.MEDIUM)
                );

        return builder.build();
    }
}
