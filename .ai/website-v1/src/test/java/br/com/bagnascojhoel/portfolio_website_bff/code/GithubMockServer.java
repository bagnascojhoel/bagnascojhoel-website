package br.com.bagnascojhoel.portfolio_website_bff.code;

import org.mockserver.client.MockServerClient;
import org.mockserver.model.Delay;
import org.mockserver.model.MediaType;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.concurrent.TimeUnit;

import static org.mockserver.model.HttpRequest.request;
import static org.mockserver.model.HttpResponse.response;
import static org.mockserver.model.JsonBody.json;
import static org.mockserver.model.Parameter.param;

public final class GithubMockServer {

    private static final String MY_INSTALLATION_ID = "6125";

    private final String githubUsername;

    private final String githubFileName;

    private final MockServerClient mockServerClient;

    public GithubMockServer(
            String githubUsername,
            String githubFileName,
            MockServerClient mockServerClient
    ) {
        this.githubUsername = githubUsername;
        this.githubFileName = githubFileName;
        this.mockServerClient = mockServerClient;
    }

    public void mockEndpoint(final String endpoint) {
        switch (endpoint) {
            case "GET /users/{username}/installation":
                this.userInstallation();
                break;
            case "POST /app/installations/{installationId}/access_tokens":
                this.userInstallationAccessTokens();
                break;
            case "GET /users/{username}/repos":
                this.userRepositories();
                break;
            case "GET /repos/{username}/prefer-github-description/contents/{fileName}":
                this.mockExtraDescriptionContent("prefer-github-description", """
                        {
                             "title": "My Title",
                             "websiteUrl": "https://my-website.com",
                             "description": "This is my extra description.",
                             "websiteUrl": "https://extra-website-url.com"
                         }""");
                break;
            case "GET /repos/{username}/fill-in-with-extra-description/contents/{fileName}":
                this.mockExtraDescriptionContent("fill-in-with-extra-description", """
                        {
                            "title": "A Project",
                            "tags": ["extra-tag"],
                            "description": "This is my extra description.",
                            "websiteUrl": "https://extra-website-url.com",
                            "complexity": "HIGH",
                            "startsOpen": true
                        }""");
                break;
            case "GET /repos/{username}/show-archived/contents/{fileName}":
                this.mockExtraDescriptionContent("show-archived", """
                        {
                           "title": "Portfolio Website",
                           "showEvenArchived": true
                        }""");
                break;
            case "GET /repos/{username}/use-default-value-for-optional-fields/contents/{fileName}":
                this.mockExtraDescriptionContent("use-default-value-for-optional-fields", """
                        {
                          "title": "Portfolio Website"
                        }""");
                break;
            case "GET /repos/{username}/merge-fields/contents/{fileName}":
                this.mockExtraDescriptionContent("merge-fields", """
                        {
                          "title": "Portfolio Website",
                          "tags": ["extra-tag", "another-extra-tag"]
                        }""");
                break;
            case "GET /repos/{username}/archived/contents/{fileName}":
                this.mockExtraDescriptionContent("archived", """
                        {
                          "title": "Portfolio Website"
                        }""");
                break;
            case "GET /repos/{username}/*/contents/{fileName}":
                this.anyExtraDescriptionContentMissing();
                break;
        }
    }

    // TODO Use the builder pattern to create the response body of each mocked endpoint
    private void userInstallation() {
        mockServerClient
                .when(
                        request()
                                .withMethod("GET")
                                .withPath("/users/{username}/installation")
                                .withPathParameter(param("username", githubUsername))
                )
//                .withId("user_installation-200")
                .respond(
                        response()
                                .withStatusCode(200)
                                .withContentType(MediaType.JSON_UTF_8)
                                .withBody(json("""
                                        {
                                          "id": {installationId}
                                        }
                                        """.replace("{installationId}", MY_INSTALLATION_ID))
                                )
                );

    }

