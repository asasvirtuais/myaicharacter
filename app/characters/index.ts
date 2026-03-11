import { z } from 'zod'
import { schema as baseSchema } from 'asasvirtuais-characters'

// 1. Extend the readable schema
export const readable = baseSchema.readable.extend({
  owner: z.string().nullable(),       // Auth0 userId, null until claimed
  author: z.string(),                 // Auth0 userId of creator
})

// 2. Define the writable schema
// According to README, player-editable fields only: name, label, definition, details, notes, image
// These are exactly the base writable fields.
export const writable = baseSchema.writable

// 3. Export the schema object for the asasvirtuais framework
export const schema = { readable, writable }

// 4. Export types
export type Readable = z.infer<typeof readable>
export type Writable = z.infer<typeof writable>

// Alias for convenience as per README
export type Character = Readable
