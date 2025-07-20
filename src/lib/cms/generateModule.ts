import { z } from "zod";
import { router, publicProcedure } from "@/lib/trpc/core";
import type { AdminModel } from "@/lib/admin/meta";

// Add "multi-select" to your switch
export function generateModule(meta: AdminModel, prismaModel: any) {
  const zodShape: Record<string, any> = {};

  for (const [key, field] of Object.entries(meta.fields)) {
    switch (field.type) {
      case "text":
      case "richText":
        zodShape[key] = z.string();
        break;
      case "number":
        zodShape[key] = z.number();
        break;
      case "boolean":
        zodShape[key] = z.boolean();
        break;
      case "image":
      case "file":
        zodShape[key] = z.string().url();
        break;
      case "select":
        zodShape[key] = z.string();
        break;
      case "multi-select":
        zodShape[key] = z.array(z.string());
        break;
      // If you want to add "seo" or others, do so here.
      default:
        throw new Error(`Unknown field type in Zod schema: ${field.type}`);
    }

    if (!field.required) {
      if (field.type === "image" || field.type === "file") {
        zodShape[key] = zodShape[key].or(z.literal("")).optional();
      } else if (field.type === "multi-select") {
        zodShape[key] = zodShape[key].optional().default([]);
      } else {
        zodShape[key] = zodShape[key].optional();
      }
    }
  }

  const inputSchema = z.object(zodShape);

  return router({
    getAll: publicProcedure.query(async () => {
      return prismaModel.findMany({
        include: getMultiSelectIncludes(meta), // so tags come with posts
      });
    }),
    getById: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        return prismaModel.findUnique({
          where: { id: input.id },
          include: getMultiSelectIncludes(meta),
        });
      }),

    create: publicProcedure.input(inputSchema).mutation(async ({ input }) => {
      // Separate multi-select fields (like tags)
      const { connectData, restData } = splitMultiSelectData(meta, input);

      return prismaModel.create({
        data: {
          ...restData,
          ...connectData,
        },
      });
    }),

    update: publicProcedure
      .input(inputSchema.extend({ id: z.string() }))
      .mutation(async ({ input }) => {
        const { id, ...restInput } = input;
        const { connectData, restData } = splitMultiSelectData(
          meta,
          restInput,
          /* isUpdate */ true,
        );

        return prismaModel.update({
          where: { id },
          data: {
            ...restData,
            ...connectData,
          },
        });
      }),

    delete: publicProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        return prismaModel.delete({ where: { id: input.id } });
      }),
  });
}

// --- Helpers ---

/**
 * Returns { connectData, restData }
 * connectData: { [relationField]: { connect: [...] } | { set: [...] } }
 * restData: all other simple fields
 */
function splitMultiSelectData(meta: AdminModel, input: any, isUpdate = false) {
  const connectData: Record<string, any> = {};
  const restData: Record<string, any> = {};

  for (const [key, field] of Object.entries(meta.fields)) {
    if (field.type === "multi-select" && Array.isArray(input[key])) {
      // Prisma relation: connect on create, set on update
      connectData[key] = isUpdate
        ? { set: input[key].map((id: string) => ({ id })) }
        : { connect: input[key].map((id: string) => ({ id })) };
    } else if (input[key] !== undefined) {
      restData[key] = input[key];
    }
  }
  return { connectData, restData };
}

/**
 * For getAll: Include multi-select fields (like tags)
 */
function getMultiSelectIncludes(meta: AdminModel) {
  const include: Record<string, boolean> = {};
  for (const [key, field] of Object.entries(meta.fields)) {
    if (field.type === "multi-select") include[key] = true;
  }
  return Object.keys(include).length > 0 ? include : undefined;
}
