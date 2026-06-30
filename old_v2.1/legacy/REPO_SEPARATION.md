# Repository separation notes

This folder contains the standalone idle isekai chill game prototype.

It is intentionally isolated from the existing Urza Gatherer / MTG project in
the parent repository:

```text
idle-isekai-chill-game/
```

Keep future idle-game code, assets, scripts, and package changes inside this
folder. Do not import files from the MTG project and do not place MTG code in
this folder.

## Move to its own repository later

Simple option:

```bash
cp -a idle-isekai-chill-game ../idle-isekai-chill-game
cd ../idle-isekai-chill-game
rm -rf node_modules dist
git init
git add .
git commit -m "Initial idle isekai chill game"
```

History-preserving option from the parent repository:

```bash
git subtree split --prefix=idle-isekai-chill-game -b idle-isekai-chill-game-split
```

Then push `idle-isekai-chill-game-split` to a new remote repository.
