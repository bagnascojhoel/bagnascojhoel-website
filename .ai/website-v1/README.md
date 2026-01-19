# Portfolio Website BFF

This project is used as the backend for frontend of my portfolio website.

## To-Do's

- [ ] Include pagination
- [x] Add exception handling
- [ ] Webhook evict cache when repo has been added or changed

## Running Locally

```shell
docker container run -v ~/workspaces/portfolio-website-monorepo/back:/resources -e PROJECT_GITHUB_PRIVATE_KEY_RESOURCE_PATH=file:/resources/bagnascojhoel-com-br.2023-08-21.private-key.der -p 8080:80 portfolio-website-bff
```

- The applications requires a GitHub private key. You can define one with
  either `project.github.private-key-resource-path` or `project.github.private-key-base-64`.

## Issues Along the Way

### JVM does not natively support .pem files

When trying to decrypt a `.pem` key file in java, it does not read correctly. Thus, when you try to do something like:

```java
        var keyFactory=getRSAFactory();
        var privateKeySpecContent=getPrivateKeyFileContent();
        var keySpec=new PKCS8EncodedKeySpec(privateKeySpecContent);

        RSAPrivateKey privateKey;
        try{
        privateKey=(RSAPrivateKey)keyFactory.generatePrivate(keySpec);
        }catch(InvalidKeySpecException invalidKeySpecException){
        log.error("key specification could not be used to generate github's private key");
        throw new UnrecoverableError(invalidKeySpecException);
        }
```

The snippet `keyFactory.generatePrivate(keySpec)` will throw an error because the `keySpec` was read from a `.pem` file.
One approach is to use `BouncyCastle`, a third-party library that enables you to read `.pem` files. The other approach,
which I followed in this project is to convert the `.pem` file into `.der`, which Java supports.

I got this information from [GitHub API for Java](https://github-api.kohsuke.org/githubappjwtauth.html) documentation.