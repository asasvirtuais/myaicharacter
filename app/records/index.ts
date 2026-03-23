import { z } from 'zod'

export const readable = z.object({
  id: z.string(),
  character: z.string(),             // The character this record belongs to
  datetime: z.string(),               // ISO 8601
  author: z.string(),                 // Auth0 userId
  type: z.enum(['lore', 'activity', 'log']),
  // lore     → key story moments. Permanent. The character's true history.
  // activity → downtime. Growth, crafting, training between sessions.
  // log      → transactions. Purchases, sales, trades. The paper trail.
  title: z.string(),                  // Required for all records
  content: z.string().optional(),     // Markdown content (optional for activity/log)
  image: z.object({                   // Optional image for lore records
    url: z.string(),
    alt: z.string(),
  }).optional(),
  questline: z.string().optional(),   // Optional questline attribute to group records
  approved: z.boolean(),              // defaults true, approval UI incoming
})

export const writable = readable.pick({
  character: true,
  type: true,
  title: true,
  content: true,
  image: true,
  questline: true,
})

export const schema = { readable, writable }

export type RecordReadable = z.infer<typeof readable>
export type RecordWritable = z.infer<typeof writable>
export type Record = RecordReadable
