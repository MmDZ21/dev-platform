import { z } from "zod";
import { router, publicProcedure } from "@/lib/trpc/core";
import type { AdminModel } from "@/lib/admin/meta";

export function generateModule(meta: AdminModel, prismaModel: any) {
  /* ------------------------------------------------------------------ */
  /* 1) ZOD schema                                                      */
  /* ------------------------------------------------------------------ */
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
      case "multi-image":
        zodShape[key] = z.array(z.string().url());
        break;
      case "select":
        zodShape[key] = field.nullable
          ? z
              .string()
              .transform((v) => (v === "" ? null : v))
              .nullable()
          : z.string();
        break;
      case "multi-select":
        zodShape[key] = z.array(z.string());
        break;
      default:
        throw new Error(`Unknown field type in Zod schema: ${field.type}`);
    }

    /* optional fields */
    if (!field.required) {
      if (field.type === "image" || field.type === "file") {
        zodShape[key] = zodShape[key].or(z.literal("")).optional();
      } else if (
        field.type === "multi-select" ||
        field.type === "multi-image"
      ) {
        zodShape[key] = zodShape[key].optional().default([]);
      } else {
        zodShape[key] = zodShape[key].optional();
      }
    }
  }

  const inputSchema = z.object(zodShape);

  /* ------------------------------------------------------------------ */
  /* 2) splitSelectData – راه‌حل A                                      */
  /* ------------------------------------------------------------------ */
  function splitSelectData(meta: AdminModel, input: any, isUpdate = false) {
    const connectData: Record<string, any> = {};
    const restData: Record<string, any> = { ...input };

    for (const [key, field] of Object.entries(meta.fields)) {
      /* A) multi-select (تگ‌ها) */
      if (field.type === "multi-select" && Array.isArray(input[key])) {
        if (input[key].length) {
          // فقط اگر خالی نیست
          connectData[key] = isUpdate
            ? { set: input[key].map((id: string) => ({ id })) }
            : { connect: input[key].map((id: string) => ({ id })) };
        }
        delete restData[key]; // خامش را حذف کن
        continue;
      }

      /* B) select تکی (…Id) را همیشه به connect تبدیل کن */
      if (field.type === "select") {
        const idVal = input[key] === "" ? null : input[key];
        delete restData[key];

        const relationKey =
          field.relationName ?? (key.endsWith("Id") ? key.slice(0, -2) : key);

        if (idVal === null) {
          if (isUpdate) connectData[relationKey] = { disconnect: true };
        } else {
          connectData[relationKey] = { connect: { id: idVal } };
        }
      }
    }
    return { connectData, restData };
  }

  /* include helper for multi-selects */
  const getMultiSelectIncludes = (meta: AdminModel) => {
    const inc: Record<string, boolean> = {};
    for (const [key, field] of Object.entries(meta.fields)) {
      if (field.type === "multi-select") inc[key] = true;
    }
    return Object.keys(inc).length ? inc : undefined;
  };

  /* ------------------------------------------------------------------ */
  /* 3) CRUD router                                                     */
  /* ------------------------------------------------------------------ */
  return router({
    getAll: publicProcedure.query(() =>
      prismaModel.findMany({ include: getMultiSelectIncludes(meta) }),
    ),

    getById: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(({ input }) =>
        prismaModel.findUnique({
          where: { id: input.id },
          include: getMultiSelectIncludes(meta),
        }),
      ),

    create: publicProcedure.input(inputSchema).mutation(({ ctx, input }) => {
      const { connectData, restData } = splitSelectData(meta, input, false);
      const payload = { ...restData, ...connectData };
      console.log("🪵 FINAL PAYLOAD", JSON.stringify(payload, null, 2));
      console.log("ctx: ", ctx)
      return prismaModel.create({ data: { ...restData, ...connectData } });
    }),

    update: publicProcedure
      .input(inputSchema.extend({ id: z.string() }))
      .mutation(({ input }) => {
        const { id, ...rest } = input;
        const { connectData, restData } = splitSelectData(meta, rest, true);
        return prismaModel.update({
          where: { id },
          data: { ...restData, ...connectData },
        });
      }),

    delete: publicProcedure
      .input(z.object({ id: z.string() }))
      .mutation(({ input }) => prismaModel.delete({ where: { id: input.id } })),
  });
}
