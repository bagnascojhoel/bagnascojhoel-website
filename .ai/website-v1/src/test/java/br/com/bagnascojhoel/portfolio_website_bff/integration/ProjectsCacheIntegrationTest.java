package br.com.bagnascojhoel.portfolio_website_bff.integration;

import br.com.bagnascojhoel.portfolio_website_bff.PortfolioWebsiteBffApplication;
import br.com.bagnascojhoel.portfolio_website_bff.code.GithubMockServer;
import br.com.bagnascojhoel.portfolio_website_bff.code.TestSchedulingManager;
import br.com.bagnascojhoel.portfolio_website_bff.controller.ProjectsController;
import io.restassured.RestAssured;
import lombok.extern.slf4j.Slf4j;
import org.assertj.core.api.Assertions;
import org.awaitility.Duration;
import org.junit.jupiter.api.*;
import org.mockito.Mockito;
import org.mockserver.client.MockServerClient;
import org.mockserver.springtest.MockServerTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.core.AutoConfigureCache;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.cache.CacheManager;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.util.concurrent.TimeUnit;

import static io.restassured.RestAssured.get;
import static org.assertj.core.api.Assertions.assertThat;
import static org.awaitility.Awaitility.await;

@SpringBootTest(
        classes = {PortfolioWebsiteBffApplication.class, TestSchedulingManager.class},
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
        properties = {
                "project.github.host=localhost",
                "project.github.scheme=http",
                "project.github.port=${mockServerPort}",
                "project.github.private-key-base-64=MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCrW1tEYn/DG09Kar3rHK3BZUnlwsOyPp/5Xuc8VapuFfzqXgjAm2xGYLYIkVJg1TRUPpY4vx95mxpsRnRVD6VrhsSVAyeRW9GY3ZctN5HHrw/WvY2FD0N96eeLbIzklU8bvgqre7mnQQoTxjYB1yNmdqrPtWRv9MTovSVZnJ1mYyZ6+Lq+27MFNXoD3ZR7P5F0kw5+vOzJd2Ijfrm2bfkl0W3JT102wtPI73SivHK84ZH1Rx7rLQFCt00hHpr8awRgzJBFwpEtbiyqVmF8wnYWZmw6/9kvKwxAs4+JJMrDnZM3mb7eXSkRqyYWL85NCOgs6JdoHSPXtlIPe7rlmXo9AgMBAAECggEBAKJcyKiOMAKdUM7xPwyUOusBXziuB6FPh2LQkodvoDH48ZDcEqz1V22D21dY4tZPjeq49rvEFD20QiAPzdB/J70vj/qlZ4tqlbmjVMgKXD35WSeeqYZHRSr8Q2GvM/yuoKtnsVJ0xB9/F95OtAOgZrGChSyT8hvGsADan5Y+OEG26d6+FeljN/PdOE+bJyHfNNcOqQaXgWQhjh3erxa1S4v4fLpal00NVeoVnqi8HuBjMaopxfmc3N6iPKbi6teettbleMaMkiUbdm5hhWztu2ce2P9MKHB71AHh5Q9+keNqBIEzUAdn8QlKt+St14cloEbhSrXb6/yaWtveME5jMsECgYEA1H0TiKoJe39quneImhmk6Pv6B7KCWi+NWu7+Hu0riHF5LTa/EVRl4Eh88rTWACFqjZMbmJ2Lay3Wj2Riy0uUKZYuPLt+HT3z6mBQ8ofiouG60ueVN7hon6yOV8dZbo2DwOA1OCtsSqaCb5NJu+FLNdLfLJlHj8zKPxaJoHLUn20CgYEAznIaUyR6arZfLU3tL1PWYhS+HOsjQnBpkDaW1oAKd4a4UFNXsM+GPjvz152fPnmifERGfnXjjcffKke7frZ6B1iIb9AMhecrBloAJA0uL4oyRVX7+CWUofFNxIu0GEq204+OLPjeRi7a23GjeIVSLIKOKGaYp8iWobY5w/RD9BECgYBCALwBlnetkc2QMDMRUufjqulmXK+a3ex1k4kCCD+eeUjfn4LIGkQu37VYGo3iqn6TjV9kD4PP/gQItHDvnwFdzZV9LewlnynV4qciPs1KNP24J1E1ZqWw+4OXhoekDHchgUNmuC5CHeikScb8giW/iUnja5VL+JvV7uU/HownHQKBgG/EdJ4YvLHzZFnpu4SI9iMJqdeMMf2xUGWEOGuOzJvjcvwB8xLFd59P4/cS3fj7700pxaSHfJfw4tBIH6k9b5l0hAFM+Mqx2ahJp5PdEukn/4lsQMsaxXpbYsgK/oi8QnkNWmLcpbIHgfOWdXM1csSoNgCHcxQ7U9nfBy0gnH2RAoGASLAB/hsu9CULkj5Mpj5P+NZO3zRsHRt8g08CoVsNF2x7iswKO8VYvdwrvqdhAwmYeqWnDvuRkiGElSSrK24qX2+vkXe/nDczhHfBuwdW+GpGHUqzNsUIC2r/5zamueljRPm+dYvlEPKwuYdE374NBxa873sTvFp6nMrqCG6lD/A=",
                "project.cache.enabled=true",
                "project.scheduling.fixed-delay.evict-projects=PT5S",
                "project.scheduling.fixed-delay.load-projects=PT5S",
                "project.scheduling.initial-delay.load-projects=PT0S"
        }
)
@AutoConfigureCache
@EnableScheduling
@MockServerTest
@Slf4j
public class ProjectsCacheIntegrationTest {

