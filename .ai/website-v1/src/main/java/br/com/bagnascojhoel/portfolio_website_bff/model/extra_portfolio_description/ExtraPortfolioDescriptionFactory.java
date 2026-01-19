package br.com.bagnascojhoel.portfolio_website_bff.model.extra_portfolio_description;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Base64;
import java.util.Optional;

@Component
@Slf4j
@AllArgsConstructor
public class ExtraPortfolioDescriptionFactory {
    private final ObjectMapper objectMapper;

    public Optional<ExtraPortfolioDescription> create(@NonNull final GithubDescriptionFile file) {
        try {
            byte[] decodedDescription = Base64.getMimeDecoder().decode(file.getRawContent());
            return Optional.of(objectMapper.readValue(decodedDescription, ExtraPortfolioDescription.class))
                    .map(extra -> extra.toBuilder().repositoryId(file.getRepositoryId()).build());
        } catch (Exception exception) {
            log.error("error while reading repository description file", exception);
            return Optional.empty();
        }
    }
}
