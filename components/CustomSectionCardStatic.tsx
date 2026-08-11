"use client";
import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CalendarDays, MapPin } from 'lucide-react';
import Image from 'next/image';
import { renderIcon } from "@/lib/hybrid-icon-resolver";
import { withBasePath } from "@/lib/utils";
import { MarkdownRenderer } from './MarkdownRenderer';
import { SectionEyebrow } from './SectionEyebrow';

interface StaticSectionData {
  section_name: string
  method?: string
  path?: string
  layout_type: 'card' | 'timeline' | 'list'
  items: Array<{
    primaryTitle?: string
    secondaryTitle?: string
    dateInfo?: string
    location?: string
    description?: string
    logoUrl?: string | null
    customLinks: Array<{
      icon: string
      title: string
      url: string
    }>
  }>
}

export default function CustomSectionCardStatic({ section }: { section: StaticSectionData }) {
  const sectionId = section.section_name.toLowerCase().replace(/\s+/g, '-')
  return (
    <section id={`custom-${sectionId}`} className="mb-28 scroll-mt-24">
      {section.method && section.path && (
        <SectionEyebrow method={section.method} path={section.path} />
      )}
      <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-8">
        {section.section_name}
      </h2>
      <div className="space-y-4">
        {section.items.map((item, index) => (
          <Card
            key={index}
            className="animate-in fade-in slide-in-from-bottom overflow-hidden"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex items-start gap-4">
                  {item.logoUrl && (
                    <div className="relative w-10 h-10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Image
                        src={withBasePath(item.logoUrl)}
                        alt="Logo"
                        fill
                        className="object-contain"
                        sizes="32px"
                        priority={index === 0}
                      />
                    </div>
                  )}
                  <div>
                    <p className="font-display text-lg font-semibold text-foreground">{item.primaryTitle}</p>
                    {item.secondaryTitle && (
                      <p className="font-mono text-xs uppercase tracking-wide text-primary mt-1">{item.secondaryTitle}</p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-start md:items-end gap-1.5 shrink-0">
                  {item.dateInfo && (
                    <span className="inline-flex items-center gap-1.5 rounded border border-border bg-background/40 px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
                      <CalendarDays className="h-3 w-3" />
                      {item.dateInfo}
                    </span>
                  )}
                  {item.location && (
                    <span className="inline-flex items-center gap-1.5 rounded border border-border bg-background/40 px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {item.location}
                    </span>
                  )}
                </div>
              </div>
            </CardHeader>
            {item.description && (
              <CardContent className="pb-4">
                <MarkdownRenderer content={item.description} />
              </CardContent>
            )}
            {item.customLinks && item.customLinks.length > 0 && (
              <CardContent className="pt-0 pb-4">
                <div className="flex flex-wrap gap-2">
                  {item.customLinks.map((link, linkIndex) => (
                    <a
                      key={linkIndex}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={link.title}
                      className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 font-mono text-xs text-muted-foreground hover:text-primary hover:border-primary/60 transition-colors"
                    >
                      {renderIcon(link.icon)}
                      {link.title}
                    </a>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </section>
  );
}
