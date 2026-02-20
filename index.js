const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const env = (key, fallback = '') => process.env[key] || fallback;

// ============================================================
// INFRASTRUCTURE PARTAGÉE
// ============================================================

const shared = {
  serveur: {
    ip: '217.182.89.133',
    ssh: 'ubuntu@217.182.89.133',
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
  },
  code_server: {
    url: 'https://code.swipego.app',
    password: env('CODE_SERVER_PASSWORD'),
  },
};

// ============================================================
// PROJETS
// ============================================================

const projets = {
  kooki: {
    nom: 'Kooki',
    description: 'Plateforme de cagnottes 0% commission',
    stack: 'NestJS (API) + Next.js 15 (Web) + PostgreSQL + Redis + Stripe + Brevo',
    repo: 'https://github.com/AmazingeventParis/Kooki',
    branche: 'main',
    code_server: 'https://code.swipego.app/?folder=/home/coder/projects/Kooki',
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
    },
  },

  cryptosignals: {
    nom: 'CryptoSignals',
    description: 'Bots de trading V1/V2 + Freqtrade. Dashboard temps reel, signaux.',
    stack: 'Next.js',
    repo: 'https://github.com/AmazingeventParis/CryptoSignals',
    branche: 'main',
    code_server: 'https://code.swipego.app/?folder=/home/coder/projects/CryptoSignals',
    urls: { frontend: 'https://crypto.swipego.app' },
    coolify_uuids: { app: 'mwk444s084kgkcsg8ko80wco' },
  },

  freqtrade: {
    nom: 'Freqtrade MEXC',
    description: 'Bot Freqtrade MEXC Futures. CombinedStrategy EMA + RSI + BB + ADX.',
    stack: 'Python / Freqtrade',
    repo: 'https://github.com/AmazingeventParis/Freqtrade-MEXC',
    branche: 'main',
    code_server: 'https://code.swipego.app/?folder=/home/coder/projects/Freqtrade-MEXC',
    urls: { frontend: 'https://freqtrade.swipego.app' },
    coolify_uuids: { app: 'josos8480cswc84g4ggoo0kc' },
  },

  focusracer: {
    nom: 'Focus Racer',
    description: 'Plateforme photo pour evenements. Upload, galeries, photographes.',
    stack: 'Node.js',
    repo: 'https://github.com/Pixoupix/focus-racer.git',
    branche: 'main',
    code_server: 'https://code.swipego.app/?folder=/home/coder/projects/focus-racer',
    urls: { frontend: 'https://focusracer.swipego.app' },
    coolify_uuids: { app: 'ms440oowockwkso0k0c8okgc' },
  },

  upload: {
    nom: 'Upload Tool',
    description: 'Upload de fichiers. Glisser-deposer, Ctrl+V, lien direct.',
    stack: 'Node.js',
    repo: 'https://github.com/AmazingeventParis/Upload',
    branche: 'main',
    code_server: 'https://code.swipego.app/?folder=/home/coder/projects/Upload',
    urls: { frontend: 'https://upload.swipego.app' },
    coolify_uuids: { app: 'ccogocg0ckcos4kg4o0cg44k' },
  },

  optitourbooth: {
    nom: 'OptiTourBooth',
    description: 'Logiciel de photobooth.',
    stack: 'A definir',
    repo: 'https://github.com/AmazingeventParis/optitourbooth',
    branche: 'main',
    code_server: 'https://code.swipego.app/?folder=/home/coder/projects/optitourbooth',
    urls: {
      frontend: 'https://optitourbooth.swipego.app',
      api: 'https://optitourbooth-api.swipego.app',
    },
    coolify_uuids: {
      frontend: 'hooooowo888gwocoksc8c4gk',
      api: 'kgsgo448os84csgso4o88cwo',
    },
  },

  belotte: {
    nom: 'Belotte',
    description: 'Jeu de belotte en ligne.',
    stack: 'A definir',
    repo: 'https://github.com/AmazingeventParis/Belotte',
    branche: 'main',
    code_server: 'https://code.swipego.app/?folder=/home/coder/projects/Belotte',
    urls: { api: 'https://belotte-api.swipego.app' },
    coolify_uuids: { api: 'f0o0kswgkc4g88c00g8cgg00' },
  },

  alice: {
    nom: 'Alice',
    description: 'Projet Alice.',
    stack: 'A definir',
    repo: 'https://github.com/AmazingeventParis/Alice',
    branche: 'main',
    code_server: 'https://code.swipego.app/?folder=/home/coder/projects/Alice',
  },

  admin: {
    nom: 'Admin Hub',
    description: 'Page admin centralisee SwipeGo.',
    stack: 'HTML statique + Nginx',
    repo: 'https://github.com/AmazingeventParis/Admin',
    branche: 'master',
    code_server: 'https://code.swipego.app/?folder=/home/coder/projects/Admin',
    urls: { frontend: 'https://admin.swipego.app' },
    coolify_uuids: { app: 'hw8owwwwsw0oo4owws840og0' },
  },
};

// ============================================================
// ROUTES
// ============================================================

// Tout — infra + tous les projets
app.get('/api', (req, res) => {
  res.json({ ...shared, projets_disponibles: Object.keys(projets) });
});

// Un projet specifique — infra + projet
app.get('/api/:projet', (req, res) => {
  const projet = projets[req.params.projet];
  if (!projet) {
    return res.status(404).json({
      error: 'Projet non trouve',
      projets_disponibles: Object.keys(projets),
    });
  }
  res.json({
    ...shared,
    projet,
    instructions: `Ouvre le projet dans VS Code Server : ${projet.code_server} — Clone le repo si besoin : git clone ${projet.repo}`,
  });
});

// Liste des projets
app.get('/api/list', (req, res) => {
  const list = Object.entries(projets).map(([key, p]) => ({
    id: key,
    nom: p.nom,
    description: p.description,
    api_url: `https://infra.swipego.app/api/${key}`,
  }));
  res.json(list);
});

// Accueil
app.get('/', (req, res) => {
  const list = Object.entries(projets).map(([key, p]) => `- ${p.nom}: https://infra.swipego.app/api/${key}`).join('\n');
  res.type('text/plain; charset=utf-8');
  res.send(`# InfraAPI SwipeGo\n\nDonnez un de ces liens a votre Claude :\n\n${list}\n\nChaque lien contient les acces infra + les details du projet.\n`);
});

app.listen(PORT, () => {
  console.log(`InfraAPI running on port ${PORT}`);
});
