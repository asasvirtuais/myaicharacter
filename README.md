# The Chronicle — App Spec (Revised for asasvirtuais)

---

## What This Is

An invitation-only character chronicle platform built on `asasvirtuais-characters`. Characters are gifted, not self-created. The platform records who a character is and what they've lived through — across RPG sessions, AI conversations, and the invisible world in between.

---

## Data Model

### Extending `asasvirtuais-characters`

The base package provides: `name`, `label`, `definition`, `details`, `notes`, `image { alt, url }`.

The Chronicle extends this with:

```typescript
// readable (extends base)
{
  id: z.string(),
  // --- base fields ---
  name: z.string(),
  label: z.string(),
  definition: z.string(),
  details: z.string(),
  notes: z.array(z.string()),
  image: z.object({ alt: z.string(), url: z.string() }),
  // --- chronicle extensions ---
  owner: z.string().nullable(),       // Auth0 userId, null until claimed
  author: z.string(),                 // Auth0 userId of creator
}

// writable (player-editable fields only)
{
  name, label, definition, details, notes, image
  // owner and author are system-managed, never in writable
}
```

### Records Subcollection

```typescript
{
  id: z.string(),
  datetime: z.string(),               // ISO 8601
  author: z.string(),                 // Auth0 userId
  type: z.enum(['lore', 'activity', 'log']),
  // lore     → key story moments. Permanent. The character's true history.
  // activity → downtime. Growth, crafting, training between sessions.
  // log      → transactions. Purchases, sales, trades. The paper trail.
  content: z.string(),
  approved: z.boolean(),              // defaults true, approval UI incoming
}
```

---

## Image Field

One field. `image: { alt, url }`. The `alt` text is the prompt — it describes the character visually and drives generation. No separate appearance field. The URL is the result. Simple, immutable once set, regenerable by rewriting the alt.

```typescript
image: z.object({
  alt: z.string(),   // visual description / generation prompt
  url: z.string(),   // Vercel Blob URL of generated portrait
})
```

---

## Package Structure

Following the `asasvirtuais` model package pattern:

```
src/
├── index.ts          # Extended schema + types
├── fields.tsx        # All field components including chronicle extensions
├── forms.tsx         # CreateCharacter, UpdateCharacter, DeleteCharacter
├── components.tsx    # CharacterItem, SingleCharacter (with tabs)
└── provider.tsx      # CharactersProvider + useCharacters
```

---

## Routes

```
/characters/new           → Create Character (author role only)
/characters/[id]          → Character Page (view / edit if owner / claim if ?claim)
/characters/[id]/chat     → placeholder
```

No home page. No listing. You only arrive here if someone sent you a link.

---

## `/characters/new` — Create Character

**Step 0 — Gemini API Key**

On load, if no key exists in IndexedDB, a modal blocks the page:

```
Enter your Gemini API Key
[input]
Stored only on your device. Never sent to our servers.
[Save]
```

Stored in IndexedDB via the existing `asasvirtuais/indexed-interface` Dexie instance, in a separate `settings` store.

**Step 1 — Seed**

```
Name        [NameField]
Label       [LabelField]
Definition  [DefinitionField]
[Generate]
```

**Step 2 — Generate**

On Generate, client-side call via Vercel AI SDK `generateObject` with the Gemini key. Enforced output schema:

```typescript
{
  details: string,      // full character sheet prose
  notes: string[],      // 5-8 traits, observations, abilities, warnings
  image: {
    alt: string,        // visual description that doubles as generation prompt
    url: string,        // populated after image generation step
  }
}
```

After text generation, `image.alt` is passed to Gemini Imagen for portrait generation (3:4). Result uploaded to Vercel Blob. `image.url` populated. Done.

**Step 3 — Review**

All fields populate a `CreateCharacter` form with `defaults` prop. Author reviews and edits. `ImageField` shows the portrait with the alt text editable — editing alt and regenerating replaces the image.

**Step 4 — Save**

Character saved with `owner: null`, `author: currentUserId`. Author lands on `/characters/[id]` and sees the gift link.

---

## `/characters/[id]` — Character Page

Uses `SingleProvider` wrapping `SingleCharacter`.

**Layout:**

```
[Portrait 3:4]    Name
                  Label
                  Definition
                  [Chat with Character]

Sheet | Notes | Lore | Activity | Logs | Gallery
(tab content)
```

- **Sheet** — `details` prose
- **Notes** — toggleable `notes[]` list
- **Lore** — records where `type === 'lore'`, chronological. Empty: *"No records yet. Your story is waiting to be written."*
- **Activity** — records where `type === 'activity'`
- **Logs** — records where `type === 'log'`
- **Gallery** — image grid, portrait first

Owner sees all fields inline-editable via `UpdateCharacter`. Non-owner sees read-only `SingleCharacter`.

**Claim flow — `?claim` param**

When URL contains `?claim`, a modal overlays the character page:

```
[Portrait]
You have been gifted a character.
Name — Label
Definition
[Claim this Character]
```

Claim triggers Auth0 login/signup. On return, `owner` set to authenticated userId. `?claim` removed. User sees their character as owner.

---

## `/characters/[id]/chat` — Placeholder

Empty page. Full spec separate.
