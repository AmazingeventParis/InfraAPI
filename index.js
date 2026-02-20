const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const PASS = process.env.ACCESS_PASS || 'kooki2025';

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

  projets: {
    kooki: {
      description: 'Plateforme de cagnottes 0% commission',
      stack: 'NestJS (API) + Next.js 15 (Web) + PostgreSQL + Redis + Stripe + Brevo',
      repo: 'https://github.com/AmazingeventParis/Kooki',
      branche: 'main',
      urls: {
        frontend: 'https://kooki.swipego.app',
        api: 'https://kooki-api.swipego.app',
      },
      coolify_uuids: {
        api: 'f0w44gg0skgcso04o0osg8kw',
        web: 'dw048cwkk8swkk8ckwcg4k0w',
        postgresql: 'vowk80sgg8080okkscscwc88',
        redis: 'q4g0ggksw8wkwws08gk8o4kw',
      },
      cles_api: {
        stripe_secret: env('STRIPE_SECRET_KEY'),
        stripe_webhook_secret: env('STRIPE_WEBHOOK_SECRET'),
        stripe_webhook_endpoint_id: env('STRIPE_WEBHOOK_ENDPOINT_ID'),
        brevo_api_key: env('BREVO_API_KEY'),
        email_from: 'aschercohen@gmail.com',
        email_from_name: 'Kooki',
      },
      webhook_stripe: {
        url: 'https://kooki-api.swipego.app/webhooks/stripe',
        note: 'PAS /api/webhooks/stripe — main.ts exclut webhooks/stripe du prefix global api',
        events: ['checkout.session.completed', 'payment_intent.succeeded', 'payment_intent.payment_failed', 'charge.refunded', 'charge.dispute.created', 'account.updated'],
      },
      commandes: {
        deploy_api: `curl -s -H "Authorization: Bearer ${env('COOLIFY_TOKEN')}" "http://217.182.89.133:8000/api/v1/deploy?uuid=f0w44gg0skgcso04o0osg8kw&force=true"`,
        deploy_web: `curl -s -H "Authorization: Bearer ${env('COOLIFY_TOKEN')}" "http://217.182.89.133:8000/api/v1/deploy?uuid=dw048cwkk8swkk8ckwcg4k0w&force=true"`,
        logs_api: `curl -s -H "Authorization: Bearer ${env('COOLIFY_TOKEN')}" "http://217.182.89.133:8000/api/v1/applications/f0w44gg0skgcso04o0osg8kw/logs?limit=50"`,
      },
    },

  },
};

// ============================================================
// ROUTES
// ============================================================

// JSON — pour Claude / machines
app.get('/:pass/api', (req, res) => {
  if (req.params.pass !== PASS) return res.status(404).send('Not found');
  res.json(infra);
});

// JSON — un projet spécifique
app.get('/:pass/api/:projet', (req, res) => {
  if (req.params.pass !== PASS) return res.status(404).send('Not found');
  const projet = infra.projets[req.params.projet];
  if (!projet) {
    return res.status(404).json({
      error: 'Projet non trouvé',
      projets_disponibles: Object.keys(infra.projets),
    });
  }
  res.json({
    serveur: infra.serveur,
    coolify: infra.coolify,
    supabase: infra.supabase,
    projet,
  });
});

// Markdown — lisible par humains et Claude
app.get('/:pass', (req, res) => {
  if (req.params.pass !== PASS) return res.status(404).send('Not found');
  res.type('text/plain; charset=utf-8');
  res.send(generateMarkdown());
});

// Tout le reste → 404
app.get('*', (req, res) => {
  res.status(404).send('Not found');
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

---

## Projets

### Kooki — Plateforme de cagnottes 0% commission
- **Stack** : ${infra.projets.kooki.stack}
- **Repo** : ${infra.projets.kooki.repo}
- **Frontend** : ${infra.projets.kooki.urls.frontend}
- **API** : ${infra.projets.kooki.urls.api}
- **Coolify UUIDs** : API=${infra.projets.kooki.coolify_uuids.api} | Web=${infra.projets.kooki.coolify_uuids.web} | PG=${infra.projets.kooki.coolify_uuids.postgresql} | Redis=${infra.projets.kooki.coolify_uuids.redis}
- **Stripe Secret** : ${infra.projets.kooki.cles_api.stripe_secret}
- **Stripe Webhook Secret** : ${infra.projets.kooki.cles_api.stripe_webhook_secret}
- **Brevo API Key** : ${infra.projets.kooki.cles_api.brevo_api_key}
- **Webhook Stripe** : ${infra.projets.kooki.webhook_stripe.url}

#### Commandes Deploy Kooki
\`\`\`bash
# Deploy API
${infra.projets.kooki.commandes.deploy_api}

# Deploy Web
${infra.projets.kooki.commandes.deploy_web}

# Logs API
${infra.projets.kooki.commandes.logs_api}
\`\`\`

`;
}

app.listen(PORT, () => {
  console.log(`InfraAPI running on port ${PORT}`);
});
