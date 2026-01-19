package br.com.bagnascojhoel.portfolio_website_bff.model.project;

import br.com.bagnascojhoel.portfolio_website_bff.model.extra_portfolio_description.ExtraPortfolioDescription;
import br.com.bagnascojhoel.portfolio_website_bff.model.github_repository.GithubRepository;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NonNull;

@AllArgsConstructor(staticName = "of")
@Getter
public class ProjectSpecification {

    @NonNull
    private final ExtraPortfolioDescription extraPortfolioDescription;

    @NonNull
    private final GithubRepository githubRepository;

    public boolean isEnabled() {
        return !githubRepository.getIsArchived() || Boolean.TRUE.equals(extraPortfolioDescription.getShowEvenArchived());
    }
}
