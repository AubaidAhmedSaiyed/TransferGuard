# TransferGuard Production Deployment Guide

TransferGuard is designed with a modern monorepo architecture that supports **Unified (Single Container/Process)** and **Decoupled (Static Frontend + Backend API)** deployment modes.

---

## 🚀 Deployment Options Matrix

| Deployment Strategy | Best For | Complexity | AI Engine |
| :--- | :--- | :--- | :--- |
| **1. Docker / Docker Compose** *(Recommended)* | AWS EC2, DigitalOcean, VPS, Local Server | Low (1 command) | Built-in Ollama container |
| **2. Railway / Render / Fly.io** | Fast cloud hosting, Git-push CI/CD | Minimal | Cloud PaaS container |
| **3. Vercel + Render / Railway** | Global CDN for web + Managed API | Low | Decoupled cloud |
| **4. Self-Hosted Linux VPS (Ubuntu)** | Dedicated enterprise infrastructure | Medium | PM2 + Nginx + Let's Encrypt SSL |

---

## 🐳 Option 1: Docker & Docker Compose (Recommended)

TransferGuard includes a multi-stage production [`Dockerfile`](file:///d:/Products/Legalcontr/Dockerfile) and [`docker-compose.yml`](file:///d:/Products/Legalcontr/docker-compose.yml) that packages both the frontend and API into an ultra-fast, unified Alpine container.

### Step 1: Clone Repository & Enter Directory
```bash
git clone <your-repo-url> transferguard
cd transferguard
```

### Step 2: Launch Platform with Docker Compose
```bash
docker compose up -d --build
```

This starts:
1. **`transferguard-platform`:** Unified web console + decision API on port `3001`
2. **`transferguard-ollama`:** Local AI container on port `11434`

### Step 3: (Optional) Pull AI Model in Ollama Container
```bash
docker exec -it transferguard-ollama ollama pull qwen3:4b
```

### Step 4: Access Application
* **Web & API Console:** `http://localhost:3001` (or your server's public IP `http://<SERVER_IP>:3001`)
* **Health Endpoint:** `http://localhost:3001/api/health`

---

## ☁️ Option 2: 1-Click Cloud PaaS (Railway / Render / Fly.io)

### Deploying to Render.com
1. Go to [Render Dashboard](https://dashboard.render.com/) and click **New + Web Service**.
2. Connect your GitHub repository.
3. Configure settings:
   * **Environment:** `Docker` (Render will automatically detect [`Dockerfile`](file:///d:/Products/Legalcontr/Dockerfile))
   * **Region:** Choose closest to your team
   * **Plan:** Free or Starter
4. Environment Variables:
   * `NODE_ENV=production`
   * `PORT=3001`
5. Click **Create Web Service**. Render builds and serves both the Web UI and API on a single `https://your-app.onrender.com` URL.

### Deploying to Railway.app
1. Go to [Railway Dashboard](https://railway.app/) and click **New Project → Deploy from GitHub repo**.
2. Select your repository.
3. Railway automatically builds the multi-stage Dockerfile.
4. Under **Settings → Networking**, click **Generate Domain**.
5. Your application is live at `https://your-app.up.railway.app`.

---

## ⚡ Option 3: Decoupled Deployment (Vercel Frontend + Render API)

If you prefer deploying the React frontend to global edge CDN (Vercel / Cloudflare Pages) and the API separately:

### Step 1: Deploy Backend API to Render/Railway
* **Root Directory:** `apps/api` (or deploy root with Dockerfile)
* **Build Command:** `npm --prefix apps/api run build`
* **Start Command:** `npm --prefix apps/api run start`
* Note down your backend URL (e.g. `https://transferguard-api.onrender.com`).

### Step 2: Deploy Frontend to Vercel
1. In Vercel, import your repository.
2. Set **Root Directory** to `apps/web`.
3. Set **Framework Preset** to `Vite`.
4. Add Environment Variable:
   ```env
   VITE_API_URL=https://transferguard-api.onrender.com
   ```
5. Click **Deploy**. Vercel will host the frontend globally and proxy API calls to your backend.

---

## 🖥️ Option 4: Self-Hosted Linux VPS (Ubuntu 22.04 / 24.04 LTS)

### 1. Install Node.js 22 & PM2
```bash
# Install Node.js 22 LTS
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs nginx certbot python3-certbot-nginx

# Install PM2 process manager
sudo npm install -g pm2
```

### 2. Build the Application
```bash
git clone <your-repo-url> /var/www/transferguard
cd /var/www/transferguard
npm ci
npm run build
```

### 3. Start Backend with PM2
```bash
pm2 start apps/api/dist/index.js --name "transferguard" --env production
pm2 save
pm2 startup
```

### 4. Configure Nginx Reverse Proxy & SSL
Create `/etc/nginx/sites-available/transferguard`:

```nginx
server {
    server_name transferguard.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable site & obtain free SSL certificate:
```bash
sudo ln -s /etc/nginx/sites-available/transferguard /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Obtain SSL Certificate
sudo certbot --nginx -d transferguard.yourdomain.com
```

---

## ⚙️ Environment Variables Reference

| Variable | Required | Default | Description |
| :--- | :--- | :--- | :--- |
| `NODE_ENV` | No | `production` | Node.js environment (`production` or `development`) |
| `PORT` | No | `3001` | HTTP server port |
| `OLLAMA_HOST` | No | `http://localhost:11434` | URL of Ollama LLM service |
| `OLLAMA_MODEL` | No | `qwen3:4b` | LLM model tag in Ollama |
| `VITE_API_URL` | No | `""` (same origin `/api`) | Cross-domain backend URL (used only in decoupled web builds) |

---

## 🔍 Post-Deployment Verification

Run this quick verification check once deployed:

```bash
# 1. Health check
curl https://your-domain.com/api/health

# Expected response:
# {"status":"ok","service":"TransferGuard Pre-Transfer Safety Platform","version":"2.0.0"}
```

2. Open `https://your-domain.com` in your browser.
3. Create an organization workspace and create a test transaction (e.g. `$480,000 to Acme Supplies`).
4. Verify the deterministic evaluation returns `VERIFY` for the new beneficiary account.