    @LocalServerPort
    String port;

    @Autowired
    CacheManager cacheManager;

    @SpyBean
    ProjectsController projectsController;

    @Value("${project.github.username}")
    String githubUsername;

    @Value("${project.github.project-description-file}")
    String githubProjectDescriptionFile;

    @Autowired
    TestSchedulingManager testSchedulingManager;

    MockServerClient mockServerClient;

    GithubMockServer githubMockServer;

    @BeforeAll
    static void beforeAll() {
        log.info("testing cache integration test");
    }

    @AfterAll
    static void afterAll() {
        log.info("ended cache integration test");
    }

    @BeforeEach
    void beforeEach() {
        RestAssured.baseURI = "http://localhost:" + port + "/api";
        while (!mockServerClient.hasStarted()) {
        }
        log.info("mock server client has started");
        mockServerClient.reset();
        testSchedulingManager.allowSetupProjectCache();
        githubMockServer = new GithubMockServer(githubUsername, githubProjectDescriptionFile, mockServerClient);
        githubMockServer.mockEndpoint("GET /users/{username}/installation");
        githubMockServer.mockEndpoint("POST /app/installations/{installationId}/access_tokens");
        githubMockServer.mockEndpoint("GET /users/{username}/repos");
    }

    @Nested
    @DisplayName("GET /projects")
    class GetProjects {
        @Test
        void shouldBeUsingCacheWhenCacheIsEnabled() throws InterruptedException {
            githubMockServer.mockEndpoint("GET /repos/{username}/prefer-github-description/contents/{fileName}");
            githubMockServer.mockEndpoint("GET /repos/{username}/*/contents/{fileName}");

            cacheManager.getCache("projects").clear();
            var timeForFirstRequest = get("/projects").then()
                    .statusCode(200)
                    .extract()
                    .timeIn(TimeUnit.MILLISECONDS);

            var timeForSecondRequest = get("/projects").then().statusCode(200).extract().timeIn(TimeUnit.MILLISECONDS);
            Thread.sleep(4000);
            var timeForThirdRequest = get("/projects").then().extract().timeIn(TimeUnit.MILLISECONDS);
            Thread.sleep(1000);
            var timeForFourthRequest = get("/projects").then().extract().timeIn(TimeUnit.MILLISECONDS);

            assertThat(timeForSecondRequest).isLessThan(timeForFirstRequest);
            assertThat(timeForThirdRequest)
                    .isCloseTo(timeForFirstRequest, Assertions.withinPercentage(100));
            assertThat(timeForFourthRequest)
                    .isCloseTo(timeForSecondRequest, Assertions.withinPercentage(100));
        }

        @Test
        void shouldBeUsingScheduling() {
            githubMockServer.mockEndpoint("GET /repos/{username}/prefer-github-description/contents/{fileName}");
            githubMockServer.mockEndpoint("GET /repos/{username}/*/contents/{fileName}");
            
            await()
                    .atMost(Duration.TEN_SECONDS)
                    .untilAsserted(() -> Mockito.verify(projectsController).getMyProjects());
        }
    }


}
