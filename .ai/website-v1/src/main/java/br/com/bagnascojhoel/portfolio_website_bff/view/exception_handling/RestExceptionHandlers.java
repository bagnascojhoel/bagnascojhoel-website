package br.com.bagnascojhoel.portfolio_website_bff.view.exception_handling;

import br.com.bagnascojhoel.portfolio_website_bff.model.UnrecoverableError;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.support.DefaultHandlerExceptionResolver;

@RestControllerAdvice
public class RestExceptionHandlers extends DefaultHandlerExceptionResolver {

    @ExceptionHandler(UnrecoverableError.class)
    public ResponseEntity<ErrorResponseDto> handleUnrecoverableError(
            final UnrecoverableError unrecoverableError
    ) {
        final ErrorResponseDto body = ErrorResponseDto.builder()
                .code(unrecoverableError.getCode())
                .message(unrecoverableError.getMessage())
                .build();
        return ResponseEntity.internalServerError().body(body);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponseDto> handleAnyException(final Exception exception) {
        final ErrorResponseDto body = ErrorResponseDto.builder()
                .code("unknown-error")
                .message("An unexpected error has happened.")
                .build();
        return ResponseEntity.internalServerError().body(body);
    }
}
