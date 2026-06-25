Pack Myrions v2 — biomes + créatures pour le mini-jeu Chasse aux Myrions.

Structure :
  {NN_Biome}/backgrounds/*.png
  {NN_Biome}/myrions/*.png

Import :
  npm run import:myrions

Génère :
  - public/minigames/biomes/{biomeId}.png
  - public/minigames/palmons/{speciesId}.png (détourés)
  - public/minigames/palmons/chibi/ (si "chibi" dans le nom)
  - src/data/myrionsCatalog.generated.ts

Source copiée depuis myrions_biomes_dossiers.zip
