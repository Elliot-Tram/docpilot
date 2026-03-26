export type ArticleStatus = "draft" | "approved" | "published" | "rejected";

export interface SourceTicket {
  id: string;
  subject: string;
  customer: string;
  date: string;
}

export interface SlackThread {
  channel: string;
  docpilotMessage: string;
  expert: { name: string; role: string; avatar: string };
  expertResponse: string | null;
  aiIntegrated: boolean;
  techValidated: boolean;
  csmValidated: boolean;
}

export interface SuggestedArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  status: ArticleStatus;
  category: string;
  ticketCount: number;
  sourceTickets: SourceTicket[];
  createdAt: string;
  confidence: number;
  collaboration?: SlackThread;
}

export type SourceType = "zendesk" | "intercom" | "freshdesk" | "hubspot" | "claap" | "slack";

export interface ConnectedSource {
  id: string;
  name: string;
  type: SourceType;
  status: "connected" | "syncing" | "disconnected";
  ticketsImported: number;
  lastSync: string;
  metricLabel?: string;
}

export const mockSources: ConnectedSource[] = [
  {
    id: "src-1",
    name: "Intercom — Allo Support",
    type: "intercom",
    status: "connected",
    ticketsImported: 2847,
    lastSync: "Il y a 2 heures",
  },
  {
    id: "src-2",
    name: "Zendesk — Allo Enterprise",
    type: "zendesk",
    status: "connected",
    ticketsImported: 1203,
    lastSync: "Il y a 6 heures",
  },
  {
    id: "src-3",
    name: "HubSpot CRM",
    type: "hubspot",
    status: "connected",
    ticketsImported: 12450,
    lastSync: "Il y a 1 heure",
    metricLabel: "contacts synchronises",
  },
  {
    id: "src-4",
    name: "Claap — Appels support",
    type: "claap",
    status: "connected",
    ticketsImported: 342,
    lastSync: "Il y a 3 heures",
    metricLabel: "appels analyses",
  },
];

