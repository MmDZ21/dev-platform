import { trpc } from "@/lib/trpc/client";

/**
 * این هوک داینامیک هر کلید optionsKey را از trpc به صورت جنریک لود می‌کند
 * شرط: باید در trpc، route به همین نام و getAll.useQuery داشته باشی
 */
export function useOptionsQuery(optionsKey: string) {
  const segment = (trpc as any)[optionsKey];
  if (!segment || !segment.getAll || !segment.getAll.useQuery) {
    return { data: [], isLoading: false };
  }
  return segment.getAll.useQuery();
}
