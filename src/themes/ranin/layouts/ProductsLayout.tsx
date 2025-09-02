import type { LayoutProps } from "@/cms/types";
import MainLayout from "./MainLayout";
import { Container, Section } from "../design-system";

export default function ProductsLayout({ slots, page }: LayoutProps) {
  return (
    <MainLayout slots={slots} page={page}>
      {/* Products Page Content */}
      <div className="space-y-0">
        {/* Filters */}
        {slots.filters && slots.filters.length > 0 && (
          <Section>
            <Container className="py-6">{slots.filters}</Container>
          </Section>
        )}

        {/* Main Content (Product Grid, Product Detail, etc.) */}
        {slots.content && slots.content.length > 0 && (
          <Section>
            <Container className="py-10">{slots.content}</Container>
          </Section>
        )}
      </div>
    </MainLayout>
  );
}


