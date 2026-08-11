"use client";
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CardBody, CardContainer, CardItem } from '@/components/ui/3d-card';
import Image from 'next/image';
import { renderIcon } from "@/lib/hybrid-icon-resolver";
import { withBasePath } from "@/lib/utils";
import { MarkdownRenderer } from './MarkdownRenderer';
import { SectionEyebrow } from './SectionEyebrow';
interface StaticProjectsData {
  projects: Array<{
    name: string | null
    description: string | null
    picUrl: string | null
    technologies: Array<{
      name: string
      logo: string | null
    }>
    custom_links: Array<{
      icon: string      // Library key OR custom SVG data
      title: string
      url: string
    }>
  }>
}
export default function ThreeDCardStatic({ projects }: StaticProjectsData) {
  return (
    <section id="projects" className="mb-28 scroll-mt-24">
      <div className="max-w-6xl mx-auto">
        <SectionEyebrow method="GET" path="/projects" note={`${projects.length} results`} />
        <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-8">Projects</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {projects.map((project, index) => {
            return (
              <CardContainer key={index} className="inter-var" containerClassName="flex items-start justify-center">
                <CardBody className="relative group/card bg-card/70 backdrop-blur hover:shadow-2xl hover:shadow-primary/5 border-border hover:border-primary/40 w-full max-w-md h-auto rounded-xl p-6 border flex flex-col transition-colors">
                  <CardItem
                    translateZ="50"
                    className="font-display text-xl font-bold text-card-foreground break-words"
                  >
                    {project.name}
                  </CardItem>
                  {project.description && (
                    <CardItem
                      as="div"
                      translateZ="60"
                      className="text-sm mt-2 break-words"
                    >
                      <MarkdownRenderer content={project.description} />
                    </CardItem>
                  )}
                  {project.picUrl && (
                    <CardItem translateZ="100" className="w-full mt-4">
                      <div className="relative aspect-video w-full overflow-hidden rounded-xl">
                        <Image
                          src={withBasePath(project.picUrl)}
                          alt={project.name || 'Project image'}
                          fill
                          className="object-cover group-hover/card:shadow-xl"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          priority={index < 2}
                        />
                      </div>
                    </CardItem>
                  )}
                  {project.technologies && project.technologies.length > 0 && (
                    <CardItem
                      translateZ="60"
                      className="flex flex-wrap gap-2 mt-4"
                    >
                      {project.technologies.slice(0, 5).map((tech, techIndex) => (
                        <div key={techIndex} className="flex items-center gap-1">
                          {tech.logo && (
                            <Image
                              src={withBasePath(tech.logo)}
                              alt={tech.name}
                              width={16}
                              height={16}
                              className="object-contain"
                              unoptimized
                            />
                          )}
                          <span className="font-mono text-[11px] text-muted-foreground break-all">{tech.name}</span>
                        </div>
                      ))}
                      {project.technologies.length > 5 && (
                        <Badge variant="outline" className="text-xs font-mono">
                          +{project.technologies.length - 5} more
                        </Badge>
                      )}
                    </CardItem>
                  )}
                  {project.custom_links && project.custom_links.length > 0 && (
                    <CardItem translateZ={20} className="mt-auto pt-4">
                      <div className="flex flex-wrap gap-2">
                        {project.custom_links.map((link, linkIndex) => (
                          <a
                            key={linkIndex}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={link.title}
                            className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 font-mono text-xs text-muted-foreground hover:text-primary hover:border-primary/60 transition-colors break-all"
                          >
                            {renderIcon(link.icon)}
                            {link.title}
                          </a>
                        ))}
                      </div>
                    </CardItem>
                  )}
                </CardBody>
              </CardContainer>
            );
          })}
        </div>
      </div>
    </section>
  )
}