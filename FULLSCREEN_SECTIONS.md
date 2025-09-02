# Full-Screen Sections Documentation

This document explains how to create and use full-screen sections in your theme.

## Overview

Full-screen sections take up the entire viewport height, accounting for the header and topbar. This creates immersive, engaging experiences for your users.

## Available Components

### 1. FullScreenSection (Utility Component)

A base utility component for creating custom full-screen sections.

```tsx
import { FullScreenSection } from "../design-system";

<FullScreenSection 
  background="muted" 
  align="center" 
  withHeader={true}
>
  <div>Your custom content here</div>
</FullScreenSection>
```

**Props:**
- `withHeader` (boolean, default: true) - Accounts for header + topbar height
- `height` (string) - Custom height override
- `background` - "default" | "muted" | "gradient" | "dark"
- `align` - "start" | "center" | "end" - Vertical alignment
- `padding` (string) - Custom padding override

### 2. FullScreenContent Block

A ready-to-use block for full-screen content sections.

**Schema Properties:**
```typescript
{
  title: string,
  subtitle?: string,
  content?: string,
  ctaText?: string,
  ctaHref?: string,
  background: "default" | "muted" | "gradient" | "dark",
  align: "start" | "center" | "end",
  textAlign: "left" | "center" | "right"
}
```

**Usage in CMS:**
```json
{
  "type": "ranin.fullScreenContent",
  "props": {
    "title": "Welcome to Our Platform",
    "subtitle": "Building the future of digital experiences",
    "background": "gradient",
    "align": "center"
  }
}
```

### 3. ProductsCarousel (Full-Screen Mode)

Enhanced version with full-screen capability.

**New Properties:**
- `fullScreen` (boolean, default: false)
- `background` - "default" | "muted" | "gradient" | "dark"

**Usage:**
```json
{
  "type": "ranin.productsCarousel",
  "props": {
    "fullScreen": true,
    "background": "dark",
    "title": "Explore Our Products"
  }
}
```

### 4. HighlightCards (Full-Screen Mode)

Enhanced version with full-screen capability and titles.

**New Properties:**
- `title` (string, optional)
- `subtitle` (string, optional)
- `fullScreen` (boolean, default: false)
- `background` - "default" | "muted" | "gradient" | "dark"

**Usage:**
```json
{
  "type": "ranin.highlightCards",
  "props": {
    "title": "Our Key Features",
    "subtitle": "Everything you need to succeed",
    "fullScreen": true,
    "background": "muted",
    "columns": 3
  }
}
```

## Height Calculation

### With Header (default)
- Height: `calc(100vh - 6.5rem)`
- Accounts for:
  - Topbar: ~2.5rem
  - Header: 4rem

### Without Header
- Height: `100vh`
- Takes full viewport height

## Background Options

- **default**: No background styling
- **muted**: Light muted background (`bg-muted/20`)
- **gradient**: Gradient background (`bg-gradient-to-b from-muted to-muted/40`)
- **dark**: Dark background with white text (`bg-gray-900 text-white`)

## Alignment Options

- **start**: Content aligned to top/left
- **center**: Content centered (default for most components)
- **end**: Content aligned to bottom/right

## Best Practices

1. **Use sparingly**: Full-screen sections are powerful but should be used strategically
2. **Consider mobile**: Test on various screen sizes
3. **Content hierarchy**: Use proper heading levels and spacing
4. **Performance**: Avoid too many full-screen sections with heavy content
5. **Accessibility**: Ensure sufficient contrast and readable text sizes

## Examples

### Simple Full-Screen Hero Alternative
```tsx
<FullScreenSection background="gradient" align="center">
  <Container className="text-center">
    <Heading level={1}>Welcome to Our Platform</Heading>
    <Text>Building amazing experiences</Text>
    <Button>Get Started</Button>
  </Container>
</FullScreenSection>
```

### Feature Showcase
```tsx
<FullScreenSection background="dark" align="center">
  <Container className="max-w-6xl">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      <div>
        <Heading level={2}>Revolutionary Technology</Heading>
        <Text>Detailed description...</Text>
      </div>
      <div>
        <Image src="..." alt="Feature image" />
      </div>
    </div>
  </Container>
</FullScreenSection>
```

### Portfolio/Gallery Section
```tsx
<FullScreenSection background="muted" align="start" padding="p-8">
  <Container className="max-w-7xl">
    <Heading level={2}>Our Work</Heading>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
      {/* Gallery items */}
    </div>
  </Container>
</FullScreenSection>
```

## Integration with Layouts

Full-screen sections work seamlessly with existing layouts:

```tsx
// HomeLayout.tsx
export default function HomeLayout({ slots, page }: LayoutProps) {
  return (
    <MainLayout slots={slots} page={page}>
      {/* Hero Section - Already full-screen */}
      {slots.hero}
      
      {/* Regular sections */}
      <Section>
        <Container>{slots.content}</Container>
      </Section>
      
      {/* Full-screen sections mixed in */}
      {slots.sections}
    </MainLayout>
  );
}
```

This allows you to mix regular sections with full-screen sections for dynamic, engaging layouts.
