# Stage 1: build the static site
FROM node:22-alpine AS build
WORKDIR /app

# Dependencies first: this layer stays cached until package-lock.json changes.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: serve it with nginx (no Node in the final image)
FROM nginx:1.27-alpine
# The nginx image turns templates into config at startup, filling in env vars (BACKEND_URL).
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
