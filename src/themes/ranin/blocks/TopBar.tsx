import React from 'react'
import { z } from 'zod'
import { Container } from '../design-system'
import { Globe, Phone } from 'lucide-react'

export const topBarSchema = z.object({
  message: z.string().default('معرفی GridOS 3.0 — مدیریت یکپارچه انرژی برای شرکت‌های چندسایته.'),
  shortMessage: z.string().default('آشنایی با GridOS 3.0'),
  showLanguage: z.boolean().default(true),
  languageLabel: z.string().default('فا'),
  showContact: z.boolean().default(true),
  contactLabel: z.string().default('تماس با فروش'),
  contactHref: z.string().optional(),
})

export async function TopBar(props: z.infer<typeof topBarSchema> & { locale: string }) {
  return (
    <div className="border-b bg-gray-200">
      <Container className="flex items-center justify-between py-2 text-xs">
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline">{props.message}</span>
          <span className="sm:hidden">{props.shortMessage}</span>
        </div>
        <div className="flex items-center gap-4">
          {props.showLanguage ? (
            <button className="flex items-center gap-1 text-foreground/80 hover:text-brand-foreground">
              <Globe className="h-4 w-4" /> {props.languageLabel}
            </button>
          ) : null}
          {props.showContact ? (
            props.contactHref ? (
              <a href={props.contactHref} className="flex items-center gap-1 text-foreground/80 hover:text-brand-foreground">
                <Phone className="h-4 w-4" /> {props.contactLabel}
              </a>
            ) : (
              <button className="flex items-center gap-1 text-foreground/80 hover:text-brand-foreground">
                <Phone className="h-4 w-4" /> {props.contactLabel}
              </button>
            )
          ) : null}
        </div>
      </Container>
    </div>
  )
}
