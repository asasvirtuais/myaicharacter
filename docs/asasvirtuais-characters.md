# asasvirtuais-characters

A data-model package for character-based apps and AI applications. Provides Zod schema, typed React field components, form components, display components, and a provider — ready to plug into any React project using the [asasvirtuais](https://www.npmjs.com/package/asasvirtuais) framework.

```bash
npm install asasvirtuais-characters
```

---

## Character Schema

Six attributes that describe a character:

| Field | Type | Description |
|---|---|---|
| **Name** | `string` | Character identifier |
| **Label** | `string` | A title, pronoun, or what they're known for |
| **Definition** | `string` | Short description for listing presentation |
| **Details** | `string` (long) | Full character sheet — personality, background, everything important |
| **Notes** | `string[]` | Array of short notes — current state, alerts, powers, equipment |
| **Image** | `{ alt: string, url: string }` | Alt text doubles as generation prompt; url is the image source |

```typescript
import { schema, readable, writable } from 'asasvirtuais-characters'
import type { Readable, Writable } from 'asasvirtuais-characters'

// schema.readable  — Zod object for the full character (with id)
// schema.writable  — Zod object for create/update fields (without id)
// Readable         — TypeScript type for a full character record
// Writable         — TypeScript type for create/update payloads
```

A global type `Character` is also declared as an alias for `Readable`.

---

## Package Structure & Exports

This package uses modern subpath exports. You can import from the following paths:

| Export Path | Description |
|---|---|
| `asasvirtuais-characters` | Schema, types, and root exports |
| `asasvirtuais-characters/fields` | Individual form field components |
| `asasvirtuais-characters/forms` | Complete character forms (Create, Update, Delete) |
| `asasvirtuais-characters/components` | Display components (List Item, Single View) |
| `asasvirtuais-characters/provider` | CharactersProvider and useCharacters hook |
| `asasvirtuais-characters/package.json` | Package metadata |

```
src/
├── index.ts          # Zod schema, types, global declaration
├── fields.tsx        # Individual field components (NameField, LabelField, etc.)
├── forms.tsx         # CreateCharacter, UpdateCharacter, DeleteCharacter
├── components.tsx    # CharacterListItem, SingleCharacter (display)
└── provider.tsx      # CharactersProvider + useCharacters hook
```

---

## Fields

Six field components using `useFields` from `asasvirtuais/fields` and Mantine inputs. Each field is self-contained and reads/writes its own slice of form state.

```tsx
import { NameField, LabelField, DefinitionField, DetailsField, NotesField, ImageField } from 'asasvirtuais-characters/fields'
```

| Component | Input | Description |
|---|---|---|
| `NameField` | `TextInput` | Character name |
| `LabelField` | `TextInput` | Title / pronoun / known-for |
| `DefinitionField` | `TextInput` | Short listing description |
| `DetailsField` | `Textarea` (4 rows) | Full character sheet |
| `NotesField` | `TagsInput` | Array of session notes (type + Enter) |
| `ImageField` | `TextInput` × 2 + Generate button | Alt text (prompt) + URL, with optional image generation via `generator` prop |

### ImageField & Image Generation

The `ImageField` accepts an optional `generator` prop — a function that takes a prompt string and returns a URL:

```typescript
import { ImageField, type ImageGenerator } from 'asasvirtuais-characters/fields'

// The generator signature
type ImageGenerator = (prompt: string) => Promise<string>

// Example: using a Gemini API generator
const geminiGenerator: ImageGenerator = async (prompt) => {
    const response = await fetch(`https://api.example.com/generate`, {
        method: 'POST',
        body: JSON.stringify({ prompt }),
    })
    const { url } = await response.json()
    return url
}

// Example: placeholder for demos
const mockGenerator: ImageGenerator = async (prompt) => {
    return `https://placehold.co/400x400?text=${encodeURIComponent(prompt)}`
}

<ImageField generator={geminiGenerator} />
```

If no `generator` is provided, only the manual alt text + URL inputs are shown (no Generate button).

---

## Forms

Three form components built with `CreateForm`, `UpdateForm`, and `useTable` from `asasvirtuais/react-interface`:

```tsx
import { CreateCharacter, UpdateCharacter, DeleteCharacter } from 'asasvirtuais-characters/forms'
```

### `CreateCharacter`

Renders all 6 fields with a submit button.

```tsx
<CreateCharacter
  onSuccess={(character) => console.log('Created:', character.id)}
  defaults={{ name: 'Default Name' }}
