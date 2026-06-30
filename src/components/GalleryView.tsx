import React, { useState, useMemo } from 'react';
import { Artifact, Language } from '../types';
import { DICTIONARY } from '../data/initialData';
import { Search, Eye, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GalleryViewProps {
  language: Language;
  artifacts: Artifact[];
  onViewArtifact: (id: string) => void;
}

type CategoryFilter = 'All' | 'Photo' | 'Video' | 'Voice' | 'Music' | 'Screen' | 'Map' | 'Other';

export const GalleryView: React.FC<GalleryViewProps> = ({
  language,
  artifacts,
  onViewArtifact,
}) => {
  const t = DICTIONARY[language];
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All');

  const categories: { label: string; value: CategoryFilter }[] = [
    { label: language === 'en' ? 'All' : 'Semua', value: 'All' },
    { label: language === 'en' ? 'Photo' : 'Foto', value: 'Photo' },
    { label: language === 'en' ? 'Video' : 'Video', value: 'Video' },
    { label: language === 'en' ? 'Voice' : 'Suara', value: 'Voice' },
    { label: language === 'en' ? 'Music' : 'Musik', value: 'Music' },
    { label: language === 'en' ? 'Screen' : 'Layar', value: 'Screen' },
    { label: language === 'en' ? 'Map' : 'Peta', value: 'Map' },
    { label: language === 'en' ? 'Other' : 'Lainnya', value: 'Other' },
  ];

  const filteredArtifacts = useMemo(() => {
    return artifacts.filter(item => {
      const matchSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.titleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.descriptionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.locationId.toLowerCase().includes(searchTerm.toLowerCase());

      const matchCategory = selectedCategory === 'All' || item.category === selectedCategory;

      return matchSearch && matchCategory;
    });
  }, [artifacts, searchTerm, selectedCategory]);

  return (
    <div className="space-y-10 pb-16">
      {/* Editorial Header Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="space-y-4"
      >
        <h2 className="font-display-lg text-display-lg text-charcoal tracking-tight font-semibold">
          {language === 'en' ? 'Museum Hidup' : 'Museum Hidup'}
        </h2>
        <p className="font-body-lg text-body-lg text-muted-taupe max-w-xl italic leading-relaxed">
          {language === 'en'
            ? 'A quiet archive of the ephemeral. Here, we preserve the textures of daily life—the coffee stains, the train tickets, the fragments of rain.'
            : 'Arsip tenang dari hal-hal yang fana. Di sini, kita menjaga tekstur kehidupan sehari-hari—bekas noda kopi, tiket kereta api, kepingan hujan.'}
        </p>
      </motion.section>

      {/* Filter and Search Section */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-taupe" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl pl-11 pr-4 py-3 text-sm focus:ring-1 focus:ring-charcoal outline-none transition-all placeholder:text-muted-taupe/60 text-charcoal"
          />
        </div>

        {/* Category Pill Buttons */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none mask-image-horizontal">
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 rounded-full text-xs font-label-caps tracking-wider transition-all duration-300 shrink-0 border ${
                selectedCategory === cat.value
                  ? 'bg-charcoal text-warm-cream border-charcoal font-medium shadow-sm'
                  : 'bg-gallery-beige/30 text-muted-taupe hover:text-charcoal border-outline-variant/10 hover:bg-gallery-beige/70'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Masonry-like Grid Display */}
      {filteredArtifacts.length > 0 ? (
        <motion.div 
          layout
          className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredArtifacts.map((artifact, index) => (
              <motion.article
                key={artifact.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.3) }}
                onClick={() => onViewArtifact(artifact.id)}
                className="break-inside-avoid w-full group cursor-pointer"
              >
                <div className="bg-white rounded-2xl overflow-hidden border border-outline-variant hover:border-muted-taupe/40 shadow-[0_2px_12px_rgba(15,23,42,0.02)] hover:shadow-md transition-all duration-300 flex flex-col">
                  {/* Image container */}
                  <div className="relative overflow-hidden aspect-[4/5] md:aspect-auto">
                    <img
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      src={artifact.imageUrl}
                      alt={artifact.title}
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Private status indicator */}
                    {artifact.isPrivate && (
                      <div className="absolute top-4 right-4 bg-charcoal/70 backdrop-blur-md text-warm-cream text-[9px] font-label-caps uppercase px-2.5 py-1 rounded-full tracking-wider font-semibold">
                        🔒 {t.privateBadge}
                      </div>
                    )}
                    
                    {/* Hover state overlay */}
                    <div className="absolute inset-0 bg-charcoal/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="bg-warm-cream/90 text-charcoal px-4 py-2 rounded-full font-label-caps text-[9px] tracking-widest font-semibold flex items-center gap-1.5 shadow-sm">
                        <Eye className="w-3 h-3" />
                        {language === 'en' ? 'VIEW ARTIFACT' : 'LIHAT ARTEFAK'}
                      </div>
                    </div>
                  </div>

                  {/* Content details */}
                  <div className="p-6">
                    <span className="font-label-caps text-[10px] text-muted-taupe tracking-widest font-bold">
                      {artifact.year}
                    </span>
                    <h3 className="font-headline-md text-[18px] md:text-headline-md text-charcoal mt-1 font-semibold group-hover:text-terracotta transition-colors">
                      {language === 'en' ? artifact.title : artifact.titleId}
                    </h3>
                    
                    {/* Tag bubbles */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {(language === 'en' ? artifact.tags : artifact.tagsId).slice(0, 2).map((tag, i) => (
                        <span key={i} className="text-[9px] font-mono bg-charcoal/5 px-2 py-0.5 rounded text-muted-taupe">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="text-center py-20 bg-surface-container-low rounded-2xl border border-dashed border-outline-variant/30">
          <p className="text-muted-taupe font-quote-italic italic text-sm">
            {language === 'en' ? 'No artifacts found in this sanctuary.' : 'Tidak ada artefak ditemukan di dalam suaka ini.'}
          </p>
        </div>
      )}
    </div>
  );
};
