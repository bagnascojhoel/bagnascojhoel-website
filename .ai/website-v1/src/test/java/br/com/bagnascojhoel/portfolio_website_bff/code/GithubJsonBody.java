package br.com.bagnascojhoel.portfolio_website_bff.code;

import br.com.bagnascojhoel.portfolio_website_bff.model.github.GithubMediaTypes;
import org.mockserver.model.BodyWithContentType;
import org.mockserver.model.JsonBody;
import org.mockserver.model.MediaType;

public class GithubJsonBody extends BodyWithContentType<String> {
    private final JsonBody jsonBody;

    private GithubJsonBody(JsonBody jsonBody) {
        super(Type.JSON, MediaType.create(GithubMediaTypes.GITHUB_JSON.getType(), GithubMediaTypes.GITHUB_JSON.getSubtype()));
        this.jsonBody = jsonBody;
    }

    public static GithubJsonBody githubJson(String json) {
        var jsonBody = JsonBody.json(json);
        return new GithubJsonBody(jsonBody);
    }

    @Override
    public String getValue() {
        return jsonBody.getValue();
    }
}
