package br.com.bagnascojhoel.portfolio_website_bff.view.exception_handling;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@AllArgsConstructor
@Data
@Builder
public class ErrorResponseDto {
    private final String code;
    private final String message;
}
