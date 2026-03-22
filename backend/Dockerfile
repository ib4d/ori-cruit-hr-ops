FROM node:18-alpine AS builder

WORKDIR /app

# Copy root package.json for monorepo installs if needed
COPY package.json ./
# Copy backend manifest
COPY backend/package.json ./backend/

WORKDIR /app/backend
# Install ALL dependencies (including devDependencies) to run build
RUN npm install

# Copy complete backend source
COPY backend/ ./
# Generate Prisma Client
RUN npx prisma generate
# Build the NestJS app
RUN npm run build

FROM node:18-alpine AS runtime

WORKDIR /app/backend
# Copy from build layer
COPY --from=builder /app/backend/package*.json ./
COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/backend/prisma ./prisma
COPY --from=builder /app/backend/node_modules ./node_modules

# Basic security check
RUN addgroup -S oricruit && adduser -S oricruit -G oricruit
USER oricruit

EXPOSE 3000

ENV NODE_ENV=production

# Let standard Docker run the db migrations then start the server
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
