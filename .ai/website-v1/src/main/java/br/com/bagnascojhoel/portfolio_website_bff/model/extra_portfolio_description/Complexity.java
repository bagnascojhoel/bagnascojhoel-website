package br.com.bagnascojhoel.portfolio_website_bff.model.extra_portfolio_description;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
@JsonFormat(shape = JsonFormat.Shape.OBJECT)
public enum Complexity {
    EXTREME("complexity-extreme", "Extreme"),
    HIGH("complexity-high", "High"),
    MEDIUM("complexity-medium", "Medium"),
    LOW("complexity-low", "Low");
    // TODO Change complexity to proudness level

    private final String code;
    @JsonProperty("text")
    private final String defaultMessage;
}
