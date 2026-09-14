# Hugo, pinned. Nothing is installed on the host.
#
# HUGO_VERSION must match .hugo-version, which CI reads, so that a local build
# and a deployed build use identical Hugo.
FROM debian:bookworm-slim

ARG HUGO_VERSION=0.166.0
ARG TARGETARCH=amd64

# Everything in ONE layer, deliberately.
#
# A later RUN cannot shrink an earlier one — it only stacks another layer on
# top. So the .deb has to be downloaded, installed AND deleted here, or its
# 22 MB stays in the image forever. (A multi-stage build is worse for this
# reason: COPYing the .deb in from a fetch stage creates a layer that holds it.)
#
# Runtime dependencies, not build helpers:
#   git              Hugo shells out to it for .GitInfo and theme submodules.
#   ca-certificates  Hugo fetches remote resources at build time — Hextra pulls
#                    FlexSearch from a CDN via resources.GetRemote. Without the
#                    trust store that fails with "certificate signed by unknown
#                    authority" and the whole site build aborts.
RUN apt-get update \
 && apt-get install -y --no-install-recommends ca-certificates curl git \
 && curl -fsSL -o /tmp/hugo.deb \
      "https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_linux-${TARGETARCH}.deb" \
 && dpkg -i /tmp/hugo.deb \
 && rm /tmp/hugo.deb \
 && apt-get purge -y curl \
 && apt-get autoremove -y \
 && rm -rf /var/lib/apt/lists/* \
 && hugo version

WORKDIR /src
EXPOSE 1313

# Runs as root by default. docker-compose.yml overrides this with your host uid
# so that generated files in the bind mount stay yours — see README.
CMD ["hugo", "server", \
     "--bind", "0.0.0.0", \
     "--port", "1313", \
     "--baseURL", "http://localhost:1313/", \
     "--appendPort=false", \
     "--poll", "700ms"]
