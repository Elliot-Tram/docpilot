export type ArticleStatus = "draft" | "approved" | "published" | "rejected";

export interface SourceTicket {
  id: string;
  subject: string;
  customer: string;
  date: string;
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
}

export interface ConnectedSource {
  id: string;
  name: string;
  type: "zendesk" | "intercom" | "freshdesk";
  status: "connected" | "syncing" | "disconnected";
  ticketsImported: number;
  lastSync: string;
}

export const mockSources: ConnectedSource[] = [
  {
    id: "src-1",
    name: "Zendesk Production",
    type: "zendesk",
    status: "connected",
    ticketsImported: 2847,
    lastSync: "Il y a 2 heures",
  },
  {
    id: "src-2",
    name: "Intercom — App principale",
    type: "intercom",
    status: "syncing",
    ticketsImported: 1203,
    lastSync: "En cours…",
  },
];

export const mockArticles: SuggestedArticle[] = [
  {
    id: "art-1",
    title: "Comment réinitialiser son mot de passe",
    summary:
      "47 tickets ce mois-ci concernent la réinitialisation de mot de passe. Aucun article existant ne couvre cette procédure de manière détaillée.",
    content: `## Comment réinitialiser votre mot de passe

Si vous avez oublié votre mot de passe ou souhaitez le modifier, suivez ces étapes :

### Depuis la page de connexion

1. Cliquez sur **"Mot de passe oublié ?"** sous le formulaire de connexion
2. Saisissez l'adresse email associée à votre compte
3. Consultez votre boîte de réception (pensez à vérifier les spams)
4. Cliquez sur le lien de réinitialisation dans l'email reçu
5. Choisissez un nouveau mot de passe (minimum 8 caractères, 1 majuscule, 1 chiffre)

### Depuis votre espace personnel

1. Connectez-vous à votre compte
2. Accédez à **Paramètres → Sécurité**
3. Cliquez sur **"Modifier le mot de passe"**
4. Saisissez votre mot de passe actuel, puis le nouveau

### Le lien ne fonctionne pas ?

- Le lien expire après **24 heures**. Si le délai est dépassé, recommencez la procédure.
- Vérifiez que vous utilisez bien la bonne adresse email.
- Contactez le support si le problème persiste.`,
    status: "draft",
    category: "Authentification",
    ticketCount: 47,
    sourceTickets: [
      { id: "t-101", subject: "Impossible de me connecter", customer: "Marie L.", date: "14 mars 2026" },
      { id: "t-102", subject: "Reset password ne marche pas", customer: "Thomas B.", date: "13 mars 2026" },
      { id: "t-103", subject: "Je n'arrive plus à accéder à mon compte", customer: "Sophie R.", date: "13 mars 2026" },
    ],
    createdAt: "14 mars 2026",
    confidence: 94,
  },
  {
    id: "art-2",
    title: "Configurer les notifications par email",
    summary:
      "32 tickets liés aux notifications email. Les utilisateurs ne trouvent pas les paramètres de notification dans l'interface.",
    content: `## Configurer vos notifications email

### Accéder aux paramètres

1. Connectez-vous à votre compte
2. Cliquez sur votre avatar en haut à droite
3. Sélectionnez **Paramètres → Notifications**

### Types de notifications disponibles

| Notification | Par défaut | Modifiable |
|---|---|---|
| Nouveau message | Activé | Oui |
| Mise à jour de statut | Activé | Oui |
| Rapport hebdomadaire | Désactivé | Oui |
| Alertes de sécurité | Activé | Non |

### Désactiver toutes les notifications

Utilisez le bouton **"Tout désactiver"** en bas de la page de paramètres. Les alertes de sécurité resteront actives.`,
    status: "draft",
    category: "Paramètres",
    ticketCount: 32,
    sourceTickets: [
      { id: "t-201", subject: "Trop de mails de votre part", customer: "Jean P.", date: "12 mars 2026" },
      { id: "t-202", subject: "Comment couper les notifications ?", customer: "Alice M.", date: "11 mars 2026" },
    ],
    createdAt: "13 mars 2026",
    confidence: 88,
  },
  {
    id: "art-3",
    title: "Comprendre sa facture et les modes de paiement",
    summary:
      "28 tickets sur la facturation. Questions récurrentes sur le détail des lignes de facture et les moyens de paiement acceptés.",
    content: `## Comprendre votre facture

### Accéder à vos factures

1. Allez dans **Paramètres → Facturation**
2. Cliquez sur **"Historique des factures"**
3. Téléchargez la facture souhaitée au format PDF

### Détail des lignes

- **Abonnement** : le montant de votre forfait mensuel ou annuel
- **Utilisateurs supplémentaires** : facturation par siège au-delà de votre forfait
- **Consommation API** : si applicable, usage au-delà du quota inclus

### Modes de paiement acceptés

- Carte bancaire (Visa, Mastercard, Amex)
- Prélèvement SEPA (entreprises EU)
- Virement bancaire (sur devis, à partir du plan Pro)`,
    status: "approved",
    category: "Facturation",
    ticketCount: 28,
    sourceTickets: [
      { id: "t-301", subject: "Je ne comprends pas ma facture", customer: "Pierre D.", date: "10 mars 2026" },
      { id: "t-302", subject: "Pouvez-vous payer par virement ?", customer: "Entreprise XYZ", date: "9 mars 2026" },
    ],
    createdAt: "11 mars 2026",
    confidence: 91,
  },
  {
    id: "art-4",
    title: "Intégrer l'API avec Zapier",
    summary:
      "19 tickets sur l'intégration Zapier. Les utilisateurs cherchent à automatiser des workflows mais ne trouvent pas la documentation.",
    content: `## Intégrer notre API avec Zapier

### Prérequis

- Un compte Zapier (gratuit ou payant)
- Un plan Pro ou supérieur sur notre plateforme
- Votre clé API (disponible dans Paramètres → API)

### Étapes de configuration

1. Connectez-vous à Zapier
2. Créez un nouveau Zap
3. Cherchez notre application dans le répertoire
4. Authentifiez-vous avec votre clé API
5. Configurez votre trigger et vos actions

### Cas d'usage populaires

- Nouveau client → notification Slack
- Ticket fermé → mise à jour CRM
- Nouveau paiement → ligne dans Google Sheets`,
    status: "published",
    category: "Intégrations",
    ticketCount: 19,
    sourceTickets: [
      { id: "t-401", subject: "Comment connecter avec Zapier ?", customer: "Marc T.", date: "8 mars 2026" },
    ],
    createdAt: "9 mars 2026",
    confidence: 85,
  },
  {
    id: "art-5",
    title: "Résoudre les erreurs d'import CSV",
    summary:
      "23 tickets concernant des erreurs lors de l'import de fichiers CSV. Problèmes d'encodage et de format récurrents.",
    content: `## Résoudre les erreurs d'import CSV

### Erreurs fréquentes

**"Format de fichier non reconnu"**
- Assurez-vous que le fichier est bien au format .csv (pas .xlsx)
- Encodage requis : UTF-8

**"Colonnes manquantes"**
- Votre fichier doit contenir les colonnes obligatoires : nom, email, identifiant
- Téléchargez notre modèle CSV depuis la page d'import

**"Ligne X : donnée invalide"**
- Vérifiez qu'il n'y a pas de virgules dans vos données (utilisez des guillemets)
- Les dates doivent être au format JJ/MM/AAAA`,
    status: "draft",
    category: "Import / Export",
    ticketCount: 23,
    sourceTickets: [
      { id: "t-501", subject: "Erreur import CSV", customer: "Julie F.", date: "12 mars 2026" },
      { id: "t-502", subject: "Le fichier CSV ne passe pas", customer: "David K.", date: "11 mars 2026" },
    ],
    createdAt: "12 mars 2026",
    confidence: 87,
  },
];

export const mockStats = {
  ticketsAnalyzed: 4050,
  articlesGenerated: 12,
  gapsDetected: 8,
  ticketsDeflected: 340,
};
