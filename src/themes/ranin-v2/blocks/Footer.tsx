import { z } from "zod";
import { Container } from "../design-system";
import Link from "next/link";
import Logo from "../components/Logo";

export const footerSchema = z.object({
  logo: z.string().default("رانین فرایند"),
  quickLinks: z.array(z.object({ label: z.string(), href: z.string() })).default([
    { label: "صفحه اصلی", href: "/" },
    { label: "درباره ما", href: "/about" },
    { label: "تماس با ما", href: "/contact" },
    { label: "تجهیزات برق", href: "/products" },
  ]),
  services: z.array(z.object({ label: z.string(), href: z.string() })).default([
    { label: "فروش تجهیزات", href: "/services/equipment" },
    { label: "مشاوره فنی", href: "/services/consulting" },
  ]),
  contactEmail: z.string().default("sales@raninfarayand.com"),
  note: z.string().optional(),
});

export async function Footer(p: Partial<z.input<typeof footerSchema>> & { locale: string }) {
  const parsed = footerSchema.safeParse(p);
  const { logo, quickLinks, services, contactEmail, note } = parsed.success ? parsed.data : footerSchema.parse({});

  return (
    <footer className="bg-gray-900 text-white">
      <Container className="py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo Section */}
          <div className="md:col-span-1">
            <div className="flex flex-col justify-center mb-6">
                <Logo width={150} height={60} color="hsl(var(--brand))" />
              {/* <span className="text-lg md:text-xl font-bold text-white">{logo}</span> */}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base md:text-lg font-semibold mb-4 md:mb-6 text-white">لینک‌های سریع</h3>
            <ul className="space-y-2 md:space-y-3">
              {quickLinks.map((link, i) => (
                <li key={i}>
                  <Link 
                    href={link.href} 
                    className="text-sm md:text-base text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-base md:text-lg font-semibold mb-4 md:mb-6 text-white">خدمات</h3>
            <ul className="space-y-2 md:space-y-3">
              {services.map((service, i) => (
                <li key={i}>
                  <Link 
                    href={service.href} 
                    className="text-sm md:text-base text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-base md:text-lg font-semibold mb-4 md:mb-6 text-white">تماس با ما</h3>
            <div className="space-y-2 md:space-y-3">
              <Link 
                href={`mailto:${contactEmail}`}
                className="text-sm md:text-base text-gray-300 hover:text-white transition-colors duration-200 block"
              >
                {contactEmail}
              </Link>
            </div>
          </div>
        </div>
      </Container>
      
      {/* Bottom Border */}
      <div className="border-t border-gray-800">
        <Container className="py-6">
          <div className="text-center text-gray-400 text-sm">
            {note || "© ۲۰۲۵ رانین فرایند. تمامی حقوق محفوظ است."}
          </div>
        </Container>
      </div>
    </footer>
  );
}


