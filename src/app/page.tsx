
"use client";

import React, { useState, useEffect } from 'react';
import { PortfolioForm } from '@/components/PortfolioForm';
import { PortfolioPreview } from '@/components/PortfolioPreview';
import { initialPortfolioData, PortfolioData } from '@/lib/types';
import { Toaster } from '@/components/ui/toaster';
import { Zap, Layout, Loader2 } from 'lucide-react';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

export default function Home() {
  const [portfolioData, setPortfolioData] = useState<PortfolioData>(initialPortfolioData);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const db = useFirestore();
  const docRef = useMemoFirebase(() => (db ? doc(db, 'portfolios', 'user-portfolio') : null), [db]);
  const { data: remoteData, loading: isDocLoading } = useDoc<PortfolioData>(docRef);

  // Load data from Firestore once on mount with deep merging
  useEffect(() => {
    // Only proceed once the document reference is established and loading is complete
    if (docRef && !isDocLoading && !isInitialized) {
      if (remoteData) {
        const mergedData: PortfolioData = {
          ...initialPortfolioData,
          ...remoteData,
          aboutMe: { ...initialPortfolioData.aboutMe, ...(remoteData.aboutMe || {}) },
          skills: { ...initialPortfolioData.skills, ...(remoteData.skills || {}) },
          contact: { ...initialPortfolioData.contact, ...(remoteData.contact || {}) },
          education: remoteData.education || initialPortfolioData.education || [],
          certifications: remoteData.certifications || [],
          experience: remoteData.experience || initialPortfolioData.experience || [],
          projects: remoteData.projects || [],
        };
        setPortfolioData(mergedData);
      }
      setIsInitialized(true);
    }
  }, [remoteData, isDocLoading, isInitialized, docRef]);

  return (
    <main className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05] z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent blur-[120px]" />
      </div>

      <div className="relative z-10 container mx-auto h-screen flex flex-col lg:flex-row gap-8 py-6 px-4">
        {/* Left Side: Forms */}
        <section className="w-full lg:w-[450px] xl:w-[550px] flex flex-col h-full overflow-hidden">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-xl shadow-lg shadow-primary/20">
                <Zap className="text-white fill-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold font-headline leading-tight">CareerForge <span className="text-primary">AI</span></h1>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">The Modern Resume Engine</p>
              </div>
            </div>
            {isDocLoading && !isInitialized && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground animate-pulse">
                <Loader2 className="animate-spin" size={12} />
                Loading your data...
              </div>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
            <PortfolioForm data={portfolioData} onChange={setPortfolioData} />
          </div>
        </section>

        {/* Right Side: Real-time Preview */}
        <section className="hidden lg:flex flex-1 h-full flex-col relative">
          <div className="absolute -top-4 left-4 z-10">
            <div className="bg-card border px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
              <Layout size={14} className="text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Portfolio Preview</span>
            </div>
          </div>
          <PortfolioPreview data={portfolioData} />
        </section>
      </div>
      <Toaster />
    </main>
  );
}
