import React, { useState, useEffect } from 'react';
import { View, Language, Artifact, UserProfile } from './types';
import { INITIAL_ARTIFACTS, DICTIONARY } from './data/initialData';
import { LanguageSelector } from './components/LanguageSelector';
import { HomeView } from './components/HomeView';
import { GalleryView } from './components/GalleryView';
import { AddArtifactView } from './components/AddArtifactView';
import { ChroniclesView } from './components/ChroniclesView';
import { DetailView } from './components/DetailView';
import { 
  Home, 
  Landmark, 
  Plus, 
  BookOpen, 
  User, 
  Smartphone, 
  Laptop, 
  Menu, 
  Heart, 
  Settings, 
  X,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // Persistence state
  const [artifacts, setArtifacts] = useState<Artifact[]>(() => {
    const local = localStorage.getItem('digital_sanctuary_artifacts');
    return local ? JSON.parse(local) : INITIAL_ARTIFACTS;
  });

  const [language, setLanguage] = useState<Language>(() => {
    const local = localStorage.getItem('digital_sanctuary_lang');
    return (local as Language) || 'en';
  });

  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedArtifactId, setSelectedArtifactId] = useState<string | null>(null);
  
  // Custom Profile state
  const [profile, setUserProfile] = useState<UserProfile>(() => {
    const local = localStorage.getItem('digital_sanctuary_profile');
    return local ? JSON.parse(local) : {
      name: 'Izam',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWyUgvuhC999zIH8H8YhLmx5lE5awQny7ZzOrMsOtKsQD6ZbZA-cml7xkiEDRvOhQo5aMNYX-jsvaId5Qo60_2AjL4JonC0_o3IdjPI95_Bkt71zakhxwo9Z00NL_mdlfzmcUQVFVy-jwiJZc27WJb3QHriDMFe2vBcZaDRHjMF2czV2x_3PSQFIfmlKFnF1vo1o-NDxh8BIkYtj-gDsEXPq9Zj5Yl7HfvO9Wh07owt59EQ3-ewB_GPji_wHyzThvhIBVBebPk8OiM',
      partnerName: 'Sarah'
    };
  });

  // Settings drawer state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [tempProfileName, setTempProfileName] = useState(profile.name);
  const [tempPartnerName, setTempPartnerName] = useState(profile.partnerName);
  
  // Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('digital_sanctuary_artifacts', JSON.stringify(artifacts));
  }, [artifacts]);

  useEffect(() => {
    localStorage.setItem('digital_sanctuary_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('digital_sanctuary_profile', JSON.stringify(profile));
  }, [profile]);

  // Handle adding an artifact
  const handleSaveArtifact = (newArtifact: Artifact) => {
    setArtifacts(prev => [newArtifact, ...prev]);
    // Navigate to gallery to view it
    setTimeout(() => {
      setCurrentView('gallery');
    }, 800);
  };

  // View specific artifact
  const handleViewArtifact = (id: string) => {
    setSelectedArtifactId(id);
    setCurrentView('detail');
  };

  // Triggered when clicking "Remember Again" in detail screen
  const handleRememberAgain = () => {
    // Generate a subtle haptic style animation
    const audio = new Audio();
    audio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
    audio.play().catch(() => {});
    
    setToastMessage(language === 'en' 
      ? '✨ Close your eyes. Re-inhale the scent of that rain, the murmur of those streets. The Sanctuary has logged your remembrance.' 
      : '✨ Pejamkan mata Anda. Hirup kembali aroma hujan itu, desas-desus jalanan itu. Tempat Suci telah mencatat kenangan Anda.'
    );

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setToastMessage(prev => prev ? null : null);
    }, 5000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUserProfile({
      ...profile,
      name: tempProfileName.trim() || profile.name,
      partnerName: tempPartnerName.trim() || profile.partnerName,
    });
    setIsSettingsOpen(false);
  };

  // Active artifact details
  const activeArtifact = artifacts.find(a => a.id === selectedArtifactId) || artifacts[0];

  const t = DICTIONARY[language];

  // Helper to render the inner application body
  const renderAppContent = () => {
    switch (currentView) {
      case 'home':
        return (
          <HomeView
            language={language}
            artifacts={artifacts}
            userProfile={profile}
            partnerProgress={50}
            onViewArtifact={handleViewArtifact}
            onNavigate={setCurrentView}
          />
        );
      case 'gallery':
        return (
          <GalleryView
            language={language}
            artifacts={artifacts}
            onViewArtifact={handleViewArtifact}
          />
        );
      case 'add':
        return (
          <AddArtifactView
            language={language}
            userProfile={profile}
            onSave={handleSaveArtifact}
          />
        );
      case 'chronicles':
        return (
          <ChroniclesView
            language={language}
            artifacts={artifacts}
            onViewArtifact={handleViewArtifact}
          />
        );
      case 'detail':
        return (
          <DetailView
            language={language}
            artifact={activeArtifact}
            onBack={() => setCurrentView('gallery')}
            onRememberAgain={handleRememberAgain}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-warm-cream font-sans text-charcoal flex flex-col items-center justify-start overflow-x-hidden antialiased">
      
      {/* Top Navigation Shell */}
      <header className="bg-background/80 backdrop-blur-md w-full sticky top-0 z-40 border-b border-outline-variant/10">
        <div className="flex justify-between items-center px-6 py-4 max-w-[1200px] mx-auto">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                setTempProfileName(profile.name);
                setTempPartnerName(profile.partnerName);
                setIsSettingsOpen(true);
              }}
              className="hover:opacity-75 transition-opacity cursor-pointer"
            >
              <Menu className="w-5 h-5 text-charcoal" />
            </button>
            <span className="font-headline-md text-[18px] md:text-headline-md text-charcoal tracking-tight font-semibold">
              {language === 'en' ? 'Digital Sanctuary' : 'Museum Hidup'}
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <LanguageSelector currentLanguage={language} onLanguageChange={setLanguage} />
            
            {/* Curation Settings Button */}
            <button
              onClick={() => {
                setTempProfileName(profile.name);
                setTempPartnerName(profile.partnerName);
                setIsSettingsOpen(true);
              }}
              className="p-2 rounded-full hover:bg-surface-container/40 text-muted-taupe hover:text-charcoal transition-colors border border-outline-variant/20 cursor-pointer"
              title="Configure Curation Settings"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* User avatar */}
            <div 
              onClick={() => {
                setTempProfileName(profile.name);
                setTempPartnerName(profile.partnerName);
                setIsSettingsOpen(true);
              }}
              className="w-9 h-9 rounded-full overflow-hidden bg-surface-container border border-outline-variant/30 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-sm"
              title="Configure partners"
            >
              <img 
                className="w-full h-full object-cover" 
                src={profile.avatarUrl} 
                alt="Curator portrait" 
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main scrollable body panel */}
      <main className="flex-grow mx-auto w-full px-6 py-8 max-w-[1200px] pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView + (selectedArtifactId || '')}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {renderAppContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation Shell */}
      <nav className="w-full z-40 flex justify-around items-center px-4 py-3 bg-white/95 backdrop-blur-xl shadow-md rounded-t-2xl border-t border-outline-variant fixed bottom-0 left-0 right-0">
        
        {/* Home tab link */}
        <button
          onClick={() => {
            setSelectedArtifactId(null);
            setCurrentView('home');
          }}
          className={`flex flex-col items-center justify-center p-3 transition-all rounded-full cursor-pointer ${
            currentView === 'home'
              ? 'bg-secondary-container text-on-secondary-container scale-105 shadow-sm'
              : 'text-muted-taupe hover:text-charcoal'
          }`}
          title={t.home}
        >
          <Home className="w-5 h-5" />
        </button>

        {/* Gallery/Museum tab link */}
        <button
          onClick={() => {
            setSelectedArtifactId(null);
            setCurrentView('gallery');
          }}
          className={`flex flex-col items-center justify-center p-3 transition-all rounded-full cursor-pointer ${
            currentView === 'gallery' || currentView === 'detail'
              ? 'bg-secondary-container text-on-secondary-container scale-105 shadow-sm'
              : 'text-muted-taupe hover:text-charcoal'
          }`}
          title={t.gallery}
        >
          <Landmark className="w-5 h-5" />
        </button>

        {/* Add Artifact plus action link (Floating Action button styled) */}
        <button
          onClick={() => {
            setSelectedArtifactId(null);
            setCurrentView('add');
          }}
          className="flex items-center justify-center bg-charcoal text-warm-cream w-14 h-14 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all -translate-y-4 hover:bg-terracotta border border-outline-variant/10 cursor-pointer"
          title={t.preserveArtifact}
        >
          <Plus className="w-6 h-6 stroke-[3]" />
        </button>

        {/* Chronicles tab link */}
        <button
          onClick={() => {
            setSelectedArtifactId(null);
            setCurrentView('chronicles');
          }}
          className={`flex flex-col items-center justify-center p-3 transition-all rounded-full cursor-pointer ${
            currentView === 'chronicles'
              ? 'bg-secondary-container text-on-secondary-container scale-105 shadow-sm'
              : 'text-muted-taupe hover:text-charcoal'
          }`}
          title={t.chronicles}
        >
          <BookOpen className="w-5 h-5" />
        </button>

        {/* Profile/Partner Settings tab trigger */}
        <button
          onClick={() => {
            setTempProfileName(profile.name);
            setTempPartnerName(profile.partnerName);
            setIsSettingsOpen(true);
          }}
          className="flex flex-col items-center justify-center p-3 text-muted-taupe hover:text-charcoal transition-all cursor-pointer"
          title={t.profile}
        >
          <User className="w-5 h-5" />
        </button>

      </nav>

      {/* Settings Modal Drawer - Allows dynamic curator customization */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-charcoal/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white max-w-md w-full rounded-2xl p-6 shadow-xl border border-outline-variant relative"
          >
            <button
              onClick={() => setIsSettingsOpen(false)}
              className="absolute top-4 right-4 text-muted-taupe hover:text-charcoal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-terracotta fill-terracotta" />
              <h3 className="font-headline-md text-headline-md text-charcoal font-semibold">
                {language === 'en' ? 'Curation Settings' : 'Pengaturan Kurasi'}
              </h3>
            </div>

            <p className="text-xs text-muted-taupe mb-6 italic leading-relaxed">
              {language === 'en'
                ? 'Configure the curators names in this Digital Sanctuary to personalize headers and greetings.'
                : 'Konfigurasikan nama kurator di dalam Tempat Suci ini untuk mempersonalisasi sapaan.'}
            </p>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block font-label-caps text-[9px] text-muted-taupe uppercase tracking-widest font-bold mb-1.5">
                  {language === 'en' ? 'Your Name' : 'Nama Anda'}
                </label>
                <input
                  type="text"
                  value={tempProfileName}
                  onChange={e => setTempProfileName(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-2.5 text-sm outline-none text-charcoal focus:border-terracotta"
                  placeholder="Your Name"
                />
              </div>

              <div>
                <label className="block font-label-caps text-[9px] text-muted-taupe uppercase tracking-widest font-bold mb-1.5">
                  {language === 'en' ? 'Partner Name' : 'Nama Pasangan'}
                </label>
                <input
                  type="text"
                  value={tempPartnerName}
                  onChange={e => setTempPartnerName(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-2.5 text-sm outline-none text-charcoal focus:border-terracotta"
                  placeholder="Partner Name"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(false)}
                  className="w-1/2 border border-outline-variant/40 hover:bg-surface-container-low py-3 rounded-xl font-label-caps text-[10px] uppercase tracking-wider font-semibold"
                >
                  {language === 'en' ? 'Cancel' : 'Batal'}
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-charcoal text-warm-cream hover:bg-charcoal/90 py-3 rounded-xl font-label-caps text-[10px] uppercase tracking-wider font-semibold shadow-sm"
                >
                  {language === 'en' ? 'Save Changes' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
          >
            <div className="bg-charcoal text-warm-cream p-4 rounded-xl shadow-lg border border-terracotta/30 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-terracotta shrink-0 mt-0.5" />
              <div className="flex-grow">
                <p className="text-xs leading-relaxed font-body-md font-medium">
                  {toastMessage}
                </p>
              </div>
              <button 
                onClick={() => setToastMessage(null)}
                className="text-muted-taupe hover:text-warm-cream transition-colors p-0.5 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
