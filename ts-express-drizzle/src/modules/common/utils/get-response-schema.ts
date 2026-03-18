import z from 'zod'

export const getResponseSchema = (
  status: number,
  data?: z.ZodObject<any>,
): z.ZodObject<any> => {
  if (data) {
    return z.object({
      success: z.literal(true),
      status: z.literal(status),
      data: data,
    })
  }

  return z.object({
    success: z.literal(true),
    status: z.literal(status),
  })
}
