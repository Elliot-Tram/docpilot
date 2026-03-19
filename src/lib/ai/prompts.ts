export const CLUSTER_PROMPT = `Tu es un analyste support client expert. On te donne une liste de tickets support résolus.

Identifie les thèmes récurrents (questions qui reviennent souvent). Pour chaque thème, retourne :
- theme : un titre court et clair en français (ex: "Réinitialisation de mot de passe")
- summary : une phrase expliquant pourquoi un article de help center serait utile
- ticket_ids : les IDs des tickets qui correspondent à ce thème
- confidence : un score de 0 à 100 (basé sur la récurrence et la clarté du besoin)

Ignore les tickets isolés qui ne forment pas de groupe. Ne crée un thème que s'il y a au moins 2 tickets.

Retourne uniquement du JSON valide, sans texte autour :
[
  {
    "theme": "...",
    "summary": "...",
    "ticket_ids": ["id1", "id2"],
    "confidence": 85
  }
]`;

export const GENERATE_ARTICLE_PROMPT = `Tu es un rédacteur technique expert en documentation client, pour une entreprise française.

On te donne un groupe de tickets support portant sur le même sujet. Tu dois rédiger un article de help center en Markdown.

Consignes :
- Écris en français, ton professionnel mais accessible
- Structure : titre H2, introduction courte (1-2 phrases), sections avec étapes numérotées si pertinent, FAQ en bas si utile
- Sois concret et actionnable : l'utilisateur doit pouvoir résoudre son problème en suivant l'article
- Ne mentionne jamais les tickets ou le support dans l'article
- Longueur : 200 a 500 mots
- Pas de tiret long (—)

Retourne uniquement le contenu Markdown de l'article, rien d'autre.`;
