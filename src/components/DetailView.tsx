import React from 'react';
import { Artifact, Language } from '../types';
import { DICTIONARY } from '../data/initialData';
import { ArrowLeft, MapPin, Cloudy, Sparkles, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';

interface DetailViewProps {
  language: Language;
  artifact: Artifact;
  onBack: () => void;
  onRememberAgain: () => void;
  onSavePerspective: (artifactId: string, text: string) => void;
}

export const DetailView: React.FC<DetailViewProps> = ({
  language,
  artifact,
  onBack,
  onRememberAgain,
  onSavePerspective,
}) => {
  const t = DICTIONARY[language];
  const [isEditingPerspective, setIsEditingPerspective] = React.useState(false);
  const [perspectiveText, setPerspectiveText] = React.useState(
    (language === 'en' ? artifact.partnerPerspective : artifact.partnerPerspectiveId) || ''
  );

  React.useEffect(() => {
    setPerspectiveText((language === 'en' ? artifact.partnerPerspective : artifact.partnerPerspectiveId) || '');
  }, [artifact, language]);

  // Map categories to appropriate symbols or colors
  const getMoodColorClass = (moodStr: string) => {
    if (moodStr.toLowerCase().includes('solitude') || moodStr.toLowerCase().includes('nostalgia')) return 'bg-sage-green';
    if (moodStr.toLowerCase().includes('focus') || moodStr.toLowerCase().includes('zen')) return 'bg-dusty-blue';
    if (moodStr.toLowerCase().includes('security') || moodStr.toLowerCase().includes('warm')) return 'bg-terracotta';
    return 'bg-heritage-gold';
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Top Header Row with Arrow back */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-between items-center"
      >
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-primary hover:opacity-75 transition-opacity py-2 group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-primary group-hover:-translate-x-0.5 transition-transform stroke-[2]" />
          <span className="font-label-caps text-[9px] uppercase tracking-widest text-charcoal font-bold">
            {t.backToGallery}
          </span>
        </button>
      </motion.div>

      {/* Hero Large Aspect Image Section */}
      <motion.section 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        className="relative overflow-hidden rounded-2xl aspect-[4/5] md:aspect-[16/9] bg-white border border-outline-variant group shadow-sm"
      >
        <img
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.02]"
          src={artifact.imageUrl}
          alt={artifact.title}
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/20 to-transparent pointer-events-none" />
      </motion.section>

      {/* Memoir Code / Title Header section */}
      <motion.section 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-2 border-b border-outline-variant/10 pb-6"
      >
        <p className="font-label-caps text-[9px] text-muted-taupe tracking-[0.25em] uppercase font-bold">
          {language === 'en' ? 'Memoir No.' : 'Memoar No.'} {artifact.id.charCodeAt(0) ? artifact.id.charCodeAt(0) * 5 + 400 : 427}
        </p>
        <h2 className="font-display-lg text-headline-lg-mobile md:text-display-lg text-charcoal leading-tight font-bold tracking-tight">
          {language === 'en' ? artifact.title : artifact.titleId}
        </h2>
        
        <div className="flex items-center gap-4 pt-2">
          <span className="font-headline-md text-headline-md italic text-heritage-gold font-semibold">
            {language === 'en' ? artifact.date : artifact.dateId}
          </span>
          <div className="h-[1px] w-12 bg-outline-variant/40" />
          <p className="font-body-md text-body-md text-secondary italic text-sm">
            {language === 'en' ? `Added by ${artifact.addedBy}` : `Ditambahkan oleh ${artifact.addedBy}`}
          </p>
        </div>
      </motion.section>

      {/* Double Column Story & Partner Perspective Layout */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-12">
        {/* Left column: My Story with premium serif italic fonts (matches picture) */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="font-label-caps text-[10px] text-charcoal tracking-widest uppercase font-bold border-b border-surface-container-highest pb-2 w-fit">
            {language === 'en' ? 'The Story' : 'Cerita'}
          </h3>
          <div className="story-text text-[20px] md:text-[23px] leading-relaxed text-charcoal font-medium space-y-6 pt-2 select-text selection:bg-gallery-beige">
            {/* Split paragraphs gracefully */}
            {(language === 'en' ? artifact.description : artifact.descriptionId)
              .split('\n\n')
              .map((para, pIdx) => (
                <p key={pIdx}>{para}</p>
              ))}
          </div>
        </div>

        {/* Right column: Partner Perspective Card */}
        <div className="lg:col-span-5 flex flex-col justify-start">
          <div className="p-8 md:p-10 bg-white rounded-2xl border border-outline-variant relative overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
            {/* Subtle aesthetic radial background */}
            <div
              className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle, #2B2B2B 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }}
            />
            
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-label-caps text-[10px] text-muted-taupe tracking-widest uppercase font-bold">
                  {language === 'en' ? 'Partner Perspective' : 'Perspektif Pasangan'}
                </h3>
                <button
                  onClick={() => setIsEditingPerspective(!isEditingPerspective)}
                  className="text-[10px] text-terracotta hover:underline font-bold font-label-caps uppercase cursor-pointer"
                >
                  {isEditingPerspective 
                    ? (language === 'en' ? 'Cancel' : 'Batal') 
                    : (language === 'en' ? 'Edit' : 'Ubah')}
                </button>
              </div>
              
              <div className="w-12 h-[1px] bg-terracotta/40" />
              
              {isEditingPerspective ? (
                <div className="space-y-3">
                  <textarea
                    value={perspectiveText}
                    onChange={e => setPerspectiveText(e.target.value)}
                    placeholder={language === 'en' ? 'Add your perspective...' : 'Tambahkan perspektif Anda...'}
                    className="w-full bg-gallery-beige/30 border border-outline-variant/20 rounded-xl p-3 text-xs outline-none text-charcoal focus:border-terracotta transition-colors resize-none"
                    rows={4}
                  />
                  <button
                    onClick={() => {
                      onSavePerspective(artifact.id, perspectiveText);
                      setIsEditingPerspective(false);
                    }}
                    className="bg-charcoal text-warm-cream text-[9px] font-label-caps uppercase px-4 py-2 rounded-lg font-bold tracking-wider cursor-pointer hover:bg-charcoal/90 transition-colors"
                  >
                    {language === 'en' ? 'Save' : 'Simpan'}
                  </button>
                </div>
              ) : (
                <p className="font-body-lg text-body-lg text-secondary italic leading-relaxed text-charcoal">
                  "{language === 'en' 
                    ? (artifact.partnerPerspective || 'No comments from your partner yet.')
                    : (artifact.partnerPerspectiveId || 'Belum ada komentar dari pasanganmu.')}"
                </p>
              )}
              
              <div className="flex items-center gap-2 pt-2">
                <span className="w-2 h-2 rounded-full bg-sage-green"></span>
                <span className="text-[10px] font-mono text-muted-taupe">
                  {language === 'en' ? 'Connected Sync' : 'Sinkron Terhubung'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metadata tags (Mood, Location, Weather) */}
      <section className="pt-10 border-t border-outline-variant/15">
        <div className="flex flex-wrap gap-y-8 gap-x-16">
          {/* Mood indicator */}
          <div className="space-y-2">
            <p className="font-label-caps text-[10px] text-muted-taupe tracking-widest uppercase font-bold">
              {t.moodLabel}
            </p>
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${getMoodColorClass(artifact.mood)}`} />
              <p className="font-body-md text-sm text-charcoal font-medium">
                {language === 'en' ? artifact.mood : artifact.moodId}
              </p>
            </div>
          </div>

          {/* Location field */}
          <div className="space-y-2">
            <p className="font-label-caps text-[10px] text-muted-taupe tracking-widest uppercase font-bold">
              {t.locationLabel}
            </p>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-charcoal" />
              <p className="font-body-md text-sm text-charcoal font-medium">
                {language === 'en' ? artifact.location : artifact.locationId}
              </p>
            </div>
          </div>

          {/* Weather field */}
          <div className="space-y-2">
            <p className="font-label-caps text-[10px] text-muted-taupe tracking-widest uppercase font-bold">
              {t.weatherLabel}
            </p>
            <div className="flex items-center gap-2">
              <Cloudy className="w-4 h-4 text-charcoal" />
              <p className="font-body-md text-sm text-charcoal font-medium">
                {language === 'en' ? artifact.weather : artifact.weatherId}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Action Area: Beautiful Remember Again CTA */}
      <section className="mt-24 flex flex-col items-center justify-center text-center">
        <div className="w-[1px] h-16 bg-gradient-to-b from-outline-variant/30 to-transparent mb-8" />
        
        <button
          onClick={onRememberAgain}
          className="group relative px-10 py-4 overflow-hidden rounded-full border border-muted-taupe/30 hover:border-charcoal transition-all duration-500 hover:scale-105 active:scale-95"
        >
          <span className="relative z-10 font-label-caps text-[10px] text-charcoal tracking-widest uppercase group-hover:text-warm-cream transition-colors duration-500 font-bold">
            {t.rememberAgain}
          </span>
          <div className="absolute inset-0 bg-charcoal translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
        </button>
        
        <p className="mt-6 font-caption text-xs text-muted-taupe italic">
          {t.digitalArchiveNote}
        </p>
      </section>
    </div>
  );
};
