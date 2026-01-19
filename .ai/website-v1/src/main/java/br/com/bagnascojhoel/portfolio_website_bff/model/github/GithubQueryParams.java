package br.com.bagnascojhoel.portfolio_website_bff.model.github;

public final class GithubQueryParams {
    public static final String PER_PAGE = "per_page";
    public static final String PAGE = "page";
    public static final String SORT = "sort";
    public static final String DIRECTION = "direction";

    public GithubQueryParams() {
    }

    @Override
    public boolean equals(Object obj) {
        return obj == this || obj != null && obj.getClass() == this.getClass();
    }

    @Override
    public int hashCode() {
        return 1;
    }

    @Override
    public String toString() {
        return "GithubQueryParams[]";
    }

}
