import { z } from "zod";
import { Card, CardBody, CardHeader, Heading, Text, FullScreenSection, Container } from "../design-system";

export const highlightCardsSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  items: z.array(
    z.object({
      title: z.string(),
      description: z.string().optional(),
      href: z.string().optional(),
    })
  ).default([]),
  columns: z.number().int().min(1).max(4).default(3),
  fullScreen: z.boolean().default(false),
  background: z.enum(["default", "muted", "gradient", "dark"]).default("default"),
});

export async function HighlightCards(props: z.infer<typeof highlightCardsSchema> & { locale: string }) {
  const { title, subtitle, items, columns, fullScreen, background } = props;
  const cols = Math.min(4, Math.max(1, columns));
  const cls = cols === 4 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" : cols === 3 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : cols === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1";
  
  const content = (
    <Container className={fullScreen ? "max-w-6xl" : ""}>
      {(title || subtitle) && (
        <div className="mb-8 text-center">
          {title && (
            <Heading level={2} className="text-3xl font-bold mb-4">
              {title}
            </Heading>
          )}
          {subtitle && (
            <Text className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {subtitle}
            </Text>
          )}
        </div>
      )}
      
      <div className={`grid ${cls} gap-6`}>
        {items.map((it, idx) => (
          <a key={idx} href={it.href || "#"} className="block hover:shadow-lg transition-shadow">
            <Card className="h-full">
              <CardHeader>
                <div className="text-lg font-semibold text-foreground">{it.title}</div>
              </CardHeader>
              {it.description ? (
                <CardBody>
                  <Text className="mt-0 text-sm">{it.description}</Text>
                </CardBody>
              ) : null}
            </Card>
          </a>
        ))}
      </div>
    </Container>
  );

  if (fullScreen) {
    return (
      <FullScreenSection background={background} align="center">
        {content}
      </FullScreenSection>
    );
  }

  return content;
}


