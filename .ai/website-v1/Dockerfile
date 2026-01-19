FROM ubuntu
ARG ARTIFACT
COPY build/native/nativeCompile/${ARTIFACT} /bff
EXPOSE 8080
ENTRYPOINT ["/bff"]