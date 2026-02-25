"use client";

import React, { useState } from 'react';
import { 
  User, GraduationCap, Award, Briefcase, 
  Code2, FolderGit2, Mail, Sparkles, Plus, Trash2, 
  ChevronRight, ChevronDown, CheckCircle2, Wand2, Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { PortfolioData, Education, Certification, WorkExperience, Project } from '@/lib/types';
import { generateAboutMeSection } from '@/ai/flows/generate-about-me-section';
import { refineExperienceAndProjects } from '@/ai/flows/refine-experience-and-projects';
import { useToast } from '@/hooks/use-toast';

interface PortfolioFormProps {
  data: PortfolioData;
  onChange: (newData: PortfolioData) => void;
}

export function PortfolioForm({ data, onChange }: PortfolioFormProps) {
  const { toast } = useToast();
  const [isGeneratingAboutMe, setIsGeneratingAboutMe] = useState(false);
  const [isRefiningExperience, setIsRefiningExperience] = useState(false);

  const updateField = (section: keyof PortfolioData, field: string, value: any) => {
    onChange({
      ...data,
      [section]: {
        ...(data[section] as any),
        [field]: value,
      },
    });
  };

  const handleGenerateAboutMe = async () => {
    setIsGeneratingAboutMe(true);
    try {
      const result = await generateAboutMeSection({
        currentRoleOrFocus: data.aboutMe.currentRole,
        fieldsOfInterest: data.aboutMe.interests,
        shortTermGoal: data.aboutMe.shortTermGoal,
        longTermGoal: data.aboutMe.longTermGoal,
        overallStyle: 'modern & tech',
        layoutType: 'single-page scroll',
        targetAudience: 'employers and tech recruiters',
      });
      updateField('aboutMe', 'generatedContent', result.aboutMeContent);
      toast({
        title: "About Me Generated",
        description: "Your professional bio has been crafted by AI.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate bio. Please try again.",
      });
    } finally {
      setIsGeneratingAboutMe(false);
    }
  };

  const handleRefineExperience = async () => {
    if (data.experience.length === 0 && data.projects.length === 0) {
      toast({
        variant: "destructive",
        title: "No Content",
        description: "Please add some work experience or projects first.",
      });
      return;
    }
    
    setIsRefiningExperience(true);
    try {
      const result = await refineExperienceAndProjects({
        workExperiences: data.experience.map(exp => ({
          jobTitle: exp.jobTitle,
          organization: exp.organization,
          datesOfInvolvement: exp.dates,
          keyResponsibilities: exp.responsibilities,
          keyAchievementOrOutcome: exp.achievement,
        })),
        projects: data.projects.map(proj => ({
          projectTitle: proj.title,
          projectPurposeProblemSolved: proj.description,
          toolsOrTechnologiesUsed: proj.technologies,
          skillsDemonstrated: proj.skills,
          projectLink: proj.link,
        })),
      });

      const updatedExp = data.experience.map((exp, idx) => ({
        ...exp,
        refinedResponsibilities: result.refinedWorkExperiences[idx]?.refinedResponsibilities,
        refinedAchievement: result.refinedWorkExperiences[idx]?.refinedAchievementOrOutcome,
      }));

      const updatedProj = data.projects.map((proj, idx) => ({
        ...proj,
        refinedDescription: result.refinedProjects[idx]?.refinedProjectDescription,
      }));

      onChange({
        ...data,
        experience: updatedExp,
        projects: updatedProj,
      });

      toast({
        title: "Content Refined",
        description: "Your work history and projects have been professionally enhanced.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to refine content. Please try again.",
      });
    } finally {
      setIsRefiningExperience(false);
    }
  };

  const addItem = (section: 'education' | 'certifications' | 'experience' | 'projects') => {
    const newItems = [...data[section]];
    const id = Date.now().toString();
    if (section === 'education') newItems.push({ id, degreeName: '', institutionName: '', completionDate: '', coursework: '' });
    else if (section === 'certifications') newItems.push({ id, name: '', organization: '', year: '', url: '' });
    else if (section === 'experience') newItems.push({ id, jobTitle: '', organization: '', dates: '', responsibilities: '', achievement: '' });
    else if (section === 'projects') newItems.push({ id, title: '', description: '', technologies: '', skills: '', link: '' });
    
    onChange({ ...data, [section]: newItems });
  };

  const removeItem = (section: 'education' | 'certifications' | 'experience' | 'projects', id: string) => {
    onChange({ ...data, [section]: data[section].filter((item: any) => item.id !== id) });
  };

  const updateItem = (section: 'education' | 'certifications' | 'experience' | 'projects', id: string, field: string, value: any) => {
    const newItems = data[section].map((item: any) => item.id === id ? { ...item, [field]: value } : item);
    onChange({ ...data, [section]: newItems });
  };

  return (
    <div className="space-y-6 pb-20">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary">Build Your Portfolio</h1>
          <p className="text-muted-foreground mt-1">Guided professional branding with AI.</p>
        </div>
      </header>

      <Accordion type="single" collapsible className="space-y-4" defaultValue="about">
        {/* About Me */}
        <AccordionItem value="about" className="border rounded-xl bg-card px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <User size={20} />
              </div>
              <span className="font-semibold text-lg">About Me</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <Input 
                  placeholder="e.g. Alex Rivera" 
                  value={data.aboutMe.name}
                  onChange={(e) => updateField('aboutMe', 'name', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Current Role / Focus</label>
                <Input 
                  placeholder="e.g. Sales Manager" 
                  value={data.aboutMe.currentRole}
                  onChange={(e) => updateField('aboutMe', 'currentRole', e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Interests (Comma separated)</label>
              <Input 
                placeholder="AI, Software Engineering, etc." 
                value={data.aboutMe.interests}
                onChange={(e) => updateField('aboutMe', 'interests', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Short-term Goal</label>
                <Input 
                  placeholder="What's next?" 
                  value={data.aboutMe.shortTermGoal}
                  onChange={(e) => updateField('aboutMe', 'shortTermGoal', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Long-term Goal</label>
                <Input 
                  placeholder="Where do you see yourself?" 
                  value={data.aboutMe.longTermGoal}
                  onChange={(e) => updateField('aboutMe', 'longTermGoal', e.target.value)}
                />
              </div>
            </div>
            <div className="pt-2">
              <Button 
                onClick={handleGenerateAboutMe} 
                disabled={isGeneratingAboutMe}
                className="w-full bg-accent hover:bg-accent/90 text-white font-semibold gap-2"
              >
                {isGeneratingAboutMe ? <Sparkles className="animate-pulse" /> : <Wand2 size={18} />}
                {isGeneratingAboutMe ? "Crafting Bio..." : "AI Generate 'About Me'"}
              </Button>
            </div>
            {data.aboutMe.generatedContent && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-primary flex items-center gap-2">
                  <CheckCircle2 size={14} /> AI Result
                </label>
                <Textarea 
                  rows={6}
                  value={data.aboutMe.generatedContent}
                  onChange={(e) => updateField('aboutMe', 'generatedContent', e.target.value)}
                  className="font-body text-sm leading-relaxed"
                />
              </div>
            )}
          </AccordionContent>
        </AccordionItem>

        {/* Education */}
        <AccordionItem value="education" className="border rounded-xl bg-card px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <GraduationCap size={20} />
              </div>
              <span className="font-semibold text-lg">Education</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-6 pt-4 pb-6">
            {data.education.map((edu) => (
              <Card key={edu.id} className="relative group">
                <Button 
                  variant="ghost" size="icon" 
                  className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeItem('education', edu.id)}
                >
                  <Trash2 size={16} className="text-destructive" />
                </Button>
                <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Degree Name</label>
                    <Input 
                      value={edu.degreeName} 
                      onChange={(e) => updateItem('education', edu.id, 'degreeName', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Institution</label>
                    <Input 
                      value={edu.institutionName} 
                      onChange={(e) => updateItem('education', edu.id, 'institutionName', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Completion Date</label>
                    <Input 
                      value={edu.completionDate} 
                      onChange={(e) => updateItem('education', edu.id, 'completionDate', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Focus Areas</label>
                    <Input 
                      value={edu.coursework} 
                      onChange={(e) => updateItem('education', edu.id, 'coursework', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button variant="outline" onClick={() => addItem('education')} className="w-full border-dashed">
              <Plus size={18} className="mr-2" /> Add Education
            </Button>
          </AccordionContent>
        </AccordionItem>

        {/* Work Experience */}
        <AccordionItem value="experience" className="border rounded-xl bg-card px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Briefcase size={20} />
              </div>
              <span className="font-semibold text-lg">Work Experience</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-6 pt-4 pb-6">
            {data.experience.map((exp) => (
              <Card key={exp.id} className="relative group">
                <Button 
                  variant="ghost" size="icon" 
                  className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeItem('experience', exp.id)}
                >
                  <Trash2 size={16} className="text-destructive" />
                </Button>
                <CardContent className="pt-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Job Title</label>
                      <Input value={exp.jobTitle} onChange={(e) => updateItem('experience', exp.id, 'jobTitle', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Organization</label>
                      <Input value={exp.organization} onChange={(e) => updateItem('experience', exp.id, 'organization', e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Dates</label>
                    <Input value={exp.dates} onChange={(e) => updateItem('experience', exp.id, 'dates', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Responsibilities</label>
                    <Textarea value={exp.responsibilities} onChange={(e) => updateItem('experience', exp.id, 'responsibilities', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Key Achievement</label>
                    <Textarea value={exp.achievement} onChange={(e) => updateItem('experience', exp.id, 'achievement', e.target.value)} />
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button variant="outline" onClick={() => addItem('experience')} className="w-full border-dashed">
              <Plus size={18} className="mr-2" /> Add Experience
            </Button>
          </AccordionContent>
        </AccordionItem>

        {/* Projects */}
        <AccordionItem value="projects" className="border rounded-xl bg-card px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <FolderGit2 size={20} />
              </div>
              <span className="font-semibold text-lg">Projects</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-6 pt-4 pb-6">
            {data.projects.map((proj) => (
              <Card key={proj.id} className="relative group">
                <Button 
                  variant="ghost" size="icon" 
                  className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeItem('projects', proj.id)}
                >
                  <Trash2 size={16} className="text-destructive" />
                </Button>
                <CardContent className="pt-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Project Title</label>
                      <Input value={proj.title} onChange={(e) => updateItem('projects', proj.id, 'title', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Project Link</label>
                      <Input value={proj.link} onChange={(e) => updateItem('projects', proj.id, 'link', e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Purpose / Problem Solved</label>
                    <Textarea value={proj.description} onChange={(e) => updateItem('projects', proj.id, 'description', e.target.value)} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Technologies</label>
                      <Input value={proj.technologies} onChange={(e) => updateItem('projects', proj.id, 'technologies', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Skills Demonstrated</label>
                      <Input value={proj.skills} onChange={(e) => updateItem('projects', proj.id, 'skills', e.target.value)} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button variant="outline" onClick={() => addItem('projects')} className="w-full border-dashed">
              <Plus size={18} className="mr-2" /> Add Project
            </Button>
          </AccordionContent>
        </AccordionItem>

        {/* Skills */}
        <AccordionItem value="skills" className="border rounded-xl bg-card px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Code2 size={20} />
              </div>
              <span className="font-semibold text-lg">Skills</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-6 pt-4 pb-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Technical Skills (Enter separated by commas)</label>
                <Textarea 
                  placeholder="e.g. Python, Machine Learning, Cybersecurity" 
                  value={data.skills.technical.join(', ')}
                  onChange={(e) => updateField('skills', 'technical', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tools & Technologies</label>
                <Textarea 
                  placeholder="e.g. Docker, Git, VS Code" 
                  value={data.skills.tools.join(', ')}
                  onChange={(e) => updateField('skills', 'tools', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Professional / Soft Skills</label>
                <Textarea 
                  placeholder="e.g. Leadership, Communication, Problem Solving" 
                  value={data.skills.soft.join(', ')}
                  onChange={(e) => updateField('skills', 'soft', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Contact */}
        <AccordionItem value="contact" className="border rounded-xl bg-card px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Mail size={20} />
              </div>
              <span className="font-semibold text-lg">Contact & Links</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Address</label>
                <Input value={data.contact.email} onChange={(e) => updateField('contact', 'email', e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">LinkedIn URL</label>
                <Input value={data.contact.linkedIn} onChange={(e) => updateField('contact', 'linkedIn', e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">GitHub URL</label>
                <Input value={data.contact.github} onChange={(e) => updateField('contact', 'github', e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Other Relevant Links</label>
                <Input value={data.contact.other} onChange={(e) => updateField('contact', 'other', e.target.value)} />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="sticky bottom-6 flex gap-4">
        <Button 
          onClick={handleRefineExperience} 
          disabled={isRefiningExperience}
          className="flex-1 bg-accent hover:bg-accent/90 text-white shadow-xl py-6 rounded-xl font-bold text-base gap-2"
        >
          {isRefiningExperience ? <Sparkles className="animate-pulse" /> : <Sparkles size={20} />}
          {isRefiningExperience ? "Refining Content..." : "AI Refine All Content"}
        </Button>
      </div>
    </div>
  );
}
