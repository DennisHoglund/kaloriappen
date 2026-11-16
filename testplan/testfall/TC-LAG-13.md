[← Testplan](../index.md)

# TC-LAG-13 · Laga mat med riktiga foton på iPhone

| | |
|---|---|
| **Område** | Laga mat |
| **Prioritet** | Hög |
| **Typ** | 🖐️ Manuell |
| **Krav** | [specs/stories.md US-16 AC1, US-17 AC1, US-18 AC1](../../specs/stories.md) |
| **Automatiskt** | Logiken är automattestad, här testas riktig Gemini och iPhone-kameran |

## Förutsättningar

- Inloggad med profil. `schema.sql` körd efter 2026-11-16 och Edge Function `kalori-recept` driftsatt

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Fota kylskåpet eller ingredienser på bänken | Rimliga ingredienser inom ca 10 s |
| 2 | Föreslå rätter och välj en | Rimligt recept på svenska med svenska mått |
| 3 | Logga en portion och sätt betyg | Syns i dagens översikt och i receptboken |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
