# Deploy — Yūgen Store Backend

Deploy automatizado a una VPS mediante GitHub Actions, con la imagen publicada en GHCR y
el tráfico expuesto por un Cloudflare Tunnel propio. El stack es totalmente independiente:
red, volumen y tunnel propios, sin tocar otros proyectos del servidor.

## Flujo

```
push a main → GitHub Actions
   ├─ test          (build + cobertura; bloquea si falla)
   ├─ build-and-push (imagen Docker → GHCR)
   └─ deploy        (SSH a la VPS → docker compose pull + up -d)
```

En la VPS (`/opt/yugen-store/`) corren:
- `yugen_api` — la API (imagen de GHCR)
- `yugen_postgres` — base de datos con volumen propio
- `yugen_cloudflared` — tunnel que publica el dominio (sin abrir puertos en el host)

## Secrets de GitHub (Settings → Secrets and variables → Actions)

| Secret | Valor |
|---|---|
| `VPS_HOST` | IP/host de la VPS |
| `VPS_USER` | usuario SSH |
| `VPS_SSH_PORT` | puerto SSH |
| `VPS_SSH_KEY` | llave privada de deploy (ed25519) |
| `VPS_FINGERPRINT` | fingerprint SHA256 del host (pin anti-MITM) |

> `GITHUB_TOKEN` para GHCR es automático, no hay que crearlo.

## Preparación de la VPS (una sola vez)

```bash
sudo mkdir -p /opt/yugen-store && sudo chown $USER:$USER /opt/yugen-store
cd /opt/yugen-store
# subir deploy/docker-compose.prod.yml a este directorio
cp .env.prod.example .env   # y rellenar con valores reales (DB, GATEWAY_*, TUNNEL_TOKEN)
chmod 600 .env
```

La imagen de GHCR debe ser pública (o hacer `docker login ghcr.io` en la VPS).

## Cloudflare Tunnel

1. Cloudflare → Zero Trust → Networks → Tunnels → Create tunnel (tipo *Cloudflared*).
2. Copiar el **token** del tunnel → va en `TUNNEL_TOKEN` del `.env`.
3. Public Hostname: `yugen.michaelnegrete.online` → service `http://yugen_api:3000`.

El contenedor `cloudflared` del compose se conecta con ese token; no requiere abrir puertos.
