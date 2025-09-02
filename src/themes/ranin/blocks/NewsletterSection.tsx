import { z } from "zod";
import { Button, Container, Input } from "../design-system";

export const newsletterSectionSchema = z.object({
  title: z.string().default("عضویت در خبرنامه و ارتباط با همه اعضا"),
  subtitle: z.string().default("یاد بگیرید چگونه در زمان بحرانی تصمیم درست بگیرید تا موفق شوید و چگونه بر زمان‌های سخت غلبه کنید."),
  placeholder: z.string().default("ایمیل خود را وارد کنید"),
  buttonText: z.string().default("عضویت"),
  backgroundColor: z.enum(["teal", "green", "blue", "purple"]).default("teal"),
});

export async function NewsletterSection(props: z.infer<typeof newsletterSectionSchema> & { locale: string }) {
  const { title, subtitle, placeholder, buttonText, backgroundColor } = props;

  const backgroundClasses = {
    teal: "bg-teal-600",
    green: "bg-green-600", 
    blue: "bg-blue-600",
    purple: "bg-purple-600",
  };

  return (
    <section className="bg-gray-200 py-16 md:py-24">
      <Container>
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-xl md:text-4xl font-bold mb-4 md:mb-6 leading-tight text-foreground">
            {title}
          </h2>
          <p className="text-sm md:text-lg mb-8 md:mb-12 text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
          
          <div className="max-w-lg mx-auto">
            <form className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <Input
                type="email"
                placeholder={placeholder}
                className="flex-1 px-4 md:px-6 py-4 md:py-6 rounded-full bg-background text-foreground placeholder-muted-foreground border focus:outline-none focus:ring-4 focus:ring-primary/30 transition-all"
                required
              />
              <Button
                type="submit"
                className="py-4 md:py-6 flex items-center justify-center gap-2 rounded-full w-full sm:w-auto"
              >
                {buttonText}
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Button>
            </form>
          </div>
        </div>
      </Container>
    </section>
  );
}