/>
```

**Props:**
- `onSuccess?: (character: Readable) => void`
- `defaults?: Partial<Writable>`
- `generator?: ImageGenerator` — image generation function passed to `ImageField`

### `UpdateCharacter`

Pre-populated from `useSingle`. Must be rendered inside a `SingleProvider`.

```tsx
<SingleProvider id={characterId} table="characters" schema={schema}>
  <UpdateCharacter onSuccess={(character) => console.log('Updated:', character.id)} />
</SingleProvider>
```

**Props:**
- `onSuccess?: (character: Readable) => void`
- `generator?: ImageGenerator` — image generation function passed to `ImageField`

### `DeleteCharacter`

Delete button. Must be rendered inside a `SingleProvider`.

```tsx
<SingleProvider id={characterId} table="characters" schema={schema}>
  <DeleteCharacter onSuccess={() => console.log('Deleted')} />
</SingleProvider>
```

**Props:**
- `onSuccess?: () => void`

---

## Display Components

Two display components using `useSingle` from `asasvirtuais/react-interface`. Must be inside a `SingleProvider`.

```tsx
import { CharacterListItem, SingleCharacter } from 'asasvirtuais-characters/components'
```

### `CharacterListItem`

Compact card: image thumbnail (or initial fallback) + name + label badge + definition truncated to 1 line.

### `SingleCharacter`

Full detail view with centered layout and tabs:

- Image (centered)
- Name (centered)
- Label badge (centered)
- Definition / bio (left-aligned)
- **Tabs**: Details (character sheet) | Notes (list of note cards with count)

---

## Provider & Hook

```tsx
import { CharactersProvider, useCharacters } from 'asasvirtuais-characters/provider'
```

### `CharactersProvider`

Wraps `TableProvider` from `asasvirtuais/react-interface` for the `characters` table. Must be inside an `InterfaceProvider` (any backend).

```tsx
<SomeInterfaceProvider>
  <DatabaseProvider>
    <CharactersProvider>
      {children}
    </CharactersProvider>
  </DatabaseProvider>
</SomeInterfaceProvider>
```

### `useCharacters()`

Returns the full `useTable` result for the `characters` table:

```tsx
const { array, index, remove, update } = useCharacters()
```

---

## Usage Example (IndexedDB Demo)

The included `app/` directory is a Next.js demo that uses IndexedDB for zero-config client-side persistence:

```tsx
// app/providers.tsx
'use client'
import { IndexedInterfaceProvider } from 'asasvirtuais/indexed-interface'
import { DatabaseProvider } from 'asasvirtuais/react-interface'
import { CharactersProvider } from 'asasvirtuais-characters/provider'
import { schema } from 'asasvirtuais-characters'

export default function AppProviders({ children }) {
    return (
        <IndexedInterfaceProvider dbName='my-app' schema={{ characters: schema }}>
            <DatabaseProvider>
                <CharactersProvider>
                    {children}
                </CharactersProvider>
            </DatabaseProvider>
        </IndexedInterfaceProvider>
    )
}
```

```tsx
// app/page.tsx
'use client'
import { useCharacters } from 'asasvirtuais-characters/provider'
import { CreateCharacter } from 'asasvirtuais-characters/forms'
import { CharacterListItem } from 'asasvirtuais-characters/components'
import { SingleProvider } from 'asasvirtuais/react-interface'
import { schema } from 'asasvirtuais-characters'

export default function Page() {
    const { array: characters } = useCharacters()
    return (
        <div>
            <CreateCharacter onSuccess={(c) => console.log('Created', c.id)} />
            {characters.map(c => (
                <SingleProvider key={c.id} id={c.id} table="characters" schema={schema}>
                    <CharacterListItem />
                </SingleProvider>
            ))}
        </div>
    )
}
```

---

## Peer Dependencies

```json
{
  "asasvirtuais": "^2.0.0",
  "zod": "^4.0.0",
  "@mantine/core": "^8.0.0",
  "react": "^19.0.0",
  "react-dom": "^19.0.0"
}
```

---

## Available Interfaces

The package works with any `asasvirtuais` interface:

| Interface | Package | Use Case |
|---|---|---|
| `IndexedInterfaceProvider` | `asasvirtuais/indexed-interface` | Client-side IndexedDB (offline-first) |
| `MemInterfaceProvider` | `asasvirtuais/mem-provider` | In-memory (prototyping) |
| `FetchInterfaceProvider` | `asasvirtuais/fetch-provider` | REST API client |
| `next-interface` | `asasvirtuais/next-interface` | Next.js API routes |

---

## Tech Stack

- **Schema**: [Zod](https://zod.dev/) v4
- **UI**: [Mantine](https://mantine.dev/) v8
- **State/Data**: [asasvirtuais](https://www.npmjs.com/package/asasvirtuais) (react-interface, fields, form)
- **Demo Storage**: IndexedDB via Dexie

## License

MIT