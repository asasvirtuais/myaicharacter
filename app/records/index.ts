import { z } from 'zod'

export const readable = z.object({
  id: z.string(),
  datetime: z.string(),               // ISO 8601
  author: z.string(),                 // Auth0 userId
  type: z.enum(['lore', 'activity', 'log']),
  // lore     → key story moments. Permanent. The character's true history.
  // activity → downtime. Growth, crafting, training between sessions.
  // log      → transactions. Purchases, sales, trades. The paper trail.
  content: z.string(),
  approved: z.boolean(),              // defaults true, approval UI incoming
})

export const writable = readable.pick({
  type: true,
  content: true,
}).extend({
  // datetime and author are usually set by the action/database logic
  // but for the UI writable, we might want to include them if the user specifies
  // however, README says: author is Auth0 userId
})

export const schema = { readable, writable }

export type RecordReadable = z.infer<typeof readable>
export type RecordWritable = z.infer<typeof writable>
export type Record = RecordReadable
