import { z } from "zod";

export const SelectorCandidateSchema = z.object({
  key: z.string(),
  newSel: z.string(),
  score: z.number(),
  reason: z.string(),
  ts: z.string(),
});

export type SelectorCandidate = z.infer<typeof SelectorCandidateSchema>;

export const CatalogSchema = z.record(
  z.object({
    primary: z.string(),
    fallbacks: z.array(z.string()),
  })
);

export type Catalog = z.infer<typeof CatalogSchema>;

