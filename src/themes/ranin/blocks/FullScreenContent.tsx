import { z } from "zod";
import { Heading, Text, Button, FullScreenSection, Container } from "../design-system";
import Link from "next/link";

export const fullScreenContentSchema = z.object({
  title: z.string().default("Full Screen Section"),
  subtitle: z.string().optional(),
  content: z.string().optional(),
  ctaText: z.string().optional(),
  ctaHref: z.string().optional(),
  background: z.enum(["default", "gray", "gradient", "dark"]).default("gradient"),
  align: z.enum(["start", "center", "end"]).default("center"),
  textAlign: z.enum(["left", "center", "right"]).default("center"),
});

export async function FullScreenContent(props: z.infer<typeof fullScreenContentSchema> & { locale: string }) {
  const { title, subtitle, content, ctaText, ctaHref, background, align, textAlign } = props;
  
  const textAlignClass = textAlign === "center" ? "text-center" : textAlign === "right" ? "text-right" : "text-left";
  
  return (
    <FullScreenSection background={background} align={align}>
      <Container className={`max-w-4xl ${textAlignClass}`}>
        <div className="space-y-6">
          <Heading level={1} className="text-4xl md:text-6xl font-bold">
            {title}
          </Heading>
          
          {subtitle && (
            <Text className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              {subtitle}
            </Text>
          )}
          
          {content && (
            <Text className="text-lg max-w-2xl mx-auto leading-relaxed">
              {content}
            </Text>
          )}
          
          {ctaText && ctaHref && (
            <div className="pt-4">
              <Button size="lg" asChild>
                <Link href={ctaHref}>
                  {ctaText}
                </Link>
              </Button>
            </div>
          )}
        </div>
      </Container>
    </FullScreenSection>
  );
}
