import { z } from 'zod';

export const admissionMethodCodeSchema = z.enum(['THPT', 'TRANSCRIPT', 'APTITUDE', 'COMBINED']);

export const calculationStatusSchema = z.enum([
  'AVAILABLE',
  'MISSING_SCORE',
  'NOT_APPLICABLE',
  'NOT_ELIGIBLE',
  'PENDING_CONVERSION',
]);

export const combinationResultSchema = z.object({
  combinationId: z.string().optional(),
  combinationCode: z.string(),
  combinationName: z.string().optional(),
  subjectNames: z.array(z.string()),
  rawScore: z.number().nullable(),
  convertedScore: z.number().nullable(),
  status: calculationStatusSchema,
  isBest: z.boolean(),
  transcriptSubject: z.string().nullable().optional(),
  missingSubjects: z.array(z.string()).optional(),
  message: z.string().nullable().optional(),
});

export const admissionMethodResultSchema = z.object({
  methodCode: admissionMethodCodeSchema,
  methodName: z.string(),
  description: z.string(),
  status: calculationStatusSchema,
  scoreProfileId: z.string().optional(),
  year: z.number().optional(),
  combinations: z.array(combinationResultSchema),
  representativeResult: z
    .object({
      combinationCode: z.string().nullable().optional(),
      rawScore: z.number(),
      rawScale: z.number(),
      convertedScore: z.number(),
      convertedScale: z.number(),
    })
    .nullable()
    .optional(),
});

export const admissionMethodResultsSchema = z.array(admissionMethodResultSchema);

export const majorMethodEvaluationSchema = z.object({
  methodCode: admissionMethodCodeSchema,
  methodName: z.string(),
  status: calculationStatusSchema,
  combinationCode: z.string().nullable().optional(),
  subjectNames: z.array(z.string()).optional(),
  transcriptSubject: z.string().nullable().optional(),
  rawScore: z.number().nullable(),
  rawScale: z.number(),
  convertedScore: z.number().nullable(),
  convertedScale: z.number(),
  message: z.string().nullable().optional(),
});

export const majorAdmissionResultSchema = z.object({
  majorId: z.string().optional(),
  majorCode: z.string(),
  majorName: z.string(),
  status: calculationStatusSchema,
  bestMethod: z
    .object({
      methodCode: admissionMethodCodeSchema,
      methodName: z.string(),
      combinationCode: z.string().nullable().optional(),
      subjectNames: z.array(z.string()).optional(),
      transcriptSubject: z.string().nullable().optional(),
      convertedScore: z.number(),
    })
    .nullable()
    .optional(),
  methodEvaluations: z.array(majorMethodEvaluationSchema).optional(),
  predictedCutoff: z.number().nullable().optional(),
  margin: z.number().nullable().optional(),
  probability: z.number().nullable().optional(),
});

export const majorAdmissionPageSchema = z.object({
  content: z.array(majorAdmissionResultSchema),
  page: z.number(),
  size: z.number(),
  totalElements: z.number(),
  totalPages: z.number(),
});

export const predictionHistoryResultSchema = z.object({
  id: z.string(),
  userId: z.string(),
  majorCode: z.string(),
  combinationCode: z.string(),
  admissionMethod: admissionMethodCodeSchema,
  targetYear: z.number(),
  inputScore: z.number(),
  predictedCutoff: z.number(),
  margin: z.number(),
  admissionProbability: z.number(),
  model: z.string(),
  createdAt: z.string(),
});

export function parseApiData<T>(schema: z.ZodType<T>, data: unknown, message: string): T {
  const parsed = schema.safeParse(data);

  if (parsed.success) {
    return parsed.data;
  }

  if (process.env.NODE_ENV === 'development') {
    console.error(message, parsed.error.flatten());
  }

  throw new Error(message);
}