export const mockArticles: SuggestedArticle[] = [
  {
    id: "art-1",
    title: "Configurer le transfert d'appel vers un mobile",
    summary:
      "63 tickets ce mois-ci concernent le transfert d'appel. Les utilisateurs ne trouvent pas le parametre dans l'interface ou configurent mal la redirection vers leur numero personnel.",
    content: `## Configurer le transfert d'appel vers un mobile

Tu veux recevoir tes appels professionnels sur ton mobile quand tu n'es pas au bureau ? Voici comment configurer le transfert d'appel en quelques clics.

### Activer le transfert d'appel

1. Va dans **Parametres > Telephonie > Transfert d'appel**
2. Active l'option **"Transfert vers un numero externe"**
3. Saisis ton numero de mobile au format international (+33 6 XX XX XX XX)
4. Choisis le delai avant transfert (par defaut : 20 secondes)
5. Clique sur **Enregistrer**

### Les differents modes de transfert

| Mode | Description | Quand l'utiliser |
|------|-------------|------------------|
| Immediat | L'appel va directement sur ton mobile | Tu es en deplacement toute la journee |
| Apres delai | L'appel sonne d'abord sur Allo, puis transfere | Tu veux repondre sur Allo en priorite |
| Si indisponible | Transfere uniquement si tu es hors ligne | En complement de ton poste principal |

### Transfert et SVI

Si tu utilises un SVI (Serveur Vocal Interactif), le transfert s'applique apres le routage du SVI. Le client passe d'abord par le menu vocal, puis l'appel est redirige vers ton mobile si tu ne reponds pas sur Allo.

### Problemes courants

**"Je ne recois pas les appels transferes"**
- Verifie que ton numero est au bon format (avec l'indicatif pays)
- Verifie que ton mobile n'est pas en mode "Ne pas deranger"
- Le transfert ne fonctionne pas vers les numeros courts ou surtaxes

**"L'appelant entend une tonalite longue"**
- Reduis le delai de transfert a 15 secondes
- Active le message d'attente dans Parametres > Messages vocaux`,
    status: "draft",
    category: "Telephonie",
    ticketCount: 63,
    sourceTickets: [
      { id: "t-101", subject: "Comment transférer mes appels sur mon portable ?", customer: "Marc Dupont — BestDrive", date: "22 mars 2026" },
      { id: "t-102", subject: "Le transfert d'appel ne fonctionne pas", customer: "Sarah Cohen — Immo+", date: "21 mars 2026" },
      { id: "t-103", subject: "Appels pas redirigés quand je suis absent", customer: "Philippe Martin — TechFlow", date: "20 mars 2026" },
    ],
    createdAt: "23 mars 2026",
    confidence: 96,
    collaboration: {
      channel: "#support-produit",
      docpilotMessage: "Nouvel article suggere : \"Configurer le transfert d'appel vers un mobile\" (63 tickets ce mois). Draft genere. @thomas.music peux-tu valider la partie technique sur les transferts vers numeros courts ?",
      expert: { name: "Thomas M.", role: "Ingenieur VoIP", avatar: "TM" },
      expertResponse: "Le draft est correct. Juste preciser que le transfert ne fonctionne pas vers les numeros courts (3xxx) ni les numeros surtaxes (08xx). Et le delai par defaut c'est 25s, pas 20s.",
      aiIntegrated: true,
      techValidated: true,
      csmValidated: false,
    },
  },
  {
    id: "art-2",
    title: "Resoudre les problemes de qualite audio",
    summary:
      "51 tickets lies a la qualite audio : echo, gresillements, coupures. Principalement des problemes de bande passante et de configuration reseau.",
    content: `## Resoudre les problemes de qualite audio

Des problemes de son pendant tes appels ? Echo, gresillements, voix saccadee ? Voici les causes les plus frequentes et comment les corriger.

### Diagnostic rapide

Avant tout, identifie le type de probleme :

- **Echo** : tu entends ta propre voix en retour
- **Gresillements / bruit de fond** : son parasite pendant l'appel
- **Voix saccadee / coupures** : le son se coupe par intermittence
- **Latence** : decalage entre ce que tu dis et ce que l'autre entend

### Solutions par probleme

#### Echo

1. Baisse le volume de tes haut-parleurs (cause n°1 de l'echo)
2. Utilise un casque avec micro plutot que les haut-parleurs du PC
3. Desactive le "boost du microphone" dans les parametres audio de ton OS

#### Voix saccadee ou coupures

C'est presque toujours un probleme reseau :

1. **Teste ta connexion** : tu as besoin d'au moins 100 kbps en upload par appel simultane
2. **Passe en filaire** : le Wi-Fi est la premiere cause de coupures VoIP
3. **Active la QoS** sur ton routeur : priorise le trafic VoIP (ports UDP 10000-20000)
4. **Desactive le VPN** pendant les appels si possible (le VPN ajoute de la latence)

#### Gresillements

- Verifie que ton casque/micro n'est pas defectueux (teste avec un autre)
- Mets a jour les drivers audio de ton ordinateur
- Ferme les applications gourmandes en bande passante (streaming, telechargements)

### Parametres Allo a verifier

Va dans **Parametres > Audio** et verifie :
- Codec audio : **Opus** (recommande) plutot que G.711
- Suppression du bruit : **Activee**
- Controle automatique du gain : **Active**

### Toujours un probleme ?

Si le souci persiste apres ces verifications, contacte le support avec :
- Un test de debit (speedtest.net)
- Le type de connexion (Wi-Fi / Ethernet / 4G)
- Le navigateur et sa version`,
    status: "draft",
    category: "Depannage",
    ticketCount: 51,
    sourceTickets: [
      { id: "t-201", subject: "Qualité son terrible depuis ce matin", customer: "Julie Fernandez — Recruteo", date: "21 mars 2026" },
      { id: "t-202", subject: "Echo permanent sur tous mes appels", customer: "David Berger — Agence Pilot", date: "20 mars 2026" },
      { id: "t-203", subject: "Son coupé toutes les 10 secondes", customer: "Nadia Khelifi — LegalStart", date: "19 mars 2026" },
    ],
    createdAt: "22 mars 2026",
    confidence: 93,
    collaboration: {
      channel: "#support-produit",
      docpilotMessage: "Nouvel article suggere : \"Resoudre les problemes de qualite audio\" (51 tickets). Draft genere. @alex.infra peux-tu confirmer les ports UDP et les recommandations QoS ?",
      expert: { name: "Alex R.", role: "Ingenieur Infrastructure", avatar: "AR" },
      expertResponse: null,
      aiIntegrated: false,
      techValidated: false,
      csmValidated: false,
    },
  },
  {
    id: "art-3",
    title: "Connecter Allo a HubSpot CRM",
    summary:
      "45 tickets sur l'integration HubSpot. Les utilisateurs veulent synchroniser les appels dans HubSpot et voir les fiches contacts pendant les appels.",
    content: `## Connecter Allo a HubSpot CRM

L'integration HubSpot te permet de voir la fiche client pendant l'appel, de logger automatiquement chaque appel dans le CRM, et de lancer des appels directement depuis HubSpot.

### Installer l'integration

1. Va dans **Parametres > Integrations > HubSpot**
2. Clique sur **"Connecter HubSpot"**
3. Autorise Allo dans la fenetre HubSpot qui s'ouvre
4. Choisis les proprietes a synchroniser (contacts, entreprises, deals)
5. Clique sur **"Activer la synchronisation bidirectionnelle"**

### Ce qui se synchronise automatiquement

| Donnee | Direction | Frequence |
|--------|-----------|-----------|
| Appels entrants/sortants | Allo → HubSpot | Temps reel |
| Fiche contact (nom, tel, email) | HubSpot → Allo | Toutes les 15 min |
| Notes d'appel | Allo → HubSpot | A la fin de l'appel |
| Enregistrements d'appel | Allo → HubSpot | Temps reel |
| Statut du deal | HubSpot → Allo | Toutes les 15 min |

### Le pop-up de fiche contact

Quand un contact HubSpot t'appelle, Allo affiche automatiquement sa fiche :
- Nom, entreprise, role
- Dernier appel et sa duree
- Deal en cours et son montant
- Notes precedentes

### Problemes courants

**"Mes appels ne remontent pas dans HubSpot"**
- Verifie que la synchronisation est bien active dans Parametres > Integrations
- L'utilisateur Allo doit etre associe a un utilisateur HubSpot (Parametres > Mapping utilisateurs)

**"La fiche contact ne s'affiche pas"**
- Le numero de l'appelant doit exister dans HubSpot au format international
- Verifie que tu as les droits de lecture sur les contacts HubSpot`,
    status: "draft",
    category: "Integrations",
    ticketCount: 45,
    sourceTickets: [
      { id: "t-301", subject: "Intégration HubSpot ne synchronise plus les appels", customer: "Antoine Moreau — SalesUp", date: "20 mars 2026" },
      { id: "t-302", subject: "Comment voir la fiche client HubSpot pendant l'appel ?", customer: "Camille Leroy — GrowthLab", date: "19 mars 2026" },
      { id: "t-303", subject: "Les enregistrements ne remontent pas dans HubSpot", customer: "Romain Petit — FinanceFlow", date: "18 mars 2026" },
    ],
    createdAt: "21 mars 2026",
    confidence: 91,
    collaboration: {
      channel: "#support-produit",
      docpilotMessage: "Nouvel article suggere : \"Connecter Allo a HubSpot CRM\" (45 tickets). Draft genere. @camille.integ peux-tu verifier les etapes de configuration OAuth et le mapping des proprietes ?",
      expert: { name: "Camille D.", role: "Lead Integrations", avatar: "CD" },
      expertResponse: "C'est bon mais il faut ajouter que le mapping custom des proprietes n'est dispo que sur le plan Pro HubSpot. Et les enregistrements d'appel necessitent l'option \"Sales Hub\" activee.",
      aiIntegrated: true,
      techValidated: false,
      csmValidated: false,
    },
  },
  {
    id: "art-4",
    title: "Parametrer le SVI (Serveur Vocal Interactif)",
    summary:
      "38 tickets sur la configuration du SVI. Les clients veulent personnaliser le menu vocal mais trouvent l'interface complexe.",
    content: `## Parametrer le SVI (Serveur Vocal Interactif)

Le SVI permet d'accueillir tes appelants avec un menu vocal automatise : "Tapez 1 pour le service commercial, 2 pour le support..." Voici comment le configurer.

### Creer un nouveau SVI

1. Va dans **Parametres > Telephonie > SVI**
2. Clique sur **"Creer un SVI"**
3. Choisis un numero a associer au SVI
4. Configure ton arborescence (voir ci-dessous)

### Configurer l'arborescence

L'editeur visuel te permet de creer ton menu par glisser-deposer :

- **Message d'accueil** : enregistre ou tape ton texte (synthese vocale)
- **Choix DTMF** : ajoute les touches 1-9 et associe une action a chacune
- **Actions disponibles** :
  - Transferer vers un utilisateur ou une equipe
  - Transferer vers une file d'attente
  - Jouer un message puis raccrocher
  - Sous-menu (SVI multi-niveau)
  - Messagerie vocale

### Bonnes pratiques

- Limite ton menu a **4 choix maximum** (au-dela, les appelants raccrochent)
- Place l'option la plus demandee en **touche 1**
- Propose toujours une option **"Parler a un conseiller"** (touche 0)
- Enregistre un message avec une voix humaine plutot que la synthese vocale

### Horaires et jours feries

Tu peux configurer des comportements differents selon les horaires :
- **Heures ouvrables** : SVI normal avec transfert vers l'equipe
- **Hors horaires** : message de fermeture + messagerie vocale
- **Jours feries** : message specifique

Va dans **SVI > Horaires** pour configurer les plages.`,
    status: "approved",
    category: "Telephonie",
    ticketCount: 38,
    sourceTickets: [
      { id: "t-401", subject: "Comment créer un menu vocal pour l'accueil ?", customer: "Marie Lambert — Assurancia", date: "18 mars 2026" },
      { id: "t-402", subject: "SVI : comment ajouter un sous-menu ?", customer: "Benoit Garnier — LogiTrans", date: "17 mars 2026" },
    ],
    createdAt: "19 mars 2026",
    confidence: 89,
    collaboration: {
      channel: "#support-produit",
      docpilotMessage: "Article suggere : \"Parametrer le SVI\" (38 tickets). Draft genere et valide par l'equipe technique.",
      expert: { name: "Marie L.", role: "Product Manager Telephonie", avatar: "ML" },
      expertResponse: "Tout est bon, j'ai juste reformule la partie sur les horaires d'ouverture pour que ce soit plus clair.",
      aiIntegrated: true,
      techValidated: true,
      csmValidated: true,
    },
  },
  {
    id: "art-5",
    title: "Demander la portabilite de son numero",
    summary:
      "34 tickets sur la portabilite. Les clients veulent garder leur ancien numero en passant chez Allo mais ne connaissent pas la procedure ni les delais.",
    content: `## Demander la portabilite de son numero

Tu veux garder ton numero de telephone actuel en passant chez Allo ? C'est possible grace a la portabilite. Allo s'occupe de tout, tu n'as rien a faire aupres de ton ancien operateur.

### Comment ca marche ?

1. Va dans **Parametres > Numeros > Portabilite**
2. Clique sur **"Demander une portabilite"**
3. Remplis le formulaire :
   - Le numero a porter (au format international)
   - Le nom du titulaire actuel (tel qu'il apparait sur la facture)
   - Le RIO (Releve d'Identite Operateur) — voir ci-dessous
   - Une copie de ta derniere facture
4. Valide la demande

### Obtenir ton RIO

- **Ligne fixe** : appelle le **0 800 00 51 84** depuis ta ligne fixe
- **Ligne mobile** : appelle le **3179** depuis ta ligne mobile
- Tu recevras un SMS avec ton code RIO (12 caracteres)

### Delais

| Type de numero | Delai moyen | Delai max |
|----------------|-------------|-----------|
| Fixe geographique (01-05) | 7 jours ouvrables | 10 jours ouvrables |
| Fixe non-geo (09) | 7 jours ouvrables | 10 jours ouvrables |
| Mobile (06/07) | 3 jours ouvrables | 5 jours ouvrables |

### Pendant la portabilite

- Ton ancien numero continue de fonctionner normalement
- Le jour du basculement, tu recois un email de confirmation
- L'interruption de service est de quelques minutes maximum
- Si un probleme survient, le support est joignable au 01 XX XX XX XX

### FAQ portabilite

**"Est-ce que je peux porter plusieurs numeros en meme temps ?"**
Oui, tu peux faire une demande groupee. Contacte le support pour les portabilites de plus de 5 numeros.

**"Est-ce que ca coute quelque chose ?"**
Non, la portabilite est gratuite chez Allo.`,
    status: "draft",
    category: "Numeros",
    ticketCount: 34,
    sourceTickets: [
      { id: "t-501", subject: "Combien de temps pour porter mon numéro fixe ?", customer: "Claire Durand — Cabinet Avenir", date: "19 mars 2026" },
      { id: "t-502", subject: "Portabilité en cours depuis 2 semaines, toujours rien", customer: "Thomas Blanc — MediaPro", date: "18 mars 2026" },
      { id: "t-503", subject: "C'est quoi le RIO et comment je le trouve ?", customer: "Sophie Laurent — FoodTech SAS", date: "17 mars 2026" },
    ],
    createdAt: "20 mars 2026",
    confidence: 92,
  },
  {
    id: "art-6",
    title: "Configurer la Receptionniste IA",
    summary:
      "29 tickets sur la Receptionniste IA. Les clients veulent l'activer mais ne savent pas comment la configurer ni quelles informations lui donner.",
    content: `## Configurer la Receptionniste IA

La Receptionniste IA repond a tes appels quand tu n'es pas disponible. Elle comprend les demandes en langage naturel, qualifie l'appelant, et transfere vers la bonne personne ou prend un message.

### Activer la Receptionniste IA

1. Va dans **Parametres > Receptionniste IA**
2. Active le toggle **"Receptionniste IA"**
3. Choisis quand elle intervient :
   - Toujours (elle repond a tous les appels)
   - Si pas de reponse (apres X secondes)
   - Hors horaires uniquement

### Personnaliser le comportement

#### Message d'accueil
Tape ton message d'accueil personnalise. La Receptionniste le lira au debut de chaque appel.

> Exemple : "Bonjour et bienvenue chez [Nom de ta boite]. Comment puis-je vous aider ?"

#### Informations de l'entreprise
Donne a la Receptionniste les infos dont elle a besoin pour repondre :
- Horaires d'ouverture
- Adresse physique
- Services proposes
- FAQ courantes (jusqu'a 20 questions/reponses)

#### Regles de transfert
Configure vers qui la Receptionniste transfere selon le sujet :
- Questions commerciales → Equipe Sales
- Support technique → Equipe Support
- Facturation → Comptabilite
- Autres → Message vocal

### Bonnes pratiques

- Fournis des informations **precises et a jour** : la Receptionniste ne peut pas inventer
- Ajoute les **noms des personnes cles** que les appelants demandent souvent
- Teste la Receptionniste en l'appelant toi-meme avant de la mettre en production
- Consulte les **transcriptions** dans l'onglet Historique pour ameliorer les reponses`,
    status: "published",
    category: "Receptionniste IA",
    ticketCount: 29,
    sourceTickets: [
      { id: "t-601", subject: "Comment activer la réceptionniste IA ?", customer: "Nicolas Faure — AuditPlus", date: "17 mars 2026" },
      { id: "t-602", subject: "La réceptionniste IA donne des mauvaises infos", customer: "Isabelle Girard — EventPro", date: "16 mars 2026" },
    ],
    createdAt: "18 mars 2026",
    confidence: 94,
  },
  {
    id: "art-7",
    title: "Comprendre sa facture et changer de forfait",
    summary:
      "27 tickets sur la facturation. Questions recurrentes sur le detail des lignes, les options facturees, et comment upgrader ou downgrader son forfait.",
    content: `## Comprendre ta facture et changer de forfait

### Acceder a tes factures

1. Va dans **Parametres > Facturation > Historique**
2. Chaque facture est telechargeable en PDF
3. Les factures sont emises le 1er de chaque mois

### Detail des lignes de ta facture

- **Abonnement** : le montant de ton forfait (Starter, Pro ou Enterprise)
- **Utilisateurs supplementaires** : facturation par siege au-dela de ton forfait
- **Numeros supplementaires** : chaque numero au-dela du quota inclus
- **Appels hors forfait** : appels internationaux ou vers des numeros speciaux
- **Options** : enregistrement des appels, Receptionniste IA, etc.

### Changer de forfait

1. Va dans **Parametres > Facturation > Mon forfait**
2. Clique sur **"Changer de forfait"**
3. Choisis ton nouveau forfait
4. Le changement prend effet immediatement

**Upgrade** : la difference est facturee au prorata du mois en cours.
**Downgrade** : le changement prend effet au prochain cycle de facturation.

### Modes de paiement acceptes

- Carte bancaire (Visa, Mastercard, Amex)
- Prelevement SEPA (a partir du plan Pro)
- Virement bancaire (sur devis, plan Enterprise uniquement)

### Obtenir un avoir ou un remboursement

Contacte le support avec ton numero de facture. Les remboursements sont traites sous 5 jours ouvrables sur le moyen de paiement d'origine.`,
    status: "draft",
    category: "Facturation",
    ticketCount: 27,
    sourceTickets: [
      { id: "t-701", subject: "Je ne comprends pas la ligne 'options' sur ma facture", customer: "Pierre Roux — ComptaLib", date: "18 mars 2026" },
      { id: "t-702", subject: "Comment passer du plan Starter au Pro ?", customer: "Laura Mercier — DesignHub", date: "17 mars 2026" },
    ],
    createdAt: "19 mars 2026",
    confidence: 88,
  },
  {
    id: "art-8",
    title: "Ajouter et gerer les utilisateurs de l'equipe",
    summary:
      "22 tickets sur la gestion des utilisateurs. Questions sur l'ajout de collegues, les roles, et la gestion des droits d'acces.",
    content: `## Ajouter et gerer les utilisateurs de l'equipe

### Inviter un nouvel utilisateur

1. Va dans **Parametres > Equipe > Utilisateurs**
2. Clique sur **"Inviter un utilisateur"**
3. Saisis son adresse email
4. Choisis son role (voir ci-dessous)
5. Assigne-lui un numero de telephone ou une extension

L'utilisateur recoit un email d'invitation et peut se connecter immediatement.

### Roles disponibles

| Role | Droits |
|------|--------|
| Admin | Acces complet : parametres, facturation, utilisateurs, integrations |
| Manager | Gestion de l'equipe, acces aux stats et enregistrements |
| Agent | Appels entrants/sortants, acces a son historique uniquement |
| Viewer | Consultation des stats et tableaux de bord (lecture seule) |

### Gerer les extensions

Chaque utilisateur peut avoir :
- Un **numero direct** (DID) : numero attitre que les clients composent
- Une **extension interne** : numero court (ex: 101) pour les transferts internes
- Les deux en meme temps

### Desactiver un utilisateur

1. Va dans **Parametres > Equipe > Utilisateurs**
2. Clique sur l'utilisateur a desactiver
3. Clique sur **"Desactiver le compte"**

L'utilisateur perd immediatement l'acces. Son numero peut etre reassigne a un autre utilisateur. Son historique d'appels est conserve.`,
    status: "approved",
    category: "Administration",
    ticketCount: 22,
    sourceTickets: [
      { id: "t-801", subject: "Comment ajouter un collègue sur notre compte ?", customer: "Maxime Nguyen — StartupLab", date: "16 mars 2026" },
      { id: "t-802", subject: "Différence entre rôle Admin et Manager ?", customer: "Emma Petit — AgenceNova", date: "15 mars 2026" },
    ],
    createdAt: "17 mars 2026",
    confidence: 86,
  },
  {
    id: "art-9",
    title: "Utiliser l'application mobile Allo",
    summary:
      "19 tickets sur l'appli mobile. Problemes de notifications, de connexion, et questions sur les fonctionnalites disponibles en mobilite.",
    content: `## Utiliser l'application mobile Allo

L'app mobile Allo te permet de passer et recevoir des appels professionnels depuis ton smartphone, ou que tu sois.

### Telecharger et se connecter

1. Telecharge l'app **Allo** sur l'App Store (iOS) ou le Google Play Store (Android)
2. Ouvre l'app et connecte-toi avec tes identifiants Allo habituels
3. Autorise les notifications et l'acces au micro quand l'app le demande

### Fonctionnalites disponibles sur mobile

- Appels entrants et sortants (via Internet ou 4G/5G)
- Transfert d'appel vers un collegue
- Acces au repertoire de l'entreprise
- Historique des appels
- Messagerie vocale
- Chat interne avec l'equipe
- Statut de disponibilite (disponible / absent / ne pas deranger)

### Optimiser la qualite d'appel sur mobile

- Privilegie le **Wi-Fi** quand c'est possible (meilleure qualite que la 4G)
- Active le mode **"economie de donnees"** dans Parametres > Audio si ta connexion est faible
- Ferme les applis gourmandes en arriere-plan pendant les appels

### Notifications qui n'arrivent pas ?

**Sur iOS :**
- Va dans Reglages > Notifications > Allo et active toutes les notifications
- Desactive le mode Concentration / Ne pas deranger
- L'app doit rester en arriere-plan (ne pas la forcer a quitter)

**Sur Android :**
- Va dans Parametres > Applications > Allo > Batterie > "Pas de restriction"
- Desactive l'optimisation de batterie pour Allo
- Verifie que les notifications sont autorisees dans les parametres de l'app`,
    status: "published",
    category: "Application mobile",
    ticketCount: 19,
    sourceTickets: [
      { id: "t-901", subject: "Je ne reçois pas les appels sur l'appli mobile", customer: "Lea Fournier — Nomad Agency", date: "15 mars 2026" },
      { id: "t-902", subject: "Qualité son horrible sur l'appli Android", customer: "Kevin Morel — InstallPro", date: "14 mars 2026" },
    ],
    createdAt: "16 mars 2026",
    confidence: 85,
  },
  {
    id: "art-10",
    title: "Configurer les webhooks et l'API Allo",
    summary:
      "16 tickets de clients sur le plan Pro/Enterprise qui veulent integrer Allo a leur outil interne via l'API ou recevoir des evenements en temps reel.",
    content: `## Configurer les webhooks et l'API Allo

L'API Allo et les webhooks te permettent d'integrer la telephonie dans tes propres outils : CRM maison, dashboard interne, ou n'importe quelle application.

### Obtenir ta cle API

1. Va dans **Parametres > Developpeurs > API**
2. Clique sur **"Generer une cle API"**
3. Copie ta cle et conserve-la en securite (elle ne sera plus affichee)

> Ta cle API donne acces a toutes les donnees de ton compte. Ne la partage jamais publiquement.

### Endpoints principaux

| Endpoint | Methode | Description |
|----------|---------|-------------|
| /v1/calls | GET | Liste des appels (avec filtres) |
| /v1/calls/{id} | GET | Detail d'un appel |
| /v1/calls | POST | Lancer un appel sortant |
| /v1/users | GET | Liste des utilisateurs |
| /v1/contacts | GET/POST | Gestion du repertoire |
| /v1/recordings/{id} | GET | Recuperer un enregistrement |

### Configurer un webhook

Les webhooks envoient un POST HTTP a ton URL quand un evenement se produit.

1. Va dans **Parametres > Developpeurs > Webhooks**
2. Clique sur **"Ajouter un webhook"**
3. Saisis l'URL de ton endpoint
4. Choisis les evenements a ecouter :
   - \`call.started\` — un appel demarre
   - \`call.ended\` — un appel se termine (inclut la duree)
   - \`call.missed\` — un appel manque
   - \`voicemail.received\` — nouveau message vocal
   - \`recording.ready\` — enregistrement disponible

### Authentification des webhooks

Chaque requete webhook inclut un header \`X-Allo-Signature\` que tu peux verifier avec ton secret webhook pour t'assurer que la requete vient bien d'Allo.

### Limites de l'API

- **Rate limit** : 100 requetes par minute par cle API
- **Webhooks** : 5 secondes de timeout, 3 tentatives en cas d'echec
- **Enregistrements** : liens de telechargement valables 1 heure`,
    status: "published",
    category: "Developpeurs",
    ticketCount: 16,
    sourceTickets: [
      { id: "t-1001", subject: "Documentation API pour intégrer avec notre CRM interne", customer: "Alexandre Chen — DataCorp", date: "14 mars 2026" },
    ],
    createdAt: "15 mars 2026",
    confidence: 90,
  },
];

export const mockStats = {
  ticketsAnalyzed: 4050,
  articlesGenerated: 10,
  gapsDetected: 6,
  ticketsDeflected: 482,
};
