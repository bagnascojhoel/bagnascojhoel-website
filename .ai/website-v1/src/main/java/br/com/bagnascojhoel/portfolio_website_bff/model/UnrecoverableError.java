package br.com.bagnascojhoel.portfolio_website_bff.model;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UnrecoverableError extends RuntimeException {
    private final String code;

    public UnrecoverableError() {
        super("An unexpected error has happened.");
        this.code = "unknown-error";
    }

    public UnrecoverableError(Throwable cause) {
        super("An unexpected error has happened.", cause);
        this.code = "unknown-error";
    }

    public UnrecoverableError(String code, String message, Throwable cause) {
        super(message, cause);
        this.code = code;
    }
}
