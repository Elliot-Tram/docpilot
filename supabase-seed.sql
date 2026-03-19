-- Docpilot Demo Seed Data
-- Run this in Supabase SQL Editor after running the schema
-- Uses the first user in auth.users as the owner

DO $$
DECLARE
  v_user_id UUID;
  v_source_id UUID;
  v_ticket_ids UUID[] := ARRAY[]::UUID[];
  v_cluster_ids UUID[] := ARRAY[]::UUID[];
  v_tid UUID;
BEGIN
  -- Get the test user
  SELECT id INTO v_user_id FROM auth.users LIMIT 1;
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'No user found in auth.users. Create a user first.';
  END IF;

  -- ============================================================
  -- SOURCE: Zendesk Production
  -- ============================================================
  INSERT INTO sources (id, user_id, name, type, status, credentials, tickets_imported, last_sync_at)
  VALUES (
    gen_random_uuid(), v_user_id, 'Zendesk Production', 'zendesk', 'connected',
    '{"subdomain": "acme-support", "email": "admin@acme.com", "apiKey": "***"}',
    247, now() - interval '2 hours'
  ) RETURNING id INTO v_source_id;

  -- Sync log
  INSERT INTO sync_logs (source_id, status, tickets_fetched, started_at, completed_at)
  VALUES (v_source_id, 'completed', 247, now() - interval '2 hours 5 minutes', now() - interval '2 hours');

  -- ============================================================
  -- TICKETS (25 realistic SaaS support tickets)
  -- ============================================================

  -- Cluster 1: Problemes de connexion / SSO
  INSERT INTO tickets (source_id, external_id, subject, customer, status, messages, resolved_at)
  VALUES (v_source_id, 'ZD-1201', 'Impossible de me connecter depuis ce matin', 'Marie Dupont', 'solved',
    '[{"role":"customer","text":"Bonjour, depuis ce matin je n''arrive plus a me connecter. Le bouton SSO ne repond pas."},{"role":"agent","text":"Bonjour Marie, nous avons identifie un souci avec le SSO Google. Pouvez-vous essayer de vider votre cache ?"},{"role":"customer","text":"Ca marche, merci !"}]',
    now() - interval '5 days') RETURNING id INTO v_tid;
  v_ticket_ids := v_ticket_ids || v_tid;

  INSERT INTO tickets (source_id, external_id, subject, customer, status, messages, resolved_at)
  VALUES (v_source_id, 'ZD-1218', 'SSO SAML ne fonctionne plus apres mise a jour', 'Pierre Martin', 'solved',
    '[{"role":"customer","text":"Depuis votre mise a jour de vendredi, notre SSO SAML renvoie une erreur 403."},{"role":"agent","text":"Nous avons deploye un fix. Pouvez-vous retester ?"},{"role":"customer","text":"C''est bon, ca refonctionne."}]',
    now() - interval '3 days') RETURNING id INTO v_tid;
  v_ticket_ids := v_ticket_ids || v_tid;

  INSERT INTO tickets (source_id, external_id, subject, customer, status, messages, resolved_at)
  VALUES (v_source_id, 'ZD-1225', 'Erreur "session expiree" toutes les 10 minutes', 'Sophie Bernard', 'solved',
    '[{"role":"customer","text":"Je suis deconnectee toutes les 10 minutes, c''est tres penible."},{"role":"agent","text":"Verifiez que les cookies tiers sont autorises dans votre navigateur. Notre session utilise un cookie secure."},{"role":"customer","text":"Effectivement, c''etait bloque par mon extension. Merci."}]',
    now() - interval '4 days') RETURNING id INTO v_tid;
  v_ticket_ids := v_ticket_ids || v_tid;

  INSERT INTO tickets (source_id, external_id, subject, customer, status, messages, resolved_at)
  VALUES (v_source_id, 'ZD-1230', 'Comment configurer le SSO avec Azure AD ?', 'Thomas Leroy', 'solved',
    '[{"role":"customer","text":"On migre vers Azure AD, comment configurer le SSO ?"},{"role":"agent","text":"Allez dans Parametres > Securite > SSO. Selectionnez SAML 2.0 et entrez votre metadata URL Azure AD."},{"role":"customer","text":"Parfait, ca fonctionne. Merci pour le guide."}]',
    now() - interval '2 days') RETURNING id INTO v_tid;
  v_ticket_ids := v_ticket_ids || v_tid;

  INSERT INTO tickets (source_id, external_id, subject, customer, status, messages, resolved_at)
  VALUES (v_source_id, 'ZD-1241', 'Page blanche apres login SSO Google', 'Julie Moreau', 'solved',
    '[{"role":"customer","text":"Apres le login Google, j''ai une page blanche. Ca fait 2 jours."},{"role":"agent","text":"Essayez en navigation privee. Si ca marche, c''est un conflit d''extension."},{"role":"customer","text":"Oui c''etait bien ca, merci !"}]',
    now() - interval '1 day') RETURNING id INTO v_tid;
  v_ticket_ids := v_ticket_ids || v_tid;

  -- Cluster 2: Facturation / Abonnement
  INSERT INTO tickets (source_id, external_id, subject, customer, status, messages, resolved_at)
  VALUES (v_source_id, 'ZD-1203', 'Double prelevement sur ma carte ce mois-ci', 'Lucas Petit', 'solved',
    '[{"role":"customer","text":"J''ai ete debite 2 fois pour le mois de mars."},{"role":"agent","text":"Nous avons identifie le doublon et lance le remboursement. Il sera visible sous 5 jours ouvrables."},{"role":"customer","text":"Merci pour la reactivite."}]',
    now() - interval '6 days') RETURNING id INTO v_tid;
  v_ticket_ids := v_ticket_ids || v_tid;

  INSERT INTO tickets (source_id, external_id, subject, customer, status, messages, resolved_at)
  VALUES (v_source_id, 'ZD-1210', 'Comment passer du plan Starter au plan Pro ?', 'Emma Richard', 'solved',
    '[{"role":"customer","text":"Je souhaite upgrader notre abonnement au plan Pro."},{"role":"agent","text":"Allez dans Parametres > Abonnement > Changer de plan. Le prorata sera calcule automatiquement."},{"role":"customer","text":"C''est fait, merci !"}]',
    now() - interval '5 days') RETURNING id INTO v_tid;
  v_ticket_ids := v_ticket_ids || v_tid;

  INSERT INTO tickets (source_id, external_id, subject, customer, status, messages, resolved_at)
  VALUES (v_source_id, 'ZD-1222', 'Facture introuvable pour le mois de fevrier', 'Antoine Roux', 'solved',
    '[{"role":"customer","text":"Je ne trouve pas ma facture de fevrier dans l''espace facturation."},{"role":"agent","text":"Les factures sont disponibles dans Parametres > Facturation > Historique. Fevrier devrait y etre."},{"role":"customer","text":"Ah oui, je cherchais au mauvais endroit. Merci."}]',
    now() - interval '3 days') RETURNING id INTO v_tid;
  v_ticket_ids := v_ticket_ids || v_tid;

  INSERT INTO tickets (source_id, external_id, subject, customer, status, messages, resolved_at)
  VALUES (v_source_id, 'ZD-1235', 'Demande de remboursement suite a resiliation', 'Claire Dubois', 'solved',
    '[{"role":"customer","text":"J''ai resilie hier mais j''avais paye pour le mois entier. Puis-je etre remboursee ?"},{"role":"agent","text":"Votre abonnement reste actif jusqu''a la fin de la periode payee. Aucun remboursement au prorata n''est prevu, conformement a nos CGV."},{"role":"customer","text":"D''accord, je comprends."}]',
    now() - interval '2 days') RETURNING id INTO v_tid;
  v_ticket_ids := v_ticket_ids || v_tid;

  -- Cluster 3: Export de donnees / Integrations
  INSERT INTO tickets (source_id, external_id, subject, customer, status, messages, resolved_at)
  VALUES (v_source_id, 'ZD-1205', 'Export CSV plante au-dela de 10 000 lignes', 'Nicolas Garnier', 'solved',
    '[{"role":"customer","text":"L''export CSV echoue a chaque fois qu''on depasse 10 000 lignes."},{"role":"agent","text":"C''est une limitation connue. Utilisez l''export par lot (Parametres > Export > Mode batch) pour les gros volumes."},{"role":"customer","text":"Ca marche en batch, merci du tuyau."}]',
    now() - interval '7 days') RETURNING id INTO v_tid;
  v_ticket_ids := v_ticket_ids || v_tid;

  INSERT INTO tickets (source_id, external_id, subject, customer, status, messages, resolved_at)
  VALUES (v_source_id, 'ZD-1214', 'Integration Slack ne remonte plus les notifications', 'Laura Bonnet', 'solved',
    '[{"role":"customer","text":"Depuis lundi, on ne recoit plus les notifs dans Slack."},{"role":"agent","text":"Reconfigurez le webhook dans Parametres > Integrations > Slack. Le token a probablement expire."},{"role":"customer","text":"Effectivement, le token avait expire. C''est reparti."}]',
    now() - interval '4 days') RETURNING id INTO v_tid;
  v_ticket_ids := v_ticket_ids || v_tid;

  INSERT INTO tickets (source_id, external_id, subject, customer, status, messages, resolved_at)
  VALUES (v_source_id, 'ZD-1228', 'API : erreur 429 rate limit', 'Marc Fontaine', 'solved',
    '[{"role":"customer","text":"On recoit des erreurs 429 sur l''API depuis qu''on a augmente nos appels."},{"role":"agent","text":"Le plan Starter est limite a 100 req/min. Passez au plan Pro pour 1000 req/min, ou implementez un backoff exponentiel."},{"role":"customer","text":"On va upgrader, merci."}]',
    now() - interval '2 days') RETURNING id INTO v_tid;
  v_ticket_ids := v_ticket_ids || v_tid;

  INSERT INTO tickets (source_id, external_id, subject, customer, status, messages, resolved_at)
  VALUES (v_source_id, 'ZD-1237', 'Webhook ne se declenche pas sur les events "update"', 'Sarah Lambert', 'solved',
    '[{"role":"customer","text":"Nos webhooks ne se declenchent que sur les creations, pas les mises a jour."},{"role":"agent","text":"Par defaut, seul l''event ''create'' est actif. Ajoutez ''update'' dans la config du webhook."},{"role":"customer","text":"C''etait ca, merci !"}]',
    now() - interval '1 day') RETURNING id INTO v_tid;
  v_ticket_ids := v_ticket_ids || v_tid;

  -- Cluster 4: Permissions / Roles utilisateurs
  INSERT INTO tickets (source_id, external_id, subject, customer, status, messages, resolved_at)
  VALUES (v_source_id, 'ZD-1207', 'Comment restreindre l''acces a certains dossiers ?', 'David Mercier', 'solved',
    '[{"role":"customer","text":"Je veux que certains utilisateurs ne voient que leur equipe."},{"role":"agent","text":"Utilisez les roles personnalises dans Parametres > Equipe > Roles. Creez un role avec les permissions souhaitees."},{"role":"customer","text":"Super, c''est exactement ce qu''il nous fallait."}]',
    now() - interval '6 days') RETURNING id INTO v_tid;
  v_ticket_ids := v_ticket_ids || v_tid;

  INSERT INTO tickets (source_id, external_id, subject, customer, status, messages, resolved_at)
  VALUES (v_source_id, 'ZD-1219', 'Un utilisateur supprime ne devrait plus avoir acces', 'Isabelle Blanc', 'solved',
    '[{"role":"customer","text":"J''ai supprime un collegue mais il peut encore se connecter."},{"role":"agent","text":"La suppression prend effet a la prochaine expiration de session (max 24h). Pour une revocation immediate, allez dans Securite > Sessions actives."},{"role":"customer","text":"Je l''ai revoque manuellement, c''est bon."}]',
    now() - interval '3 days') RETURNING id INTO v_tid;
  v_ticket_ids := v_ticket_ids || v_tid;

  INSERT INTO tickets (source_id, external_id, subject, customer, status, messages, resolved_at)
  VALUES (v_source_id, 'ZD-1233', 'Difference entre role Admin et Owner ?', 'Philippe Morel', 'solved',
    '[{"role":"customer","text":"Quelle est la difference entre Admin et Owner ?"},{"role":"agent","text":"L''Owner peut supprimer le compte, gerer la facturation et transferer la propriete. L''Admin a toutes les autres permissions."},{"role":"customer","text":"Clair, merci."}]',
    now() - interval '2 days') RETURNING id INTO v_tid;
  v_ticket_ids := v_ticket_ids || v_tid;

  -- Cluster 5: Performance / Lenteurs
  INSERT INTO tickets (source_id, external_id, subject, customer, status, messages, resolved_at)
  VALUES (v_source_id, 'ZD-1209', 'Le tableau de bord met 15 secondes a charger', 'Camille Faure', 'solved',
    '[{"role":"customer","text":"Le dashboard est devenu tres lent depuis la semaine derniere."},{"role":"agent","text":"Nous avons identifie un probleme de performance sur le calcul des stats. Un fix est en cours de deploiement."},{"role":"customer","text":"C''est beaucoup mieux maintenant, merci."}]',
    now() - interval '5 days') RETURNING id INTO v_tid;
  v_ticket_ids := v_ticket_ids || v_tid;

  INSERT INTO tickets (source_id, external_id, subject, customer, status, messages, resolved_at)
  VALUES (v_source_id, 'ZD-1224', 'Timeout sur les recherches avec beaucoup de filtres', 'Vincent Andre', 'solved',
    '[{"role":"customer","text":"Quand j''applique plus de 5 filtres, la recherche timeout systematiquement."},{"role":"agent","text":"Nous recommandons de limiter a 3-4 filtres combines. Nous travaillons sur l''optimisation des requetes complexes."},{"role":"customer","text":"Ok, je vais reduire les filtres en attendant."}]',
    now() - interval '3 days') RETURNING id INTO v_tid;
  v_ticket_ids := v_ticket_ids || v_tid;

  INSERT INTO tickets (source_id, external_id, subject, customer, status, messages, resolved_at)
  VALUES (v_source_id, 'ZD-1239', 'Application mobile tres lente sur 4G', 'Nathalie Simon', 'solved',
    '[{"role":"customer","text":"L''app mobile est quasi inutilisable en 4G."},{"role":"agent","text":"Activez le mode ''donnees reduites'' dans les parametres de l''app. Ca reduit la bande passante de 60%."},{"role":"customer","text":"Enorme difference, merci !"}]',
    now() - interval '1 day') RETURNING id INTO v_tid;
  v_ticket_ids := v_ticket_ids || v_tid;

  -- Extra tickets (no cluster, for realism)
  INSERT INTO tickets (source_id, external_id, subject, customer, status, messages, resolved_at)
  VALUES
    (v_source_id, 'ZD-1211', 'Bug affichage sur Safari', 'Pauline Henry', 'solved',
     '[{"role":"customer","text":"Le menu deroulant ne s''affiche pas sur Safari 17."},{"role":"agent","text":"Merci pour le signalement, un fix sera deploye demain."}]', now() - interval '4 days'),
    (v_source_id, 'ZD-1216', 'Peut-on avoir un mode sombre ?', 'Julien Clement', 'open',
     '[{"role":"customer","text":"Est-ce qu''un dark mode est prevu ?"},{"role":"agent","text":"C''est sur notre roadmap pour Q3. Merci pour la suggestion !"}]', NULL),
    (v_source_id, 'ZD-1227', 'Probleme d''encodage avec les caracteres speciaux', 'Aurelie Gauthier', 'solved',
     '[{"role":"customer","text":"Les accents sont remplaces par des caracteres bizarres dans les exports."},{"role":"agent","text":"Utilisez l''option UTF-8 BOM dans les parametres d''export."}]', now() - interval '3 days'),
    (v_source_id, 'ZD-1232', 'Notification email en double', 'Francois Robin', 'solved',
     '[{"role":"customer","text":"Je recois chaque notification par email en double."},{"role":"agent","text":"Verifiez dans Parametres > Notifications que vous n''avez pas 2 regles actives pour le meme event."}]', now() - interval '2 days'),
    (v_source_id, 'ZD-1244', 'Demande de fonctionnalite : tags personnalises', 'Manon Lefebvre', 'open',
     '[{"role":"customer","text":"On aimerait pouvoir creer nos propres tags pour categoriser les donnees."},{"role":"agent","text":"Bonne idee ! Je remonte ca a l''equipe produit."}]', NULL);

  -- ============================================================
  -- CLUSTERS
  -- ============================================================

  INSERT INTO clusters (user_id, theme, summary, ticket_count, confidence)
  VALUES (v_user_id, 'Problemes de connexion et SSO', 'Les utilisateurs rencontrent regulierement des problemes de connexion lies au SSO (Google, SAML, Azure AD), aux sessions expirees et aux conflits avec les extensions navigateur.', 5, 0.94)
  RETURNING id INTO v_tid;
  v_cluster_ids := v_cluster_ids || v_tid;

  INSERT INTO clusters (user_id, theme, summary, ticket_count, confidence)
  VALUES (v_user_id, 'Facturation et gestion d''abonnement', 'Questions recurrentes sur les changements de plan, les doublons de prelevement, l''acces aux factures et les conditions de remboursement.', 4, 0.91)
  RETURNING id INTO v_tid;
  v_cluster_ids := v_cluster_ids || v_tid;

  INSERT INTO clusters (user_id, theme, summary, ticket_count, confidence)
  VALUES (v_user_id, 'Export de donnees et integrations', 'Problemes lies aux exports CSV volumineux, aux integrations Slack/webhooks et aux limites de l''API (rate limiting).', 4, 0.88)
  RETURNING id INTO v_tid;
  v_cluster_ids := v_cluster_ids || v_tid;

  INSERT INTO clusters (user_id, theme, summary, ticket_count, confidence)
  VALUES (v_user_id, 'Permissions et roles utilisateurs', 'Demandes de clarification sur le systeme de roles (Admin vs Owner), la restriction d''acces par equipe et la revocation des sessions.', 3, 0.87)
  RETURNING id INTO v_tid;
  v_cluster_ids := v_cluster_ids || v_tid;

  INSERT INTO clusters (user_id, theme, summary, ticket_count, confidence)
  VALUES (v_user_id, 'Performance et lenteurs', 'Signalements de lenteurs sur le dashboard, les recherches complexes et l''application mobile en connexion limitee.', 3, 0.85)
  RETURNING id INTO v_tid;
  v_cluster_ids := v_cluster_ids || v_tid;

  -- ============================================================
  -- CLUSTER-TICKET LINKS
  -- ============================================================

  -- Cluster 1: tickets 1-5
  INSERT INTO cluster_tickets (cluster_id, ticket_id) VALUES
    (v_cluster_ids[1], v_ticket_ids[1]),
    (v_cluster_ids[1], v_ticket_ids[2]),
    (v_cluster_ids[1], v_ticket_ids[3]),
    (v_cluster_ids[1], v_ticket_ids[4]),
    (v_cluster_ids[1], v_ticket_ids[5]);

  -- Cluster 2: tickets 6-9
  INSERT INTO cluster_tickets (cluster_id, ticket_id) VALUES
    (v_cluster_ids[2], v_ticket_ids[6]),
    (v_cluster_ids[2], v_ticket_ids[7]),
    (v_cluster_ids[2], v_ticket_ids[8]),
    (v_cluster_ids[2], v_ticket_ids[9]);

  -- Cluster 3: tickets 10-13
  INSERT INTO cluster_tickets (cluster_id, ticket_id) VALUES
    (v_cluster_ids[3], v_ticket_ids[10]),
    (v_cluster_ids[3], v_ticket_ids[11]),
    (v_cluster_ids[3], v_ticket_ids[12]),
    (v_cluster_ids[3], v_ticket_ids[13]);

  -- Cluster 4: tickets 14-16
  INSERT INTO cluster_tickets (cluster_id, ticket_id) VALUES
    (v_cluster_ids[4], v_ticket_ids[14]),
    (v_cluster_ids[4], v_ticket_ids[15]),
    (v_cluster_ids[4], v_ticket_ids[16]);

  -- Cluster 5: tickets 17-19
  INSERT INTO cluster_tickets (cluster_id, ticket_id) VALUES
    (v_cluster_ids[5], v_ticket_ids[17]),
    (v_cluster_ids[5], v_ticket_ids[18]),
    (v_cluster_ids[5], v_ticket_ids[19]);

  -- ============================================================
  -- ARTICLES
  -- ============================================================

  INSERT INTO articles (user_id, cluster_id, title, summary, content, status, category, ticket_count, confidence, created_at)
  VALUES
  (v_user_id, v_cluster_ids[1],
   'Resoudre les problemes de connexion et de SSO',
   'Guide complet pour diagnostiquer et corriger les erreurs de connexion SSO (Google, SAML, Azure AD), les sessions expirees et les pages blanches apres login.',
   '# Resoudre les problemes de connexion et de SSO

## Symptomes courants

- Le bouton SSO ne repond pas ou affiche une erreur
- Page blanche apres la connexion Google/SAML
- Session expiree toutes les 10 minutes
- Erreur 403 apres une mise a jour

## Solutions par cas

### Le SSO Google ne fonctionne pas
1. Videz le cache de votre navigateur (Ctrl+Shift+Suppr)
2. Desactivez temporairement vos extensions navigateur
3. Essayez en navigation privee pour isoler le probleme

### Erreur 403 avec SAML
Si l''erreur apparait apres une mise a jour de notre plateforme :
1. Allez dans **Parametres > Securite > SSO**
2. Re-telechargez le metadata XML depuis votre provider (Azure AD, Okta, etc.)
3. Sauvegardez et retestez

### Configuration SSO Azure AD
1. Allez dans **Parametres > Securite > SSO**
2. Selectionnez **SAML 2.0** comme protocole
3. Entrez votre **Metadata URL** Azure AD
4. Testez la connexion avant de sauvegarder

### Sessions qui expirent trop vite
- Verifiez que les **cookies tiers** sont autorises dans votre navigateur
- Certaines extensions de securite (uBlock, Privacy Badger) peuvent bloquer nos cookies de session
- Notre session utilise un cookie secure : assurez-vous d''acceder au site en HTTPS

## Besoin d''aide supplementaire ?
Contactez le support avec votre message d''erreur exact et le nom de votre provider SSO.',
   'published', 'Authentification', 5, 94,
   now() - interval '1 day'),

  (v_user_id, v_cluster_ids[2],
   'Facturation : changements de plan, factures et remboursements',
   'Tout ce qu''il faut savoir sur la gestion de votre abonnement, l''acces aux factures et la politique de remboursement.',
   '# Facturation : changements de plan, factures et remboursements

## Changer de plan

Pour passer a un plan superieur (ou inferieur) :
1. Allez dans **Parametres > Abonnement > Changer de plan**
2. Selectionnez le nouveau plan souhaite
3. Le **prorata** est calcule automatiquement

Le changement est effectif immediatement. Vous ne payez que la difference pour le reste du mois en cours.

## Acceder a vos factures

Toutes vos factures sont disponibles dans :
**Parametres > Facturation > Historique**

Vous pouvez telecharger chaque facture au format PDF. Si une facture est manquante, contactez le support.

## Double prelevement

Si vous constatez un double prelevement :
1. Verifiez dans l''historique de facturation qu''il ne s''agit pas d''un prorata
2. Contactez le support avec la reference de paiement
3. Le remboursement est traite sous **5 jours ouvrables**

## Politique de remboursement

En cas de resiliation :
- Votre abonnement reste actif jusqu''a la **fin de la periode payee**
- Aucun remboursement au prorata n''est effectue pour la periode restante
- Consultez nos CGV pour plus de details',
   'approved', 'Facturation', 4, 91,
   now() - interval '2 days'),

  (v_user_id, v_cluster_ids[3],
   'Exports, integrations et limites de l''API',
   'Comment gerer les exports volumineux, configurer les integrations Slack/webhooks et respecter les limites de l''API.',
   '# Exports, integrations et limites de l''API

## Export CSV de gros volumes

L''export CSV standard est limite a **10 000 lignes**. Pour les volumes superieurs :
1. Allez dans **Parametres > Export > Mode batch**
2. Selectionnez votre plage de donnees
3. L''export sera traite en arriere-plan et vous recevrez un email avec le lien de telechargement

**Astuce** : pour les exports avec caracteres speciaux (accents), selectionnez l''option **UTF-8 BOM**.

## Integration Slack

Si les notifications Slack ne fonctionnent plus :
1. Allez dans **Parametres > Integrations > Slack**
2. Verifiez que le webhook est toujours actif
3. Si le token a expire, cliquez sur **Reconnecter**

Les tokens Slack expirent periodiquement. Nous recommandons de verifier la connexion une fois par mois.

## Webhooks

Par defaut, seul l''event **create** est actif sur les webhooks. Pour recevoir aussi les mises a jour :
1. Editez votre webhook dans **Parametres > Integrations > Webhooks**
2. Cochez l''event **update** en plus de **create**

## Limites de l''API (rate limiting)

| Plan | Limite |
|------|--------|
| Starter | 100 requetes/min |
| Pro | 1 000 requetes/min |
| Enterprise | 10 000 requetes/min |

Si vous recevez des erreurs **429**, implementez un backoff exponentiel ou passez a un plan superieur.',
   'draft', 'Integrations', 4, 88,
   now() - interval '3 days'),

  (v_user_id, v_cluster_ids[4],
   'Gerer les roles, permissions et acces utilisateurs',
   'Comment configurer les roles personnalises, restreindre l''acces par equipe et revoquer les sessions actives.',
   '# Gerer les roles, permissions et acces utilisateurs

## Roles disponibles

| Role | Peut gerer la facturation | Peut supprimer le compte | Toutes les autres permissions |
|------|--------------------------|-------------------------|-------------------------------|
| **Owner** | Oui | Oui | Oui |
| **Admin** | Non | Non | Oui |
| **Member** | Non | Non | Selon configuration |

## Creer un role personnalise

Pour restreindre l''acces a certains dossiers ou equipes :
1. Allez dans **Parametres > Equipe > Roles**
2. Cliquez sur **Creer un role**
3. Selectionnez les permissions souhaitees
4. Assignez le role aux utilisateurs concernes

## Supprimer un utilisateur

Quand vous supprimez un utilisateur :
- La suppression prend effet a la **prochaine expiration de session** (max 24h)
- Pour une revocation **immediate** : allez dans **Securite > Sessions actives** et revoquez manuellement

## Bonne pratique

Faites un audit des permissions chaque trimestre pour vous assurer que les acces sont toujours pertinents.',
   'draft', 'Administration', 3, 87,
   now() - interval '4 days'),

  (v_user_id, v_cluster_ids[5],
   'Optimiser les performances et reduire les lenteurs',
   'Solutions pour accelerer le chargement du dashboard, les recherches complexes et l''utilisation mobile.',
   '# Optimiser les performances et reduire les lenteurs

## Dashboard lent au chargement

Si le tableau de bord met plus de quelques secondes a charger :
- Verifiez votre connexion internet
- Reduisez la plage de dates affichee (par defaut : 30 derniers jours)
- Nous optimisons regulierement les calculs de stats cote serveur

## Recherches qui timeout

Les recherches complexes (5+ filtres combines) peuvent timeout. Nos recommandations :
- Limitez-vous a **3-4 filtres** combines
- Utilisez des filtres plus specifiques plutot que de cumuler des filtres larges
- L''optimisation des requetes complexes est en cours de developpement

## Application mobile lente

Si l''app est lente en 4G ou connexion limitee :
1. Ouvrez les **parametres de l''app**
2. Activez le **mode donnees reduites**
3. Ce mode reduit la bande passante de **60%** tout en gardant les fonctionnalites essentielles

## Conseil general

Utilisez un navigateur moderne (Chrome, Firefox, Edge dernieres versions) et gardez-le a jour pour beneficier des meilleures performances.',
   'draft', 'Performance', 3, 85,
   now() - interval '5 days');

  RAISE NOTICE 'Seed data inserted successfully for user %', v_user_id;
END $$;
