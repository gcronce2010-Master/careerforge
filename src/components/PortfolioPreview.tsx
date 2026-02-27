
"use client";

import React from 'react';
import Image from 'next/image';
import { 
  Github, Linkedin, Mail, ExternalLink, Download, 
  ChevronDown, GraduationCap, Award, Briefcase, 
  Code, Star, Folder
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { PortfolioData } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface PortfolioPreviewProps {
  data: PortfolioData;
}

export function PortfolioPreview({ data }: PortfolioPreviewProps) {
  const { toast } = useToast();

  const profilePlaceholder = PlaceHolderImages.find(img => img.id === 'profile-picture');
  const displayImage = data.aboutMe.profileImage || profilePlaceholder?.imageUrl || "https://picsum.photos/seed/42/400/400";
  const imageHint = profilePlaceholder?.imageHint || "professional person";

  const handleExport = (format: 'md' | 'txt') => {
    let content = `# Portfolio: ${data.aboutMe.name || 'Professional Portfolio'}\n\n`;
    
    content += `## About Me\n${data.aboutMe.generatedContent || 'Role: ' + data.aboutMe.currentRole}\n\n`;
    
    content += `## Education\n`;
    data.education.forEach(edu => {
      content += `### ${edu.degreeName}\n${edu.institutionName} | ${edu.completionDate}\n${edu.coursework ? 'Focus: ' + edu.coursework : ''}\n\n`;
    });

    content += `## Experience\n`;
    data.experience.forEach(exp => {
      content += `### ${exp.jobTitle} at ${exp.organization}\n${exp.dates}\n${exp.refinedResponsibilities || exp.responsibilities}\n*Achievement:* ${exp.refinedAchievement || exp.achievement}\n\n`;
    });

    content += `## Projects\n`;
    data.projects.forEach(proj => {
      content += `### ${proj.title}\n${proj.refinedDescription || proj.description}\n*Stack:* ${proj.technologies}\n*Skills:* ${proj.skills}\n${proj.link ? 'Link: ' + proj.link : ''}\n\n`;
    });

    content += `## Skills\n`;
    content += `**Technical:** ${data.skills.technical.join(', ')}\n`;
    content += `**Tools:** ${data.skills.tools.join(', ')}\n`;
    content += `**Soft Skills:** ${data.skills.soft.join(', ')}\n\n`;

    content += `## Contact\nEmail: ${data.contact.email}\nLinkedIn: ${data.contact.linkedIn}\nGitHub: ${data.contact.github}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `portfolio-export.${format}`;
    link.click();
    
    toast({
      title: "Export Successful",
      description: `Your portfolio has been downloaded as .${format}`,
    });
  };

  return (
    <div className="relative h-full overflow-hidden flex flex-col bg-background rounded-3xl border shadow-2xl">
      {/* Header / Top Bar */}
      <div className="p-4 border-b flex items-center justify-between bg-card/50 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
          <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
          <span className="text-xs font-mono text-muted-foreground ml-2">preview:portfolio_v1.0</span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleExport('md')} className="text-xs h-8">
            <Download size={14} className="mr-2" /> Markdown
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExport('txt')} className="text-xs h-8">
            <Download size={14} className="mr-2" /> Plain Text
          </Button>
        </div>
      </div>

      {/* Main Preview Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-16">
        {/* Hero Section */}
        <section className="space-y-6 pt-8 animate-fade-in flex flex-col items-start md:flex-row md:items-center md:gap-10">
          <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden border-4 border-primary/20 shadow-xl group">
            <Image 
              src={displayImage}
              alt={data.aboutMe.name || "Profile"}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              data-ai-hint={imageHint}
            />
          </div>
          
          <div className="flex-1 space-y-4 pt-4 md:pt-0">
            <Badge variant="outline" className="border-primary/30 text-primary py-1 px-3 bg-primary/5 uppercase tracking-widest text-[10px] font-bold">
              Available for Opportunities
            </Badge>
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-extrabold font-headline leading-tight">
                {data.aboutMe.name || "Your Name"}
              </h1>
              <p className="text-xl md:text-2xl text-primary font-medium tracking-tight">
                {data.aboutMe.currentRole}
              </p>
            </div>
            
            <div className="flex gap-4 pt-2">
              {data.contact.linkedIn && (
                <Button size="icon" variant="secondary" className="rounded-full" asChild>
                  <a href={data.contact.linkedIn} target="_blank"><Linkedin size={20} /></a>
                </Button>
              )}
              {data.contact.github && (
                <Button size="icon" variant="secondary" className="rounded-full" asChild>
                  <a href={data.contact.github} target="_blank"><Github size={20} /></a>
                </Button>
              )}
              {data.contact.email && (
                <Button size="icon" variant="secondary" className="rounded-full" asChild>
                  <a href={`mailto:${data.contact.email}`}><Mail size={20} /></a>
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* Bio Section */}
        <section className="animate-fade-in" style={{ animationDelay: '0.05s' }}>
          <div className="max-w-3xl text-lg text-muted-foreground leading-relaxed">
            {data.aboutMe.generatedContent ? (
              <p className="whitespace-pre-wrap">{data.aboutMe.generatedContent}</p>
            ) : (
              <p className="italic opacity-60">Fill out the "About Me" section to see your AI-generated professional bio here.</p>
            )}
          </div>
        </section>

        {/* Experience Section */}
        {data.experience.length > 0 && (
          <section className="space-y-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 text-primary rounded-xl">
                <Briefcase size={24} />
              </div>
              <h2 className="text-3xl font-bold font-headline">Professional Experience</h2>
            </div>
            <div className="space-y-10">
              {data.experience.map((exp) => (
                <div key={exp.id} className="relative pl-8 border-l border-primary/20">
                  <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-primary" />
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-xl font-bold">{exp.jobTitle}</h3>
                      <span className="text-sm font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">{exp.dates}</span>
                    </div>
                    <p className="text-primary font-semibold text-lg">{exp.organization}</p>
                    <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {exp.refinedResponsibilities || exp.responsibilities}
                    </div>
                    {(exp.refinedAchievement || exp.achievement) && (
                      <div className="p-4 bg-primary/5 border border-primary/10 rounded-xl space-y-1">
                        <p className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                          <Star size={12} fill="currentColor" /> Key Achievement
                        </p>
                        <p className="text-sm italic">
                          {exp.refinedAchievement || exp.achievement}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects Section */}
        {data.projects.length > 0 && (
          <section className="space-y-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent/10 text-accent rounded-xl">
                <Folder size={24} />
              </div>
              <h2 className="text-3xl font-bold font-headline">Featured Projects</h2>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {data.projects.map((proj) => (
                <Card key={proj.id} className="overflow-hidden border-accent/20 bg-accent/5 hover:bg-accent/10 transition-colors">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold text-accent">{proj.title}</h3>
                      {proj.link && (
                        <Button size="sm" variant="outline" className="text-xs border-accent/30 text-accent" asChild>
                          <a href={proj.link} target="_blank">View Live <ExternalLink size={14} className="ml-2" /></a>
                        </Button>
                      )}
                    </div>
                    <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {proj.refinedDescription || proj.description}
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {proj.technologies.split(',').map((tech, i) => (
                        <Badge key={i} variant="secondary" className="bg-background text-[10px]">
                          {tech.trim()}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Education & Certs */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          {data.education.length > 0 && (
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 text-primary rounded-xl">
                  <GraduationCap size={24} />
                </div>
                <h2 className="text-2xl font-bold font-headline">Education</h2>
              </div>
              <div className="space-y-6">
                {data.education.map((edu) => (
                  <div key={edu.id} className="space-y-1">
                    <h3 className="text-lg font-bold">{edu.degreeName}</h3>
                    <p className="text-primary font-medium">{edu.institutionName}</p>
                    <p className="text-sm text-muted-foreground">{edu.completionDate}</p>
                    {edu.coursework && (
                      <p className="text-sm italic text-muted-foreground mt-2">Focus: {edu.coursework}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {data.certifications.length > 0 && (
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-accent/10 text-accent rounded-xl">
                  <Award size={24} />
                </div>
                <h2 className="text-2xl font-bold font-headline">Certifications</h2>
              </div>
              <div className="space-y-6">
                {data.certifications.map((cert) => (
                  <div key={cert.id} className="space-y-1">
                    <h3 className="text-lg font-bold">{cert.name}</h3>
                    <p className="text-accent font-medium">{cert.organization}</p>
                    <p className="text-sm text-muted-foreground">{cert.year}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Skills Section */}
        {(data.skills.technical.length > 0 || data.skills.tools.length > 0) && (
          <section className="space-y-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 text-primary rounded-xl">
                <Code size={24} />
              </div>
              <h2 className="text-3xl font-bold font-headline">Skills & Expertise</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <h3 className="font-bold text-lg border-b pb-2">Technical</h3>
                <div className="flex flex-wrap gap-2">
                  {data.skills.technical.map((skill, i) => (
                    <Badge key={i} className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">{skill}</Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-bold text-lg border-b pb-2">Tools & Tech</h3>
                <div className="flex flex-wrap gap-2">
                  {data.skills.tools.map((skill, i) => (
                    <Badge key={i} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-bold text-lg border-b pb-2">Professional</h3>
                <div className="flex flex-wrap gap-2">
                  {data.skills.soft.map((skill, i) => (
                    <Badge key={i} variant="outline" className="border-accent/30 text-accent">{skill}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="pt-12 pb-8 text-center text-sm text-muted-foreground border-t">
          <p>© {new Date().getFullYear()} {data.aboutMe.name || "Portfolio Builder"}. All rights reserved.</p>
          <div className="mt-4 flex justify-center gap-6">
            <a href="#" className="hover:text-primary transition-colors">Resume</a>
            <a href="#" className="hover:text-primary transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-primary transition-colors">GitHub</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
