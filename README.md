# Blocks & Blades Bot

Bot Discord de modération et d'administration pour serveur Minecraft.

## Configuration

Le bot peut être configuré via des variables d'environnement ou un fichier `.env`.

### Variables d'environnement requises :

- `DISCORD_TOKEN` : Token de votre bot Discord.
- `RCON_HOST` : Adresse IP ou DNS de votre serveur Minecraft.
- `RCON_PORT` : Port RCON (par défaut 25575).
- `RCON_PASSWORD` : Mot de passe RCON défini dans `server.properties`.

## Installation locale

1. Installez les dépendances : `npm install`
2. Compilez et lancez : `npm start`

## Utilisation avec Docker

### Build de l'image

```bash
docker build -t bb-bot .
```

### Lancement avec Docker Compose

C'est la méthode recommandée pour simplifier la gestion des variables d'environnement.

1. Créez un fichier `.env` basé sur `.env.example`.
2. Lancez le bot avec l'une des commandes suivantes (selon votre version de Docker) :

```bash
# Pour Docker Compose V2 (inclus avec Docker Desktop)
docker compose up -d

# OU pour Docker Compose V1 (binaire indépendant)
docker-compose up -d
```

> **Note :** Si vous recevez une erreur `unknown shorthand flag: 'f' in -f`, cela signifie probablement que le plugin
`compose` n'est pas correctement installé dans votre CLI Docker. Utilisez alors la commande `docker-compose` (avec un
> tiret).

### Lancement avec Docker (manuel)

```bash
docker run -d \
  --name bb-bot \
  -e DISCORD_TOKEN=votre_token \
  -e RCON_HOST=votre_ip \
  -e RCON_PORT=votre_port \
  -e RCON_PASSWORD=votre_mdp \
  bb-bot
```
