export type FieldType =
  | "text"
  | "number"
  | "boolean"
  | "image"
  | "file"
  | "richText"
  | "seo"
  | "select"
  | "multi-select"
  | "multi-image";

export type FieldSchema = {
  type: FieldType;
  label: string;
  required?: boolean;

  // فقط برای select و multi-select
  options?: string;
  valueField?: string;
  labelField?: string;
  connect?: boolean; // ← اگر true باشد یعنی این select یک FK است
  nullable?: boolean; // ← اجازهٔ null (دستهٔ ریشه‌ای)
  relationName?: string; // ← همین یک خط کافی است
};

export type AdminModel = {
  name: string;
  icon?: any;
  parent?: string;
  fields: Record<string, FieldSchema>;
};

export function defineAdminModel<T extends AdminModel>(model: T): T {
  return model;
}
export type InferFieldValues<T extends AdminModel> = {
  [K in keyof T["fields"]]: T["fields"][K]["type"] extends "text"
    ? string
    : T["fields"][K]["type"] extends "number"
      ? number
      : T["fields"][K]["type"] extends "boolean"
        ? boolean
        : T["fields"][K]["type"] extends "richText"
          ? string
          : T["fields"][K]["type"] extends "image"
            ? string
            : T["fields"][K]["type"] extends "multi-image"
              ? string[]
              : T["fields"][K]["type"] extends "file"
                ? string
                : T["fields"][K]["type"] extends "select"
                  ? string
                  : T["fields"][K]["type"] extends "multi-select"
                    ? string[]
                    : never;
};
