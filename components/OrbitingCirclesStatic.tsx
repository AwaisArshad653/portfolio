"use client";
import { OrbitingCircles } from "@/components/ui/orbiting-circles"
import { useEffect, useState } from "react"
import Image from 'next/image';
interface StaticSkillsData {
  skills: Array<{
    name: string
    logo: string | null  // Pre-resolved SVG path, data URL, or null
  }>
}
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);
  return isMobile;
}
function useOrbitingCircles(skillsWithLogos: Array<{name: string, logo: string}>, maxOrbitingTechs: number = 36) {
  const orbitingTechs = skillsWithLogos.slice(0, maxOrbitingTechs);
  const remainingTechs = skillsWithLogos.slice(maxOrbitingTechs);
  const getCircleConfig = (techCount: number) => {
    if (techCount <= 8) {
      return {
        circles: [{
          techs: orbitingTechs,
          radius: { desktop: 200, mobile: 120 },
          duration: 20,
          iconSize: { desktop: 40, mobile: 32 },
          reverse: false
        }]
      };
    } else if (techCount <= 20) {
      const first = orbitingTechs.slice(0, Math.ceil(techCount * 0.6)); // 60% in first circle
      const second = orbitingTechs.slice(Math.ceil(techCount * 0.6), techCount);
      return {
        circles: [
          {
            techs: first,
            radius: { desktop: 220, mobile: 140 },
            duration: 20,
            iconSize: { desktop: 40, mobile: 32 },
            reverse: false
          },
          {
            techs: second,
            radius: { desktop: 120, mobile: 70 },
            duration: 20,
            iconSize: { desktop: 40, mobile: 32 },
            reverse: true
          }
        ]
      };
    } else if (techCount <= 36) {
      const first = orbitingTechs.slice(0, Math.ceil(techCount * 0.5)); // 50% in first circle
      const second = orbitingTechs.slice(Math.ceil(techCount * 0.5), Math.ceil(techCount * 0.8)); // 30% in second circle
      const third = orbitingTechs.slice(Math.ceil(techCount * 0.8), techCount); // 20% in third circle
      return {
        circles: [
          {
            techs: first,
            radius: { desktop: 220, mobile: 140 },
            duration: 25,
            iconSize: { desktop: 40, mobile: 32 },
            reverse: false
          },
          {
            techs: second,
            radius: { desktop: 140, mobile: 90 },
            duration: 20,
            iconSize: { desktop: 40, mobile: 32 },
            reverse: true
          },
          {
            techs: third,
            radius: { desktop: 70, mobile: 45 },
            duration: 15,
            iconSize: { desktop: 40, mobile: 32 },
            reverse: false
          }
        ]
      };
    } else {
      return { circles: [] };
    }
  };
  const circleConfig = getCircleConfig(orbitingTechs.length);
  const hasRemainingTechs = remainingTechs.length > 0;
  return { orbitingTechs, remainingTechs, circleConfig, hasRemainingTechs };
}
export default function OrbitingCirclesStatic({ skills }: StaticSkillsData) {
  const isMobile = useIsMobile();
  const skillsWithLogos = skills.filter(skill => skill.logo !== null) as Array<{name: string, logo: string}>;
  const skillsWithoutLogos = skills.filter(skill => skill.logo === null);
  const { orbitingTechs, remainingTechs, circleConfig, hasRemainingTechs } = useOrbitingCircles(skillsWithLogos);
  return (
    <section id="skills" className="mb-28">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-primary mb-5">Technical Skills</h2>
      </div>
      {}
      {isMobile && skillsWithLogos.length > 0 && (
        <div className="mb-8">
          <div className="grid grid-cols-3 gap-4">
            {skillsWithLogos.map((skill, index) => (
              <div
                key={`mobile-${index}`}
                className="flex flex-col items-center gap-2 p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-accent/50 transition-all duration-300"
              >
                {skill.logo && (
                  <Image
                    src={skill.logo}
                    alt={skill.name}
                    width={32}
                    height={32}
                    className="object-contain"
                    unoptimized
                  />
                )}
                <span className="text-xs text-center font-medium text-muted-foreground">
                  {skill.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      {}
      {!isMobile && orbitingTechs.length > 0 && (
        <div>
          <div className="flex justify-center mb-8">
            <div className="relative overflow-hidden h-[500px] w-full max-w-2xl">
              {circleConfig.circles.map((circle, circleIndex) => (
                <div key={`circle-${circleIndex}`} className="absolute inset-0">
                  <OrbitingCircles
                    radius={typeof circle.radius === 'object' ? circle.radius.desktop : circle.radius}
                    duration={circle.duration}
                    iconSize={typeof circle.iconSize === 'object' ? circle.iconSize.desktop : circle.iconSize}
                    path={true}
                    reverse={circle.reverse}
                    speed={1}
                  >
                    {circle.techs.map((skill, techIndex) => (
                      <div key={`circle-${circleIndex}-tech-${techIndex}`} className="flex items-center justify-center">
                        {skill.logo && (
                          <Image
                            src={skill.logo}
                            alt={skill.name}
                            width={typeof circle.iconSize === 'object' ? circle.iconSize.desktop : circle.iconSize}
                            height={typeof circle.iconSize === 'object' ? circle.iconSize.desktop : circle.iconSize}
                            className="object-contain"
                            unoptimized
                          />
                        )}
                      </div>
                    ))}
                  </OrbitingCircles>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {}
      {!isMobile && hasRemainingTechs && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-center mb-4">Additional Technologies</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {remainingTechs.map((skill, index) => (
              <div
                key={`remaining-grid-${index}`}
                className="group flex flex-col items-center gap-2 p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-accent/50 transition-all duration-200"
              >
                {skill.logo && (
                  <Image
                    src={skill.logo}
                    alt={skill.name}
                    width={40}
                    height={40}
                    className="object-contain group-hover:scale-110 transition-transform duration-200"
                    unoptimized
                  />
                )}
                <span className="text-xs text-center font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                  {skill.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      {}
      {skillsWithoutLogos.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-center mb-4">Other Skills</h3>
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {skillsWithoutLogos.map((skill, index) => (
              <div
                key={`other-${index}`}
                className="px-3 py-1 bg-muted rounded-full text-sm font-medium text-muted-foreground hover:bg-muted/80 transition-colors"
              >
                {skill.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}