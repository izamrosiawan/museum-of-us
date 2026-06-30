import React, { useMemo } from 'react';
import { Artifact, Language } from '../types';
import { DICTIONARY } from '../data/initialData';
import { Calendar, Tag, MapPin, Eye } from 'lucide-react';
import { motion } from 'motion/react';

interface ChroniclesViewProps {
  language: Language;
  artifacts: Artifact[];
  onViewArtifact: (id: string) => void;
}

export const ChroniclesView: React.FC<ChroniclesViewProps> = ({
  language,
  artifacts,
  onViewArtifact,
}) => {
  const t = DICTIONARY[language];

  // Group artifacts by year, then by month
  const groupedChronicles = useMemo(() => {
    // Sort artifacts chronologically descending
    const sorted = [...artifacts].sort((a, b) => b.year - a.year || b.id.localeCompare(a.id));
    
    const years: { [key: number]: { [month: string]: Artifact[] } } = {};
    
    sorted.forEach(item => {
      if (!years[item.year]) {
        years[item.year] = {};
      }
      
      // Extract month name
      // e.g. "14 Oct 1992" -> "October" (English) or "Oktober" (Indonesian)
      const monthPart = item.date.split(' ')[1] || 'Jan';
      let monthName = 'January';
      
      if (monthPart.toLowerCase().includes('jan')) monthName = language === 'en' ? 'January' : 'Januari';
      else if (monthPart.toLowerCase().includes('feb')) monthName = language === 'en' ? 'February' : 'Februari';
      else if (monthPart.toLowerCase().includes('mar')) monthName = language === 'en' ? 'March' : 'Maret';
      else if (monthPart.toLowerCase().includes('apr')) monthName = language === 'en' ? 'April' : 'April';
      else if (monthPart.toLowerCase().includes('may')) monthName = language === 'en' ? 'May' : 'Mei';
      else if (monthPart.toLowerCase().includes('jun')) monthName = language === 'en' ? 'June' : 'Juni';
      else if (monthPart.toLowerCase().includes('jul')) monthName = language === 'en' ? 'July' : 'Juli';
      else if (monthPart.toLowerCase().includes('aug')) monthName = language === 'en' ? 'August' : 'Agustus';
      else if (monthPart.toLowerCase().includes('sep')) monthName = language === 'en' ? 'September' : 'September';
      else if (monthPart.toLowerCase().includes('oct')) monthName = language === 'en' ? 'October' : 'Oktober';
      else if (monthPart.toLowerCase().includes('nov')) monthName = language === 'en' ? 'November' : 'November';
      else if (monthPart.toLowerCase().includes('dec')) monthName = language === 'en' ? 'December' : 'Desember';
      
      if (!years[item.year][monthName]) {
        years[item.year][monthName] = [];
      }
      years[item.year][monthName].push(item);
    });
    
    return years;
  }, [artifacts, language]);

  // Sorted list of years descending
  const sortedYears = useMemo(() => {
    return Object.keys(groupedChronicles)
      .map(Number)
      .sort((a, b) => b - a);
  }, [groupedChronicles]);

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="space-y-3"
      >
        <h2 className="font-display-lg text-display-lg text-charcoal tracking-tight font-semibold">
          {language === 'en' ? 'Chronicles' : 'Kronik'}
        </h2>
        <p className="text-muted-taupe font-body-md max-w-xl italic leading-relaxed text-sm">
          {t.chroniclesDesc}
        </p>
      </motion.section>

      {/* Staggered Vertical Timeline */}
      <div className="relative pl-6 md:pl-0">
        
        {/* Central Vertical Line (matches screenshots) */}
        <div className="absolute left-[24px] md:left-1/2 top-0 bottom-0 w-[1px] bg-muted-taupe/20 -translate-x-1/2" />

        <div className="space-y-16">
          {sortedYears.map((year, yearIndex) => (
            <div key={year} className="space-y-12 relative">
              
              {/* Year Capsule */}
              <div className="flex items-center justify-center relative z-10">
                <motion.div
                  initial={{ scale: 0.9 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  className="bg-charcoal text-warm-cream px-8 py-2 rounded-full font-headline-md text-[18px] md:text-headline-md shadow-md border border-outline-variant/10"
                >
                  {year}
                </motion.div>
              </div>

              {/* Months inside this Year */}
              {Object.keys(groupedChronicles[year]).map((month) => (
                <div key={month} className="space-y-10 relative">
                  
                  {/* Month italic section */}
                  <div className="md:text-center pl-[52px] md:pl-0 relative z-10">
                    <h3 className="font-quote-italic text-quote-italic italic text-muted-taupe text-lg">
                      {month}
                    </h3>
                  </div>

                  {/* Staggered entries */}
                  <div className="space-y-10">
                    {groupedChronicles[year][month].map((artifact, index) => {
                      // Determine alignment (left vs right) on desktop
                      const isLeft = index % 2 === 0;

                      return (
                        <div
                          key={artifact.id}
                          className="flex flex-col md:flex-row md:items-center w-full relative"
                        >
                          {/* Indicator Dot on Timeline */}
                          <div className="absolute left-6 md:left-1/2 w-3.5 h-3.5 bg-charcoal rounded-full -translate-x-1/2 z-20 border-4 border-warm-cream shadow-sm" />

                          {/* Left Column (Metadata on left, empty on right, reversed) */}
                          <div className={`w-full md:w-1/2 order-2 md:order-1 pl-[52px] md:pl-0 flex flex-col ${
                            isLeft 
                              ? 'md:pr-12 md:items-end md:text-right' 
                              : 'md:pl-12 md:items-start md:text-left md:order-2'
                          }`}>
                            <span className="font-label-caps text-[9px] uppercase tracking-[0.2em] text-terracotta mb-1.5 font-bold">
                              {language === 'en' ? artifact.date : artifact.dateId}
                            </span>
                            <h4 
                              onClick={() => onViewArtifact(artifact.id)}
                              className="font-headline-md text-[18px] md:text-headline-md text-charcoal hover:text-terracotta cursor-pointer transition-colors font-semibold leading-tight mb-1"
                            >
                              {language === 'en' ? artifact.title : artifact.titleId}
                            </h4>
                            <p className="text-[10px] font-caption text-muted-taupe italic">
                              {language === 'en' ? 'Preserved by' : 'Diabadikan oleh'} {artifact.addedBy}
                            </p>

                            {/* Tags list */}
                            <div className={`flex flex-wrap gap-1 mt-2.5 ${isLeft ? 'md:justify-end' : 'md:justify-start'}`}>
                              {(language === 'en' ? artifact.tags : artifact.tagsId).map((tag, tIndex) => (
                                <span key={tIndex} className="text-[8px] bg-charcoal/5 text-muted-taupe px-1.5 py-0.5 rounded font-mono">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Right Column (Image Preview) */}
                          <div className={`w-full md:w-1/2 order-3 pl-[52px] md:pl-12 mt-4 md:mt-0 ${
                            isLeft 
                              ? 'md:pl-12' 
                              : 'md:pr-12 md:flex md:justify-end md:order-1 md:pl-0'
                          }`}>
                            <div 
                              onClick={() => onViewArtifact(artifact.id)}
                              className="w-full max-w-xs group cursor-pointer overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-outline-variant relative"
                            >
                              <div className="aspect-[4/3] w-full overflow-hidden">
                                <img
                                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                                  src={artifact.imageUrl}
                                  alt={artifact.title}
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                              <div className="absolute inset-0 bg-charcoal/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <span className="bg-warm-cream/90 text-charcoal px-3 py-1.5 rounded-full font-label-caps text-[8px] tracking-widest font-semibold flex items-center gap-1 shadow-sm">
                                  <Eye className="w-2.5 h-2.5" />
                                  {language === 'en' ? 'OPEN STORY' : 'BUKA CERITA'}
                                </span>
                              </div>
                            </div>
                          </div>

                        </div>
                      );
                    })}
                  </div>

                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Loading / Infinite Scroll Feel Footer block (Matches layout exactly) */}
        <div className="flex justify-center pt-16">
          <div className="flex items-center gap-3 text-muted-taupe animate-pulse">
            <span className="w-1.5 h-1.5 bg-muted-taupe rounded-full"></span>
            <span className="w-1.5 h-1.5 bg-muted-taupe rounded-full"></span>
            <span className="w-1.5 h-1.5 bg-muted-taupe rounded-full"></span>
            <span className="font-label-caps text-[9px] uppercase tracking-widest ml-1 font-bold">
              {t.archivingMoreMoments}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
