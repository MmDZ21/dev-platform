export default async function Page({ searchParams }: { searchParams?: Record<string, string | string[]> }) {
  return {
    id: 'ranin-v2-products-list',
    title: 'محصولات',
    layout: 'ProductsLayout',
    meta: {
      title: 'محصولات',
      description: 'لیست همه محصولات ما با امکان فیلتر و جستجو',
    },
    slots: {
      filters: [{ type: 'ProductFilters', props: {} }],
      content: [{ type: 'ProductGrid', props: { title: 'همه محصولات', limit: 12 } }],
    },
  };
}


