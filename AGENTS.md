# NEXO project continuity

Preserve user changes. Work in this existing checkout; do not create worktrees unless requested.

The user explicitly requires pushing completed changes to GitHub. Commit and push tested work to origin/main; do not leave the only copy untracked or solely in an ephemeral export directory. Make intermediate recovery commits for substantial work. Check the push result and remote commit hash before claiming it is backed up. Never commit secrets or node_modules.

The initial menu has exactly three buttons: Jugar (Continuar when there is adventure progress), Un reto, Ajustes. Jugar resumes adventure directly; Un reto resumes or starts a single independent puzzle. Do not add a map, catalogue, range selector or world/mode chooser before gameplay. Worlds are automatic visual/music changes, not choices. Keep gameplay mobile-first and calm, with silent autosave and a subtle back arrow. A phase contains multiple puzzles; guides belong inside real levels. Guide the first interaction and every phase/style/rule entry, showing swap and propagation separately. Adventure and free play have independent saves and completion records. Catalogue: 250 ordinary puzzles in 51 phases plus two introductory guided puzzles. Three visual/music worlds repeat. No timed pressure or claims of efficacy for TDA/AACC. Music and animation can be disabled independently.

Run npm run check for gameplay changes. Keep reproducible standalone HTML and ZIP downloads in downloads/ and commit them when releasing, so files survive environment restoration. npm run export regenerates them; export only after the matching sources pass checks. Do not present loopback URLs as public previews.
