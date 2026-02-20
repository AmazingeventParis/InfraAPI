const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Plus besoin de mot de passe — l'accès est protégé via la page admin (HTTP Basic Auth)

// Toutes les données sensibles viennent des variables d'environnement
const env = (key, fallback = '') => process.env[key] || fallback;

// ============================================================
// DONNÉES INFRASTRUCTURE
// ============================================================

const infra = {
  serveur: {
    ip: env('SERVER_IP', '217.182.89.133'),
    ssh: env('SERVER_SSH', 'ubuntu@217.182.89.133'),
    os: 'Ubuntu 24.04',
    specs: 'AMD EPYC 4344P, ADVANCE-2',
    disques: '2x NVMe 960GB RAID 1 (878GB utiles)',
    domaine: '*.swipego.app (wildcard DNS vers 217.182.89.133)',
  },

  coolify: {
    url: 'https://coolify.swipego.app',
    token_api: env('COOLIFY_TOKEN'),
    serveur_uuid: 's0cw4wsowg8wkok4wkwsko44',
    projet_uuid: 'c4gw0sos0o4cgws4404s4cwk',
    notes: 'Les FQDN doivent être en https:// — Traefik gère SSL directement',
    deploy_api: 'GET http://217.182.89.133:8000/api/v1/deploy?uuid=<app-uuid>&force=true',
  },

  supabase: {
    dashboard: 'https://supabase.swipego.app',
    api: 'https://supabase-api.swipego.app',
    anon_key: env('SUPABASE_ANON_KEY'),
    service_role_key: env('SUPABASE_SERVICE_ROLE_KEY'),
    dashboard_login: env('SUPABASE_DASHBOARD_LOGIN'),
    dashboard_password: env('SUPABASE_DASHBOARD_PASSWORD'),
    postgresql_password: env('SUPABASE_PG_PASSWORD'),
  },

  github: {
    organisation: 'AmazingeventParis',
    url: 'https://github.com/AmazingeventParis',
    login: 'AmazingeventParis',
    password: env('GITHUB_PASSWORD'),
    repos: 'https://github.com/orgs/AmazingeventParis/repositories',
  },
};

// ============================================================
// ROUTES
// ============================================================

// JSON — pour Claude / machines
app.get('/api', (req, res) => {
  res.json(infra);
});

// Markdown — lisible par humains et Claude
app.get('/', (req, res) => {
  res.type('text/plain; charset=utf-8');
  res.send(generateMarkdown());
});

function generateMarkdown() {
  return `# Infrastructure SwipeGo — Accès Complets

## Serveur OVH Principal
- **IP** : ${infra.serveur.ip}
- **SSH** : ${infra.serveur.ssh}
- **OS** : ${infra.serveur.os}
- **Specs** : ${infra.serveur.specs}
- **Disques** : ${infra.serveur.disques}
- **Domaine** : ${infra.serveur.domaine}

## Coolify (PaaS)
- **URL** : ${infra.coolify.url}
- **Token API** : ${infra.coolify.token_api}
- **Serveur UUID** : ${infra.coolify.serveur_uuid}
- **Projet UUID** : ${infra.coolify.projet_uuid}
- **Deploy** : ${infra.coolify.deploy_api}

## Supabase Self-Hosted
- **Dashboard** : ${infra.supabase.dashboard}
- **API** : ${infra.supabase.api}
- **Anon Key** : ${infra.supabase.anon_key}
- **Service Role Key** : ${infra.supabase.service_role_key}
- **Dashboard Login** : ${infra.supabase.dashboard_login}
- **Dashboard Password** : ${infra.supabase.dashboard_password}
- **PostgreSQL Password** : ${infra.supabase.postgresql_password}

## GitHub
- **Organisation** : ${infra.github.organisation}
- **URL** : ${infra.github.url}
- **Login** : ${infra.github.login}
- **Password** : ${infra.github.password}
- **Tous les repos** : ${infra.github.repos}
`;
}

app.listen(PORT, () => {
  console.log(`InfraAPI running on port ${PORT}`);
});
