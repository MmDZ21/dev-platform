import type { LayoutProps } from "@/cms/types";
import { Container, Section, Heading, Text } from "../design-system";

export default function DefaultLayout({ slots, page }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <Section>
        <Container className="py-8">
          <Heading level={2} className="text-2xl">{page.title}</Heading>
        </Container>
      </Section>
      <main>
        <Container>
          {slots.hero && slots.hero.length > 0 && (
            <Section className="mb-10">{slots.hero}</Section>
          )}
          {slots.content && slots.content.length > 0 && (
            <Section className="space-y-6">{slots.content}</Section>
          )}
        </Container>
      </main>
      <footer>
        <Container className="py-10 text-sm text-muted-foreground">
          © DevPress Sample Theme
        </Container>
      </footer>
    </div>
  );
}


