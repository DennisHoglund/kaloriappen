# Kaloriappen

iPhone-PWA för att logga mat (foto + AI-uppskattning eller manuell sökning), träning och vikt mot ett beräknat dagligt kalorimål.

- **App:** https://dennishoglund.github.io/kaloriappen/
- **Testrapport:** https://dennishoglund.github.io/kaloriappen/rapport/

Byggs spec-drivet: allt börjar i `specs/`.

| Fil | Innehåll |
|---|---|
| `specs/stories.md` | User stories med acceptanskriterier och beslut |
| `specs/plan.md` | Principer, arkitektur, datamodell, beräkningar |
| `specs/tasks.md` | Tasks i faser med status och spårbarhet |
| `testplan/` | Testfall som docs-as-code |
| `CLAUDE.md` | Regler för AI-assistenter (`AGENTS.md` pekar hit) |

## Kom igång

```bash
npm ci
npx playwright install webkit chromium
npm test
```

Lokalt räcker `npx playwright test --project="Android (Chromium)"`. Rapporten hamnar i `rapport/index.html`.

## Källor

Livsmedelsdata: Livsmedelsverkets livsmedelsdatabas (CC BY 4.0).
Designförslag: claude.ai-kanvasen "Kaloriappen – designförslag" (vald: C · Blåbär).
