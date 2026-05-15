"use client";
import React from "react";
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import Image from 'next/image';
import { renderIcon } from "@/lib/hybrid-icon-resolver";
import { MarkdownRenderer } from './MarkdownRenderer';
interface StaticSectionData {
  section_name: string
  layout_type: 'card' | 'timeline' | 'list'
  items: Array<{
    primaryTitle?: string
    secondaryTitle?: string
    dateInfo?: string
    location?: string
    description?: string
    logoUrl?: string | null
    customLinks: Array<{
      icon: string      // Library key OR custom SVG data
      title: string
      url: string
    }>
  }>
}
interface ListItemProps {
  primaryTitle: string;
  secondaryTitle?: string;
  dateInfo?: string;
  location?: string;
  description?: string;
  logoUrl?: string | null;
  customLinks?: readonly {
    title: string;
    url: string;
    icon: string;
  }[];
  isFirst?: boolean;
  isLast?: boolean;
}
function ListItem({ primaryTitle, secondaryTitle, dateInfo, location, description, logoUrl, customLinks, isFirst = false, isLast = false }: ListItemProps) {
  const paddingClasses = `${!isFirst ? 'pt-6' : ''} ${!isLast ? 'pb-6' : ''}`.trim();
  return (
    <li className={paddingClasses}>
      <div className="flex gap-4">
        {logoUrl && (
          <div className="flex-shrink-0">
            <div className="relative w-12 h-12 flex items-center justify-center">
                <Image
                  src={logoUrl}
                  alt="Logo"
                  fill
                  className="object-contain"
                  sizes="32px"
                  priority={isFirst}
                />
            </div>
          </div>
        )}
        <div className="flex flex-1 flex-col justify-start gap-2">
          <div className="flex flex-col gap-1">
            {dateInfo && (
              <time className="text-sm text-muted-foreground">
                {dateInfo}
              </time>
            )}
            {location && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground pb-2">
                <MapPin className="h-3 w-3" />
                <span>{location}</span>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <h2 className="font-semibold leading-none text-xl">{primaryTitle}</h2>
            {secondaryTitle && <p className="text-md text-muted-foreground">{secondaryTitle}</p>}
          </div>
        {description && (
          <MarkdownRenderer content={description} />
        )}
        {customLinks && customLinks.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {customLinks.map((link, idx) => (
              <Button key={idx} variant="outline" size="sm" asChild>
                <a href={link.url} target="_blank" rel="noopener noreferrer" title={link.title}>
                  {renderIcon(link.icon, "mr-2")}
                  {link.title}
                </a>
              </Button>
            ))}
          </div>
        )}
        </div>
      </div>
    </li>
  );
}
export default function CustomSectionListStatic({ section }: { section: StaticSectionData }) {
  if (!section || !section.items || section.items.length === 0) {
    return null;
  }
  const sectionId = section.section_name.toLowerCase().replace(/\s+/g, '-')
  return (
    <section id={`custom-${sectionId}`} className="mb-28 animate-in fade-in slide-in-from-bottom duration-700">
      <h2 className="text-3xl text-center font-bold text-primary mb-5">{section.section_name}</h2>
      <ul className="divide-y divide-border">
        {section.items.map((item, index) => (
          <ListItem
            key={index}
            primaryTitle={item.primaryTitle || ''}
            secondaryTitle={item.secondaryTitle || undefined}
            dateInfo={item.dateInfo || undefined}
            location={item.location || undefined}
            description={item.description || undefined}
            logoUrl={item.logoUrl || null}
            isFirst={index === 0}
            isLast={index === section.items.length - 1}
            customLinks={item.customLinks?.map((link) => ({
              title: link.title,
              url: link.url,
              icon: link.icon,
            }))}
          />
        ))}
      </ul>
    </section>
  );
}