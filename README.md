# Kammoun Lighting

Catalogue web pour **Kammoun Lighting**, Société MEM d'Électricité.

Le site est pense pour un lancement simple:

- catalogue public sans compte client;
- bouton WhatsApp sur chaque produit;
- page admin privee sur `/gestion`;
- base de donnees Supabase;
- deploiement Vercel;
- import CSV depuis Excel.

## Lancer en local

```bash
npm install
npm run dev
```

Le site public sera disponible sur l'adresse affichee par Vite.

## Brancher Supabase

1. Creer un projet sur Supabase.
2. Ouvrir le SQL Editor.
3. Coller et executer `supabase/schema.sql`.
4. Creer un utilisateur dans Authentication.
5. Copier son `user id`.
6. Executer la derniere requete commentee du schema avec ce `user id`.
7. Copier `.env.example` vers `.env.local`.
8. Remplir:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key
VITE_WHATSAPP_NUMBER=21622400000
```

## Colonnes CSV conseillees

Excel peut exporter en CSV avec ces colonnes:

```text
reference,name,brand,category,description,wattage,color_temperature,stock_quantity,price,show_price,image_url,active
```

Les noms francais marchent aussi pour plusieurs colonnes:

```text
ref,nom,marque,categorie,description,puissance,couleur,quantite,prix,afficher_prix,image,actif
```

`reference` doit rester unique. C'est ce champ qui permet de mettre a jour le
meme produit pendant un nouvel import.

## Deployer sur Vercel

1. Pousser le projet sur GitHub.
2. Importer le projet dans Vercel.
3. Ajouter les variables d'environnement dans Vercel:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_WHATSAPP_NUMBER`
4. Deploy.

Le panneau admin sera:

```text
https://votre-site.vercel.app/gestion
```

Ne mets pas ce lien dans la page publique.
