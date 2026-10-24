# Testplan · Kaloriappen

Testfall för Kaloriappen som docs-as-code. Varje testfall har steg-för-steg-instruktioner så att det kan köras manuellt på telefonen.
Automatiserade testfall körs dessutom av Playwright vid varje commit och är kopplade via sitt ID.

| | |
|---|---|
| **Testfall** | 7 |
| **Automatiserade** | 7 (körs på iPhone/WebKit och Android/Chromium) |
| **Manuella** | 0 |
| **Senaste testrapport** | [dennishoglund.github.io/kaloriappen/rapport/](https://dennishoglund.github.io/kaloriappen/rapport/) |
| **Krav** | [specs/stories.md](../specs/stories.md) |

**Typ:** 🤖 automatiserad · 🖐️ manuell  **Prioritet:** Hög = måste fungera, Medel = viktig, Låg = bekvämlighet

## Grund

| ID | Testfall | Prio | Typ |
|---|---|---|---|
| [TC-GRU-01](testfall/TC-GRU-01.md) | [Appen startar och visar startsidan](testfall/TC-GRU-01.md) | Hög | 🤖 |
| [TC-GRU-02](testfall/TC-GRU-02.md) | [Manifestet beskriver en installerbar app](testfall/TC-GRU-02.md) | Medel | 🤖 |
| [TC-GRU-03](testfall/TC-GRU-03.md) | [Alla filer i service workerns appskal finns](testfall/TC-GRU-03.md) | Medel | 🤖 |
| [TC-GRU-04](testfall/TC-GRU-04.md) | [Ikonerna finns i alla storlekar](testfall/TC-GRU-04.md) | Medel | 🤖 |

## Tema

| ID | Testfall | Prio | Typ |
|---|---|---|---|
| [TC-TEM-01](testfall/TC-TEM-01.md) | [Temaknappen växlar Auto → Ljust → Mörkt och sparar valet](testfall/TC-TEM-01.md) | Medel | 🤖 |
| [TC-TEM-02](testfall/TC-TEM-02.md) | [Mörkt läge följer telefonens inställning](testfall/TC-TEM-02.md) | Medel | 🤖 |
| [TC-TEM-03](testfall/TC-TEM-03.md) | [Ljust läge har Blåbär-färgerna](testfall/TC-TEM-03.md) | Medel | 🤖 |
