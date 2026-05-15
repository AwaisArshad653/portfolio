"use client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Mail, FileDown } from "lucide-react";
import { renderIcon } from "@/lib/hybrid-icon-resolver";
import { MarkdownRenderer } from './MarkdownRenderer';
interface StaticPersonalData {
  personal: {
    full_name: string | null
    title: string | null
    about_me: string | null
    location: string | null
    avatarUrl: string | null
    cvUrl: string | null
    custom_links: Array<{
      icon: string      // Library key OR custom SVG data
      title: string
      url: string
    }>
  }
}
export default function MinimalProfileStatic({ personal }: StaticPersonalData) {
  return (
    <header className="text-center mb-28">
        {personal.avatarUrl && (
          <Avatar className="size-32 mx-auto mb-6 !rounded-full">
            <AvatarImage
              src={personal.avatarUrl}
              alt="Profile preview"
              className="!rounded-full"
            />
            <AvatarFallback className="!rounded-full">
              {personal.full_name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
        )}
        <h1 className="text-4xl font-bold mb-2">{personal.full_name}</h1>
        {personal.title && (
          <p className="text-xl text-muted-foreground mb-4">{personal.title}</p>
        )}
        {personal.location && (
          <p className="text-muted-foreground mb-4">{personal.location}</p>
        )}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {personal.custom_links?.find(link => link.icon === 'email') && (
            <Button variant="outline" size="sm" asChild>
              <a href={`mailto:${personal.custom_links.find(link => link.icon === 'email')?.url}`} aria-label="Email">
                <Mail className="mr-2 h-4 w-4" />
                Email
              </a>
            </Button>
          )}
          {personal.cvUrl && (
            <Button variant="outline" size="sm" asChild>
              <a href={personal.cvUrl} target="_blank" rel="noopener noreferrer" aria-label="Download CV">
                <FileDown className="mr-2 w-4 h-4" />
                Resume
              </a>
            </Button>
          )}
          {personal.custom_links && personal.custom_links.length > 0 && personal.custom_links
            .filter(link => link.icon !== 'email') // Exclude email since we handle it separately
            .map((link, index) => (
              <Button key={index} variant="outline" size="sm" asChild>
                <a href={link.url} target="_blank" rel="noopener noreferrer" title={link.title}>
                  {renderIcon(link.icon, "mr-2")}
                  {link.title}
                </a>
              </Button>
            ))}
        </div>
        {personal.about_me && (
          <MarkdownRenderer content={personal.about_me} className="text-center text-muted-foreground leading-relaxed" />
        )}
    </header>
  );
}