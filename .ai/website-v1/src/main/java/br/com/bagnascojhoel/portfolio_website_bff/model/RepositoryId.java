package br.com.bagnascojhoel.portfolio_website_bff.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

@Getter(onMethod_ = @JsonValue)
@EqualsAndHashCode
@ToString(includeFieldNames = false)
public final class RepositoryId {
    private final String value;

    @JsonCreator
    public RepositoryId(String value) {
        this.value = value;
    }
}
