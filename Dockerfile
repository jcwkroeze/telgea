FROM oven/bun:latest

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        ca-certificates \
        libnss3 \
    && rm -rf /var/lib/apt/lists/*

# NOTE(jan): Set-up non-root user for security reasons.
ARG USERNAME=node
ARG USER_UID=1001
ARG USER_GID=$USER_UID

RUN groupadd --gid $USER_GID $USERNAME \
    && useradd --uid $USER_UID --gid $USER_GID -m $USERNAME

WORKDIR /workspace

COPY . .
RUN chown node:node -R .

USER $USERNAME
RUN bun install --frozen-lockfile

CMD ["bun", "test"]