    private void userInstallationAccessTokens() {
        var expiresAt = Instant.now().plus(10, ChronoUnit.MINUTES).toString();

        mockServerClient
                .when(
                        request()
                                .withMethod("POST")
                                .withPath("/app/installations/{installationId}/access_tokens")
                                .withPathParameter(param("installationId", MY_INSTALLATION_ID))
                )
                .respond(
                        response()
                                .withStatusCode(200)
                                .withBody(json("""
                                        {
                                            "token": "my-token",
                                            "expires_at": "{expiresAt}"
                                        }
                                        """.replace("{expiresAt}", expiresAt))
                                )
                );
    }

    private void userRepositories() {
        mockServerClient
                .when(
                        request()
                                .withMethod("GET")
                                .withPath("/users/{username}/repos")
                                .withPathParameter(param("username", githubUsername))
                )
                .respond(
                        response()
                                .withStatusCode(200)
                                .withContentType(MediaType.JSON_UTF_8)
                                .withBody(json("""
                                        [
                                            {
                                                "name": "prefer-github-description",
                                                "html_url": "https://github.com/{username}/prefer-github-description",
                                                "homepage": "https://prefer-github-description",
                                                "archived": false,
                                                "topics": ["main"],
                                                "description": "This is my main description.",
                                                "pushed_at": "2023-10-12T10:10:00Z"
                                            },
                                            {
                                                "name": "fill-in-with-extra-description",
                                                "html_url": "https://github.com/{username}/fill-in-with-extra-description",
                                                "homepage": "",
                                                "archived": false,
                                                "topics": [],
                                                "description": null,
                                                "pushed_at": "2023-10-10T11:11:59Z"
                                            },
                                            {
                                                "name": "merge-fields",
                                                "html_url": "https://github.com/{username}/merge-fields",
                                                "homepage": null,
                                                "archived": false,
                                                "topics": ["github-topic"],
                                                "description": "GitHub description",
                                                "pushed_at": "2023-10-21T02:28:06Z"
                                            },
                                            {
                                                "name": "show-archived",
                                                "html_url": "https://github.com/{username}/show-archived",
                                                "homepage": "https://main-website-url.com",
                                                "archived": false,
                                                "topics": ["main"],
                                                "description": "This is my main description.",
                                                "pushed_at": "2023-10-12T10:10:00Z"
                                            },
                                            {
                                                "name": "use-default-value-for-optional-fields",
                                                "html_url": "https://github.com/{username}/repository-2",
                                                "homepage": "",
                                                "archived": false,
                                                "topics": [],
                                                "description": "GitHub description",
                                                "pushed_at": "2023-10-10T11:11:59Z"
                                            },
                                            {
                                                "name": "archived",
                                                "html_url": "https://github.com/{username}/archived",
                                                "homepage": "https://main-website-url.com",
                                                "archived": true,
                                                "topics": ["main"],
                                                "description": "This is my main description.",
                                                "pushed_at": "2023-10-12T10:10:00Z"
                                            },
                                        ]
                                        """.replace("{username}", githubUsername))
                                )
                );
    }

    private void anyExtraDescriptionContentMissing() {
        mockServerClient
                .when(request()
                        .withMethod("GET")
                        .withPath("/repos/{username}/*/contents/{fileName}")
                        .withPathParameters(
                                param("username", githubUsername),
                                param("fileName", githubFileName)
                        )
                )
                .respond(response()
                        .withDelay(Delay.delay(TimeUnit.SECONDS, 1))
                        .withStatusCode(404)
                        .withBody(json("""
                                    {
                                      "message": "Not Found",
                                    }
                                """
                        ))
                );
    }

    private void mockExtraDescriptionContent(final String repositoryId, final String json) {
        var encodedContent = Base64.getEncoder()
                .encodeToString(json.getBytes(StandardCharsets.UTF_8));

        mockServerClient
                .when(request()
                        .withMethod("GET")
                        .withPath("/repos/{username}/{repoName}/contents/{fileName}")
                        .withPathParameters(
                                param("username", githubUsername),
                                param("repoName", repositoryId),
                                param("fileName", githubFileName)
                        )
                )
                .respond(response()
                        .withStatusCode(200)
                        .withDelay(Delay.delay(TimeUnit.SECONDS, 1))
                        .withBody(json("""
                                    {
                                      "content": "{encodedContent}",
                                    }
                                """.replace("{encodedContent}", encodedContent))
                        )
                );
    }
}
