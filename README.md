# Test_2

Site vitrine statique d'un cabinet vétérinaire à Douala (Bonapriso), publié avec GitHub Pages.

## Fichiers

| Fichier | Rôle |
| --- | --- |
| `index.html` | Toute la page : bandeau urgences, en-tête, accroche, services, équipe, infos pratiques, horaires, FAQ, contact, pied de page. |
| `assets/css/styles.css` | Mise en forme complète (thème clair et sombre, grilles, cartes, boutons, adaptatif, impression). |
| `assets/js/main.js` | Menu mobile, en-tête compact au défilement, accordéon FAQ, statut « ouvert / fermé » en direct, bouton retour en haut. |

Les trois fichiers sont reliés par des attributs `data-*` : `data-entete`, `data-menu`,
`data-menu-bouton`, `data-statut`, `data-faq`, `data-haut`, `data-annee`. Renommer l'un d'eux
demande de modifier à la fois le HTML, le CSS et le JS.

## Avant la mise en ligne

Le contenu est rempli de valeurs d'exemple, signalées de deux façons :

- visuellement, par la classe `.placeholder` (fond ambre, soulignement pointillé) et les encarts `.note` ;
- dans le code source, par des commentaires HTML en majuscules (`<!-- NUMÉRO FICTIF — … -->`).

À remplacer avant publication : nom du cabinet, adresse, téléphone, e-mail, WhatsApp, horaires,
noms et photos de l'équipe, chiffres clés, plan d'accès, et les mêmes valeurs dans le bloc
`application/ld+json` en bas de `index.html`.

Les horaires sont écrits à trois endroits qui doivent rester cohérents : le tableau
`.horaires`, la constante `HORAIRES` de `assets/js/main.js` et les `openingHoursSpecification`
des données structurées.

## Aperçu local

Ouvrir `index.html` dans un navigateur suffit ; aucune étape de build n'est nécessaire.
