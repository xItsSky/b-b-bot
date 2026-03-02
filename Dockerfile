# Stage 1: Build
FROM node:20-slim AS build

WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./
COPY tsconfig.json ./

# Installation des dépendances (y compris les devDependencies pour le build)
RUN npm ci

# Copie du code source
COPY . .

# Build de l'application TypeScript
RUN npm run build

# Stage 2: Production
FROM node:20-slim

WORKDIR /app

# Installation des certificats CA si nécessaire pour les connexions sécurisées
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copie uniquement des fichiers nécessaires depuis le stage build
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./

# Installation uniquement des dépendances de production
RUN npm ci --only=production

# Définition des variables d'environnement par défaut (peuvent être surchargées au runtime)
ENV NODE_ENV=production

# Commande de démarrage
# Note: On n'utilise pas env-cmd ici car Docker gère les variables d'environnement nativement
CMD ["node", "dist/main.js"]
