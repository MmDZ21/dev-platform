import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { z } from 'zod';
import { router, publicProcedure } from '@/lib/trpc/core';
import { s3 } from '@/lib/s3';

export const uploadRouter = router({
  getUploadUrl: publicProcedure
    .input(
      z.object({
        key: z.string(), // file path inside bucket
        contentType: z.string(), // like 'image/png'
      }),
    )
    .mutation(async ({ input }) => {
      const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET!,
        Key: input.key,
        ContentType: input.contentType,
      });

      const url = await getSignedUrl(s3, command, { expiresIn: 60 });
      return { url };
    }),
});