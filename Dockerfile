# build stage
FROM node:22-alpine AS build
WORKDIR /usr/src/app

# 1) Copia manifestos e instala deps (inclui devDeps)
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm@10.11.0 \
  && pnpm install --frozen-lockfile

# 2) Copia todo o código, incluindo tsconfig.json e src/
COPY . .

# 3) Roda build e depois limpa deps de dev
RUN pnpm build \
  && pnpm prune --prod

# publish stage
FROM node:22-alpine AS publish
RUN apk --no-cache add dumb-init
ENV NODE_ENV=production
USER node
WORKDIR /usr/src/app

COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/package.json ./

EXPOSE 3000
ENTRYPOINT ["dumb-init", "--"]
CMD ["pnpm", "run", "start:dev"]
