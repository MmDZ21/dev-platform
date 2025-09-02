import { z } from "zod";
import { Container, Heading, Section } from "../design-system";

export const statsSectionSchema = z.object({
  title: z.string().default("سازمان ما"),
  stats: z
    .array(
      z.object({
        number: z.string(),
        label: z.string(),
      }),
    )
    .default([
      { number: "۱۰+", label: "اعضای تیم" },
      { number: "۱۰+", label: "سال تجربه" },
      { number: "۱۵+", label: "محصولات" },
      { number: "۱", label: "مکان" },
    ]),
  background: z
    .enum(["default", "muted", "gradient", "dark"])
    .default("default"),
});

export async function StatsSection(
  props: z.infer<typeof statsSectionSchema> & { locale: string },
) {
  const { title, stats, background } = props;

  return (
    <Section className="py-4 md:py-12 bg-gray-200">
      {/* Red Header */}
      <div className="flex w-full items-center justify-center">
        <div className="w-full">
          <Container>
            <Heading level={2} className="text-center text-2xl font-bold">{title}</Heading>
          </Container>
        </div>
      </div>

      {/* Stats Grid */}
      <div className=" py-16">
        <Container>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-brand mb-4 text-4xl font-bold md:text-6xl">
                  {stat.number}
                </div>
                <div className="text-muted-foreground text-lg font-semibold md:text-xl">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </div>
    </Section>
  );
}
