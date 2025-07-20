import type { AdminModel, InferFieldValues } from './meta';

export function normalizeItem<T extends AdminModel>(
  item: Record<string, any>,
  model: T
): InferFieldValues<T> & { id: string } {
  const normalized: Record<string, any> = { id: item.id };

  for (const [key, field] of Object.entries(model.fields)) {
    const value = item[key];

    if (value === null || value === undefined) {
      if (field.type === 'text') normalized[key] = '';
      else if (field.type === 'number') normalized[key] = 0;
      else if (field.type === 'boolean') normalized[key] = false;
    } else {
      normalized[key] = value;
    }
  }

  return normalized as InferFieldValues<T> & { id: string };
}
