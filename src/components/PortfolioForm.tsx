
"use client";

import React, { useState, useCallback, useRef } from 'react';
import { 
  User, GraduationCap, Briefcase, 
  Code2, FolderGit2, Mail, Sparkles, Plus, Trash2, 
  CheckCircle2, Wand2, Save, CloudUpload, Check, Award, Image as ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { PortfolioData } from '@/lib/types';
import { generateAboutMeSection } from '@/ai/flows/generate-about-me-section';
import { refineExperienceAndProjects } from '@/ai/flows/refine-experience-and-projects';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { cn } from '@/lib/utils';

interface PortfolioFormProps {
  data: PortfolioData;
  onChange: (newData: PortfolioData) => void;
}

export function PortfolioForm({ data, onChange }: PortfolioFormProps) {
  const { toast } = useToast();
  const db = useFirestore();
  const [isGeneratingAboutMe, setIsGeneratingAboutMe] = useState(false);
  const [isRefiningExperience, setIsRefiningExperience] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedAutoSave = useCallback((newData: PortfolioData) => {
    setIsAutoSaving(true);
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(() => {
      if (!db) return;
      const docRef = doc(db, 'portfolios', 'user-portfolio');
      
      setDoc(docRef, newData, { merge: true })
        .then(() => {
          setIsAutoSaving(false);
        })
        .catch(async (error) => {
          setIsAutoSaving(false);
          const permissionError = new FirestorePermissionError({
            path: docRef.path,
            operation: 'write',
            requestResourceData: newData,
          });
          errorEmitter.emit('permission-error', permissionError);
        });
    }, 1500);
  }, [db]);

  const updateField = (section: keyof PortfolioData, field: string, value: any) => {
    const newData = {
      ...data,
      [section]: {
        ...(data[section] as any),
        [field]: value,
      },
    };
    onChange(newData);
    debouncedAutoSave(newData);
  };

  const handleManualSave = (sectionName: string, sectionKey: keyof PortfolioData) => {
    if (!db) return;
    
    const docRef = doc(db, 'portfolios', 'user-portfolio');
    const updateData = { [sectionKey]: data[sectionKey] };

    setDoc(docRef, updateData, { merge: true })
      .then(() => {
        toast({
          title: `${sectionName} Saved`,
          description: "Changes captured to cloud.",
        });
      })
      .catch(async (error) => {
        const permissionError = new FirestorePermissionError({
          path: docRef.path,
          operation: 'update',
          requestResourceData: updateData,
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  const handleSaveAll = () => {
    if (!db) return;
    const docRef = doc(db, 'portfolios', 'user-portfolio');
    setDoc(docRef, data, { merge: true })
      .then(() => {
        toast({
          title: "All Content Saved",
          description: "Your entire portfolio has been synced to the cloud.",
        });
      })
      .catch(async (error) => {
        const permissionError = new FirestorePermissionError({
          path: docRef.path,
          operation: 'write',
          requestResourceData: data,
        });
        errorEmitter.emit('permission-error', permissionError);
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
        projects: (data.projects || []).map(proj => ({
          projectTitle: proj.title,
          projectPurposeProblemSolved: proj.description,
          toolsOrTechnologiesUsed: proj.technologies,
          skillsDemonstrated: proj.skills,
          projectLink: proj.link || '',
        })),
      });

      const updatedExp = data.experience.map((exp, idx) => ({
        ...exp,
        refinedResponsibilities: result.refinedWorkExperiences[idx]?.refinedResponsibilities,
        refinedAchievement: result.refinedWorkExperiences[idx]?.refinedAchievementOrOutcome,
      }));

      const updatedProj = (data.projects || []).map((proj, idx) => ({
        ...proj,
        refinedDescription: result.refinedProjects[idx]?.refinedProjectDescription,
      }));

      const finalData = {
        ...data,
        experience: updatedExp,
        projects: updatedProj,
      };

      onChange(finalData);
      debouncedAutoSave(finalData);

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
    const currentItems = data[section] || [];
    const newItems = [...currentItems];
    const id = Date.now().toString();
    
    if (section === 'education') newItems.push({ id, degreeName: '', institutionName: '', completionDate: '', coursework: '' });
    else if (section === 'experience') newItems.push({ id, jobTitle: '', organization: '', dates: '', responsibilities: '', achievement: '' });
    else if (section === 'projects') newItems.push({ id, title: '', description: '', technologies: '', skills: '', link: '' });
    else if (section === 'certifications') newItems.push({ id, name: '', organization: '', year: '' });
    
    const newData = { ...data, [section]: newItems };
    onChange(newData);
    debouncedAutoSave(newData);
  };

  const removeItem = (section: 'education' | 'certifications' | 'experience' | 'projects', id: string) => {
    const currentItems = data[section] || [];
    const newData = { ...data, [section]: currentItems.filter((item: any) => item.id !== id) };
    onChange(newData);
    debouncedAutoSave(newData);
  };

  const updateItem = (section: 'education' | 'certifications' | 'experience' | 'projects', id: string, field: string, value: any) => {
    const currentItems = data[section] || [];
    const newItems = currentItems.map((item: any) => item.id === id ? { ...item, [field]: value } : item);
    const newData = { ...data, [section]: newItems };
    onChange(newData);
    debouncedAutoSave(newData);
  };

  return (
    <div className="space-y-6 pb-20 relative">
      <header className="flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-30 py-4 -mx-4 px-4 border-b mb-4">
        <div>
          <h1 className="text-2xl font-bold font-headline text-primary">Build Your Portfolio</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Cloud sync active</p>
        </div>
        <div className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300",
          isAutoSaving ? "bg-amber-500/10 text-amber-500" : "bg-emerald-500/10 text-emerald-500"
        )}>
          {isAutoSaving ? (
            <><CloudUpload size={12} className="animate-bounce" /> Syncing...</>
          ) : (
            <><Check size={12} /> Cloud Synced</>
          )}
        </div>
      </header>

      <Accordion type="single" collapsible className="space-y-4" defaultValue="about">
        {/* About Me */}
        <AccordionItem value="about" className="border rounded-xl bg-card px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3 text-left">
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
              <label className="text-sm font-medium flex items-center gap-2">
                <ImageIcon size={14} /> Profile Image URL
              </label>
              <Input 
                placeholder="https://example.com/photo.jpg" 
                value={data.aboutMe.profileImage || ''}
                onChange={(e) => updateField('aboutMe', 'profileImage', e.target.value)}
              />
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
            <div className="flex gap-2 pt-2">
              <Button 
                onClick={handleGenerateAboutMe} 
                disabled={isGeneratingAboutMe}
                className="flex-1 bg-accent hover:bg-accent/90 text-white font-semibold gap-2"
              >
                {isGeneratingAboutMe ? <Sparkles className="animate-pulse" /> : <Wand2 size={18} />}
                {isGeneratingAboutMe ? "Crafting Bio..." : "AI Generate Bio"}
              </Button>
              <Button 
                variant="outline"
                onClick={() => handleManualSave('About Me', 'aboutMe')}
                className="gap-2"
              >
                <Save size={18} /> Save Section
              </Button>
            </div>
            {data.aboutMe.generatedContent && (
              <div className="space-y-2 pt-4">
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
            <div className="flex items-center gap-3 text-left">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <GraduationCap size={20} />
              </div>
              <span className="font-semibold text-lg">Education</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-6 pt-4 pb-6">
            {(data.education || []).map((edu) => (
              <Card key={edu.id} className="relative group border-primary/10">
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
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => addItem('education')} className="flex-1 border-dashed">
                <Plus size={18} className="mr-2" /> Add Education
              </Button>
              <Button onClick={() => handleManualSave('Education', 'education')} className="gap-2">
                <Save size={18} /> Save Section
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Certifications */}
        <AccordionItem value="certifications" className="border rounded-xl bg-card px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3 text-left">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Award size={20} />
              </div>
              <span className="font-semibold text-lg">Certifications</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-6 pt-4 pb-6">
            {(data.certifications || []).map((cert) => (
              <Card key={cert.id} className="relative group border-primary/10">
                <Button 
                  variant="ghost" size="icon" 
                  className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeItem('certifications', cert.id)}
                >
                  <Trash2 size={16} className="text-destructive" />
                </Button>
                <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Certification Name</label>
                    <Input 
                      value={cert.name} 
                      onChange={(e) => updateItem('certifications', cert.id, 'name', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Issuing Organization</label>
                    <Input 
                      value={cert.organization} 
                      onChange={(e) => updateItem('certifications', cert.id, 'organization', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Year Obtained</label>
                    <Input 
                      value={cert.year} 
                      onChange={(e) => updateItem('certifications', cert.id, 'year', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => addItem('certifications')} className="flex-1 border-dashed">
                <Plus size={18} className="mr-2" /> Add Certification
              </Button>
              <Button onClick={() => handleManualSave('Certifications', 'certifications')} className="gap-2">
                <Save size={18} /> Save Section
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Work Experience */}
        <AccordionItem value="experience" className="border rounded-xl bg-card px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3 text-left">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Briefcase size={20} />
              </div>
              <span className="font-semibold text-lg">Work Experience</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-6 pt-4 pb-6">
            {(data.experience || []).map((exp) => (
              <Card key={exp.id} className="relative group border-primary/10">
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
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => addItem('experience')} className="flex-1 border-dashed">
                <Plus size={18} className="mr-2" /> Add Experience
              </Button>
              <Button onClick={() => handleManualSave('Work Experience', 'experience')} className="gap-2">
                <Save size={18} /> Save Section
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Projects */}
        <AccordionItem value="projects" className="border rounded-xl bg-card px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3 text-left">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <FolderGit2 size={20} />
              </div>
              <span className="font-semibold text-lg">Projects</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-6 pt-4 pb-6">
            {(data.projects || []).map((proj) => (
              <Card key={proj.id} className="relative group border-accent/20">
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
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => addItem('projects')} className="flex-1 border-dashed">
                <Plus size={18} className="mr-2" /> Add Project
              </Button>
              <Button onClick={() => handleManualSave('Projects', 'projects')} className="gap-2">
                <Save size={18} /> Save Section
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Skills */}
        <AccordionItem value="skills" className="border rounded-xl bg-card px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3 text-left">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Code2 size={20} />
              </div>
              <span className="font-semibold text-lg">Skills</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-6 pt-4 pb-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Technical Skills (Comma separated)</label>
                <Textarea 
                  placeholder="e.g. Python, Machine Learning, Quickbooks" 
                  value={(data.skills.technical || []).join(', ')}
                  onChange={(e) => updateField('skills', 'technical', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tools & Technologies</label>
                <Textarea 
                  placeholder="e.g. Excel, Docker, SAP" 
                  value={(data.skills.tools || []).join(', ')}
                  onChange={(e) => updateField('skills', 'tools', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Professional / Soft Skills</label>
                <Textarea 
                  placeholder="e.g. Leadership, Team Motivation" 
                  value={(data.skills.soft || []).join(', ')}
                  onChange={(e) => updateField('skills', 'soft', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                />
              </div>
              <Button onClick={() => handleManualSave('Skills', 'skills')} className="w-full gap-2">
                <Save size={18} /> Save Skills
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Contact */}
        <AccordionItem value="contact" className="border rounded-xl bg-card px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3 text-left">
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
                <label className="text-sm font-medium">Other Link</label>
                <Input value={data.contact.other || ''} onChange={(e) => updateField('contact', 'other', e.target.value)} />
              </div>
            </div>
            <Button onClick={() => handleManualSave('Contact Info', 'contact')} className="w-full gap-2">
              <Save size={18} /> Save Contact Info
            </Button>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="sticky bottom-6 flex gap-4 pt-4">
        <Button 
          onClick={handleRefineExperience} 
          disabled={isRefiningExperience}
          className="flex-1 bg-accent hover:bg-accent/90 text-white shadow-xl py-6 rounded-xl font-bold text-base gap-2"
        >
          {isRefiningExperience ? <Sparkles className="animate-pulse" /> : <Sparkles size={20} />}
          {isRefiningExperience ? "Refining Content..." : "AI Refine All Content"}
        </Button>
        <Button 
          variant="outline"
          onClick={handleSaveAll}
          className="bg-card shadow-xl py-6 rounded-xl font-bold text-base gap-2 px-6"
        >
          <Save size={20} />
        </Button>
      </div>
    </div>
  );
}
