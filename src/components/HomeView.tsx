import React, { useState } from 'react';
import { Artifact, Language, UserProfile } from '../types';
import { DICTIONARY } from '../data/initialData';
import { Check, X, BookOpen, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface HomeViewProps {
  language: Language;
  artifacts: Artifact[];
  userProfile: UserProfile;
  partnerProgress: number;
  onViewArtifact: (id: string) => void;
  onNavigate: (view: any) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  language,
  artifacts,
  userProfile,
  partnerProgress,
  onViewArtifact,
  onNavigate,
}) => {
  const t = DICTIONARY[language];
  const [narrativeText, setNarrativeText] = useState('');
  const [narrativeSaved, setNarrativeSaved] = useState(false);
  const [localLogs, setLocalLogs] = useState<string[]>([]);

  // Find Uluwatu or today's banner item
  const bannerArtifact = artifacts.length > 0 ? (artifacts.find(a => a.id === '6') || artifacts[0]) : null;
  
  // Find "Mountain Road" (2 years ago today)
  const mountainRoadArtifact = artifacts.length > 0 ? (artifacts.find(a => a.id === '2') || artifacts[3]) : null;

  // Get a random artifact quote
  const randomArtifact = artifacts.length > 0 ? (artifacts.find(a => a.id === '1') || artifacts[1]) : null;

  const handleAddNarrative = (e: React.FormEvent) => {
    e.preventDefault();
    if (narrativeText.trim()) {
      setLocalLogs(prev => [narrativeText, ...prev]);
      setNarrativeText('');
      setNarrativeSaved(true);
      setTimeout(() => setNarrativeSaved(false), 3000);
    }
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Greeting Section with Slide Animation */}
      <motion.section 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="paper-slide"
      >
        <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-charcoal mb-2">
          {t.greeting}, {userProfile.name} <span className="text-danger-rose">❤️</span>
        </h1>
        <p className="font-body-lg text-body-lg text-muted-taupe italic">
          {t.storyQuote}
        </p>
      </motion.section>

      {/* Status & Progress Grid */}
      <motion.section 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-gutter"
      >
        {/* Status Indicators */}
        <div className="bg-surface-container-low rounded-xl p-6 flex items-center justify-between border border-outline-variant">
          <div className="flex flex-col gap-4">
            {/* You status */}
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12 rounded-full border-2 border-sage-green flex items-center justify-center bg-sage-green/5">
                <Check className="w-5 h-5 text-sage-green stroke-[3]" />
              </div>
              <div>
                <p className="font-label-caps text-[10px] uppercase tracking-widest text-muted-taupe">
                  {t.youLabel}
                </p>
                <p className="font-body-md text-charcoal font-medium">
                  {t.artifactAdded}
                </p>
              </div>
            </div>

            {/* Partner status */}
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12 rounded-full border-2 border-outline-variant flex items-center justify-center bg-surface-variant/20">
                <X className="w-5 h-5 text-muted-taupe stroke-[2.5]" />
              </div>
              <div>
                <p className="font-label-caps text-[10px] uppercase tracking-widest text-muted-taupe">
                  {t.partnerLabel}
                </p>
                <p className="font-body-md text-charcoal font-medium">
                  {t.waiting}
                </p>
              </div>
            </div>
          </div>

          {/* Progress Ring */}
          <div className="relative flex flex-col items-center justify-center mr-2">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle
                className="text-outline-variant/20"
                cx="48"
                cy="48"
                fill="transparent"
                r="38"
                stroke="currentColor"
                strokeWidth="5"
              ></circle>
              <circle
                className="text-charcoal transition-all duration-1000"
                cx="48"
                cy="48"
                fill="transparent"
                r="38"
                stroke="currentColor"
                strokeDasharray="238.76"
                strokeDashoffset={238.76 - (238.76 * partnerProgress) / 100}
                strokeWidth="5"
                strokeLinecap="round"
              ></circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-headline-md text-headline-md leading-none">
                {partnerProgress}%
              </span>
              <span className="text-[9px] uppercase tracking-[0.2em] font-semibold text-muted-taupe mt-1">
                {language === 'en' ? 'FULL' : 'PENUH'}
              </span>
            </div>
          </div>
        </div>

        {/* Bento Mini Card - Random Artifact */}
        <div
          onClick={() => randomArtifact ? onViewArtifact(randomArtifact.id) : onNavigate('add')}
          className="bg-white rounded-xl p-6 border border-outline-variant flex flex-col justify-between group cursor-pointer hover:bg-gallery-beige/50 transition-all duration-300 shadow-[0_2px_12px_rgba(15,23,42,0.03)] hover:shadow-md"
        >
          <div className="flex justify-between items-start mb-4">
            <span className="font-label-caps text-[10px] uppercase tracking-wider text-terracotta bg-terracotta/10 px-3 py-1 rounded-full font-semibold">
              {t.randomArtifact}
            </span>
            <Sparkles className="w-4 h-4 text-muted-taupe group-hover:text-charcoal transition-colors group-hover:rotate-12 duration-300" />
          </div>

          <div className="flex gap-4 items-center">
            {randomArtifact && (
              <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 grayscale group-hover:grayscale-0 transition-all duration-500 shadow-sm border border-outline-variant/20">
                <img
                  className="w-full h-full object-cover"
                  src={randomArtifact.imageUrl}
                  alt={randomArtifact.title}
                  referrerPolicy="no-referrer"
                />
              </div>
            )}
            <p className="font-quote-italic text-[15px] leading-snug italic text-charcoal pr-2">
              "{randomArtifact ? (() => {
                const desc = language === 'en' ? randomArtifact.description : randomArtifact.descriptionId;
                const sentences = desc.split(/[.!?]+/);
                const firstSentence = sentences[0] ? sentences[0].trim() : '';
                return firstSentence.length > 70 ? firstSentence.substring(0, 70) + '...' : firstSentence + '...';
              })() : (
                language === 'en' 
                  ? 'Every great story starts with a single moment.' 
                  : 'Setiap cerita indah dimulai dari satu momen sederhana.'
              )}"
            </p>
          </div>
        </div>
      </motion.section>

      {/* Main Content Canvas (Grid layout matches pictures) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Today's Memory (Large banner card - 8 columns wide) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="lg:col-span-8 paper-slide"
        >
          <div className="relative aspect-[4/5] md:aspect-[16/10] rounded-2xl overflow-hidden group border border-outline-variant shadow-[0_4px_24px_rgba(15,23,42,0.04)]">
            <img
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              src={bannerArtifact ? bannerArtifact.imageUrl : 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=1200'}
              alt={bannerArtifact ? (language === 'en' ? bannerArtifact.title : bannerArtifact.titleId) : 'Empty Sanctuary'}
              referrerPolicy="no-referrer"
            />
            {/* Elegant overlay gradient matching screenshot */}
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent"></div>
            
            <div className="absolute bottom-0 left-0 p-8 w-full z-10">
              <p className="font-label-caps text-[10px] uppercase tracking-[0.2em] text-warm-cream/80 mb-2 font-semibold">
                {t.todaysMemory}
              </p>
              <h2 className="font-headline-lg text-headline-lg text-warm-cream mb-4 font-bold tracking-tight">
                {bannerArtifact 
                  ? (language === 'en' ? bannerArtifact.title : bannerArtifact.titleId)
                  : (language === 'en' ? 'Your Living Museum' : 'Museum Hidup Anda')}
              </h2>
              <button
                onClick={() => bannerArtifact ? onViewArtifact(bannerArtifact.id) : onNavigate('add')}
                className="bg-warm-cream hover:bg-white text-charcoal hover:scale-105 transition-all duration-300 px-6 py-2 rounded-full font-label-caps text-[10px] font-semibold tracking-widest shadow-sm active:scale-95 cursor-pointer"
              >
                {bannerArtifact ? t.exhibitDetails : (language === 'en' ? 'PRESERVE FIRST MEMORY' : 'ABADIKAN MEMORI PERTAMA')}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Side Cards (4 columns wide) */}
        <div className="lg:col-span-4 flex flex-col gap-gutter">
          {/* Memory of the Day (Mountain Road) */}
          {mountainRoadArtifact ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              onClick={() => onViewArtifact(mountainRoadArtifact.id)}
              className="bg-white rounded-2xl overflow-hidden flex-1 border border-outline-variant flex flex-col justify-between group cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="h-40 relative overflow-hidden">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  src={mountainRoadArtifact.imageUrl}
                  alt={mountainRoadArtifact.title}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-charcoal/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                  <span className="font-label-caps text-[9px] uppercase tracking-wider text-white font-medium">
                    2 {t.yearsAgoToday}
                  </span>
                </div>
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="font-headline-md text-headline-md text-charcoal mb-2 font-semibold">
                    {language === 'en' ? mountainRoadArtifact.title : mountainRoadArtifact.titleId}
                  </h3>
                  <p className="text-muted-taupe font-body-md line-clamp-3 text-sm leading-relaxed">
                    {language === 'en' ? mountainRoadArtifact.description : mountainRoadArtifact.descriptionId}
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              onClick={() => onNavigate('add')}
              className="bg-white rounded-2xl p-6 border border-outline-variant flex-1 flex flex-col justify-center items-center text-center group cursor-pointer hover:bg-gallery-beige/30 transition-all"
            >
              <Sparkles className="w-8 h-8 text-terracotta mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-headline-md text-[16px] text-charcoal mb-1.5 font-semibold">
                {language === 'en' ? 'Awaiting Your History' : 'Menanti Sejarah Anda'}
              </h3>
              <p className="text-muted-taupe text-xs leading-relaxed max-w-[200px]">
                {language === 'en' 
                  ? 'Your shared timeline is currently empty. Add a moment to begin.' 
                  : 'Garis waktu bersama Anda masih kosong. Tambahkan momen untuk memulai.'}
              </p>
            </motion.div>
          )}

          {/* Collaborative Note / Prompt with real Interactive States */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="bg-tertiary-container text-on-tertiary-container rounded-2xl p-6 flex flex-col justify-between border border-outline-variant shadow-sm"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <BookOpen className="w-8 h-8 text-on-tertiary-container/50" />
              <p className="font-body-lg text-body-lg italic opacity-95 text-warm-cream max-w-xs text-sm">
                {t.highlightPrompt}
              </p>
            </div>

            <form onSubmit={handleAddNarrative} className="mt-4 space-y-3">
              <textarea
                value={narrativeText}
                onChange={e => setNarrativeText(e.target.value)}
                placeholder={t.narrativePlaceholder}
                className="w-full bg-charcoal/40 text-warm-cream border border-outline-variant/20 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-warm-cream/50 focus:border-transparent placeholder:text-muted-taupe outline-none resize-none"
                rows={2}
                maxLength={180}
              />
              
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  disabled={!narrativeText.trim()}
                  className="w-full bg-warm-cream hover:bg-white text-charcoal disabled:opacity-40 font-label-caps text-[9px] py-2 rounded-full uppercase tracking-wider font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all disabled:pointer-events-none"
                >
                  {t.addNarrative}
                </button>
              </div>
            </form>

            {narrativeSaved && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2 text-center text-[10px] text-sage-green font-semibold"
              >
                ✓ {t.addNarrativeSuccess}
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Narrative Logs Display (Shows dynamic entries from prompt above) */}
      {localLogs.length > 0 && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/20"
        >
          <h4 className="font-label-caps text-[10px] text-muted-taupe tracking-widest mb-3 uppercase">
            {language === 'en' ? 'SHARED REFLECTIONS' : 'REFLEKSI BERSAMA'}
          </h4>
          <div className="space-y-3 divide-y divide-outline-variant/10">
            {localLogs.map((log, index) => (
              <div key={index} className="pt-3 first:pt-0">
                <p className="text-sm font-quote-italic italic text-charcoal">
                  "{log}"
                </p>
                <p className="text-[9px] text-muted-taupe font-mono mt-1">
                  {language === 'en' ? 'Just now • Added by You' : 'Baru saja • Ditambahkan oleh Anda'}
                </p>
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Poetic Footer */}
      <footer className="py-12 border-t border-outline-variant/10 text-center">
        <p className="font-quote-italic text-quote-italic text-charcoal/60 mb-2 italic">
          {t.poeticQuote}
        </p>
        <p className="font-label-caps text-[9px] text-muted-taupe tracking-[0.25em] uppercase font-bold">
          {t.curatorAlmanac}
        </p>
      </footer>
    </div>
  );
};
