import type { LayoutProps } from "@/cms/types";
import MainLayout from "./MainLayout";
import { Container, Section } from "../design-system";
import { Slots } from "@/lib/simple-theme";

export default function ProductsLayout({ slots, page }: LayoutProps) {
  return (
    <MainLayout slots={slots} page={page}>
      {/* Products Page Content */}
      <div className="space-y-0">
        {/* Filters */}
        <Section>
          <Container className="py-6"><Slots slots={slots} name="filters" /></Container>
        </Section>

        {/* Main Content (Product Grid, Product Detail, etc.) */}
        <Section>
          <Container className="py-10"><Slots slots={slots} name="content" /></Container>
        </Section>
      </div>
    </MainLayout>
  );
}
