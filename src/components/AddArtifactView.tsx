import React, { useState, useRef } from 'react';
import { Artifact, Language, UserProfile } from '../types';
import { DICTIONARY } from '../data/initialData';
import { Image as ImageIcon, Video, Mic, Music, Monitor, MapPin, MoreHorizontal, Plus, Lock, Check } from 'lucide-react';
import { motion } from 'motion/react';

interface AddArtifactViewProps {
  language: Language;
  userProfile: UserProfile;
  onSave: (artifact: Artifact) => void;
}

// 6 beautiful pre-sourced high-resolution placeholders for easy preset usage
const IMAGE_PRESETS = [
  { name: 'Rain Window', url: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&q=80&w=600' },
  { name: 'Cafe Coffee', url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=600' },
  { name: 'Forest Path', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=600' },
  { name: 'Ocean Wave', url: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&q=80&w=600' },
  { name: 'Sunset Sun', url: 'https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?auto=format&fit=crop&q=80&w=600' },
  { name: 'Vintage Key', url: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&q=80&w=600' },
];

export const AddArtifactView: React.FC<AddArtifactViewProps> = ({
  language,
  userProfile,
  onSave,
}) => {
  const t = DICTIONARY[language];
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Artifact['category']>('Photo');
  const [imageUrl, setImageUrl] = useState(IMAGE_PRESETS[0].url);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [showPresetSelector, setShowPresetSelector] = useState(false);
  const [selectedResonance, setSelectedResonance] = useState('❤️');
  const [tags, setTags] = useState<string[]>(['Travel', 'Rain']);
  const [newTagText, setNewTagText] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);
  const [includeLocation, setIncludeLocation] = useState(false);
  const [customLocation, setCustomLocation] = useState('');
  const [customWeather, setCustomWeather] = useState('');
  const [customMood, setCustomMood] = useState('');
  const [isPrivate, setIsPrivate] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  const moodEmojis = ['😊', '🥹', '❤️', '😆', '😌', '😭'];

  // Handle local image file load
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImageUrl(reader.result);
          setCustomImageUrl('');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Quick select pre-sourced preset
  const selectPreset = (url: string) => {
    setImageUrl(url);
    setCustomImageUrl('');
    setShowPresetSelector(false);
  };

  // Add tag
  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTagText.trim() && !tags.includes(newTagText.trim())) {
      setTags([...tags, newTagText.trim()]);
      setNewTagText('');
      setShowTagInput(false);
    }
  };

  // Remove tag
  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  // Submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const finalImage = customImageUrl.trim() || imageUrl;
    const finalLoc = includeLocation ? (customLocation.trim() || 'Sanctuary Node') : 'Undisclosed';
    const finalLocId = includeLocation ? (customLocation.trim() || 'Simpul Suaka') : 'Tidak Disebutkan';
    const finalWeather = customWeather.trim() || 'Ambient Comfort, 22°C';
    const finalMood = customMood.trim() || 'Resonated Emotion';

    const newArtifact: Artifact = {
      id: Date.now().toString(),
      title: title,
      titleId: title, // Simulating same for both in user addition
      description: description,
      descriptionId: description,
      imageUrl: finalImage,
      year: new Date().getFullYear(),
      date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
      dateId: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      addedBy: userProfile.name,
      addedById: userProfile.name,
      mood: finalMood,
      moodId: finalMood,
      location: finalLoc,
      locationId: finalLocId,
      weather: finalWeather,
      weatherId: finalWeather,
      category: selectedCategory,
      resonance: selectedResonance,
      tags: tags,
      tagsId: tags,
      partnerPerspective: 'Waiting for your partner to add their perspective to this newly curated artifact...',
      partnerPerspectiveId: 'Menunggu pasanganmu menambahkan perspektif mereka pada artefak yang baru dikurasi ini...',
      isPrivate: isPrivate,
      includeLocation: includeLocation,
    };

    onSave(newArtifact);

    // Reset form states & trigger animation
    setSuccessMessage(t.addedSuccess);
    setTitle('');
    setDescription('');
    setTags(['Travel', 'Rain']);
    setIncludeLocation(false);
    setCustomLocation('');
    setCustomWeather('');
    setCustomMood('');
    setIsPrivate(true);

    setTimeout(() => {
      setSuccessMessage('');
    }, 4000);
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Header and Poetic Info */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full text-center"
      >
        <h2 className="font-display-lg text-display-lg text-charcoal mb-2">
          {t.preserveArtifact}
        </h2>
        <p className="text-muted-taupe font-body-md italic">
          {t.curationArtMemory}
        </p>
      </motion.div>

      {/* Success Notification Banner */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-sage-green/10 text-sage-green p-4 rounded-xl text-center text-sm font-medium border border-sage-green/30"
        >
          ✓ {successMessage}
        </motion.div>
      )}

      {/* Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter w-full">
        {/* Left column: Upload box and presets */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Main Drag & Drop / Upload container */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="relative group cursor-pointer bg-white hover:bg-gallery-beige/30 rounded-2xl p-6 border-2 border-dashed border-outline-variant hover:border-terracotta transition-all duration-300 aspect-video flex flex-col items-center justify-center overflow-hidden shadow-sm"
          >
            {imageUrl ? (
              <div className="absolute inset-0 w-full h-full">
                <img 
                  src={imageUrl} 
                  alt="Pre-upload preview" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-charcoal/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-warm-cream">
                  <ImageIcon className="w-8 h-8 mb-2" />
                  <span className="text-xs tracking-wider uppercase font-semibold">{t.uploadSubtitle}</span>
                </div>
              </div>
            ) : (
              <div className="relative z-10 flex flex-col items-center text-center px-6">
                <ImageIcon className="w-10 h-10 mb-4 text-charcoal/40 group-hover:text-terracotta transition-colors" />
                <h3 className="font-headline-md text-headline-md text-charcoal mb-2">
                  {t.uploadTitle}
                </h3>
                <p className="text-muted-taupe font-caption text-caption max-w-xs">
                  {t.uploadSubtitle}
                </p>
              </div>
            )}
            
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* Preset trigger block */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-label-caps tracking-widest text-muted-taupe font-bold">
                {language === 'en' ? 'Or Select Studio Preset Image' : 'Atau Pilih Gambar Studio Preset'}
              </span>
              <button 
                type="button"
                onClick={() => setShowPresetSelector(!showPresetSelector)}
                className="text-xs text-terracotta hover:underline font-medium"
              >
                {showPresetSelector ? (language === 'en' ? 'Hide' : 'Sembunyikan') : (language === 'en' ? 'Show Presets' : 'Tampilkan Preset')}
              </button>
            </div>

            {showPresetSelector && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="grid grid-cols-3 md:grid-cols-6 gap-2 pt-2"
              >
                {IMAGE_PRESETS.map((preset, i) => (
                  <div 
                    key={i}
                    onClick={() => selectPreset(preset.url)}
                    className="aspect-square rounded-lg overflow-hidden cursor-pointer border border-outline-variant/10 relative group hover:border-terracotta/40"
                  >
                    <img src={preset.url} alt={preset.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                    {imageUrl === preset.url && (
                      <div className="absolute inset-0 bg-charcoal/30 flex items-center justify-center text-warm-cream">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    )}
                  </div>
                ))}
              </motion.div>
            )}

            {/* Custom URL Input option */}
            <div className="mt-2">
              <input
                type="text"
                placeholder={language === 'en' ? 'Or paste custom image URL...' : 'Atau tempel URL gambar kustom...'}
                value={customImageUrl}
                onChange={e => {
                  setCustomImageUrl(e.target.value);
                  if(e.target.value) {
                    setImageUrl(e.target.value);
                  }
                }}
                className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-terracotta text-charcoal transition-all"
              />
            </div>
          </div>

          {/* Media Types options grid row */}
          <div className="grid grid-cols-4 md:grid-cols-7 gap-3 pt-2">
            {[
              { type: 'Photo', icon: ImageIcon, label: t.photoOpt },
              { type: 'Video', icon: Video, label: t.videoOpt },
              { type: 'Voice', icon: Mic, label: t.voiceOpt },
              { type: 'Music', icon: Music, label: t.musicOpt },
              { type: 'Screen', icon: Monitor, label: t.screenOpt },
              { type: 'Map', icon: MapPin, label: t.mapOpt },
              { type: 'Other', icon: MoreHorizontal, label: t.otherOpt },
            ].map(item => (
              <button
                key={item.type}
                type="button"
                onClick={() => setSelectedCategory(item.type as any)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all group shrink-0 ${
                  selectedCategory === item.type
                    ? 'bg-charcoal text-warm-cream border-charcoal shadow-sm'
                    : 'bg-surface-container-low border-transparent hover:border-terracotta/20 hover:bg-warm-cream'
                }`}
              >
                <item.icon className={`w-5 h-5 mb-1 ${selectedCategory === item.type ? 'text-warm-cream' : 'text-charcoal group-hover:text-terracotta'}`} />
                <span className="font-label-caps text-[9px] uppercase tracking-wider text-muted-taupe font-semibold">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right column: Editorial Form details */}
        <div className="lg:col-span-5 bg-white p-8 rounded-2xl border border-outline-variant shadow-[0_2px_16px_rgba(15,23,42,0.02)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Artifact Title */}
            <div className="space-y-2">
              <label className="font-label-caps text-[10px] text-muted-taupe uppercase tracking-widest font-bold block">
                {t.artifactTitleForm}
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder={t.placeholderTitle}
                className="w-full bg-transparent border-b border-outline-variant/40 focus:border-charcoal focus:ring-0 px-0 py-2 font-headline-md text-headline-md placeholder:text-surface-variant transition-colors outline-none text-charcoal"
              />
            </div>

            {/* Description / Story paragraph */}
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <label className="font-label-caps text-[10px] text-muted-taupe uppercase tracking-widest font-bold">
                  {t.descriptionForm}
                </label>
                <span className="text-[9px] text-muted-taupe font-mono">
                  {description.length}/300
                </span>
              </div>
              <textarea
                required
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder={t.placeholderDesc}
                maxLength={300}
                rows={4}
                className="w-full bg-gallery-beige/30 border border-outline-variant/20 rounded-xl p-3.5 font-body-md focus:border-charcoal outline-none placeholder:text-muted-taupe/40 resize-none transition-colors text-charcoal text-sm"
              />
            </div>

            {/* Mood Resonance indicators */}
            <div className="space-y-3">
              <label className="font-label-caps text-[10px] text-muted-taupe uppercase tracking-widest font-bold block">
                {t.resonanceForm}
              </label>
              <div className="flex justify-between items-center bg-surface-container-low p-2 rounded-full px-4 border border-outline-variant/5">
                {moodEmojis.map(emoji => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setSelectedResonance(emoji)}
                    className={`text-xl hover:scale-125 transition-transform p-1.5 rounded-full ${
                      selectedResonance === emoji
                        ? 'bg-white shadow-sm ring-1 ring-outline-variant/10'
                        : ''
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              {/* Descriptive Mood Input */}
              <div className="pt-1">
                <input
                  type="text"
                  value={customMood}
                  onChange={e => setCustomMood(e.target.value)}
                  placeholder={language === 'en' ? 'Describe the mood (e.g., Nostalgic Solitude)' : 'Gambarkan suasana (misal, Kesunyian Nostalgia)'}
                  className="w-full bg-gallery-beige/30 border border-outline-variant/20 rounded-xl px-3 py-2 text-xs outline-none text-charcoal focus:border-terracotta transition-colors"
                />
              </div>
            </div>

            {/* Catalog Tags with delete action and new input option */}
            <div className="space-y-3">
              <label className="font-label-caps text-[10px] text-muted-taupe uppercase tracking-widest font-bold block">
                {t.catalogTagsForm}
              </label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, i) => (
                  <span
                    key={i}
                    onClick={() => handleRemoveTag(i)}
                    className="px-3 py-1 rounded-full bg-charcoal/5 text-muted-taupe border border-outline-variant/15 font-label-caps text-[9px] hover:bg-danger-rose/10 hover:text-danger-rose hover:border-danger-rose/20 cursor-pointer transition-colors"
                    title="Click to remove"
                  >
                    #{tag} ×
                  </span>
                ))}
                
                {showTagInput ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      autoFocus
                      placeholder="tag"
                      value={newTagText}
                      onChange={e => setNewTagText(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleAddTag(e)}
                      className="bg-transparent border-b border-charcoal outline-none px-1 py-0.5 text-[9px] w-16"
                    />
                    <button 
                      type="button" 
                      onClick={handleAddTag} 
                      className="p-1 bg-charcoal text-warm-cream rounded-full"
                    >
                      <Check className="w-2.5 h-2.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowTagInput(true)}
                    className="w-7 h-7 flex items-center justify-center rounded-full border border-dashed border-outline-variant text-muted-taupe hover:border-charcoal transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Privacy Toggles */}
            <div className="pt-4 space-y-4 border-t border-outline-variant/15">
              
              {/* Include location toggle switch */}
              <div className="space-y-3">
                <div 
                  onClick={() => setIncludeLocation(!includeLocation)}
                  className="flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-muted-taupe group-hover:text-terracotta" />
                    <span className="font-body-md text-charcoal text-xs">
                      {t.includeLocationForm}
                    </span>
                  </div>
                  <div className={`w-10 h-5 rounded-full relative transition-colors ${
                    includeLocation ? 'bg-terracotta' : 'bg-surface-container'
                  }`}>
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${
                      includeLocation ? 'right-1' : 'left-1'
                    }`} />
                  </div>
                </div>

                {includeLocation && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-3 pl-7 pt-1"
                  >
                    <div>
                      <label className="block text-[9px] font-mono text-muted-taupe uppercase tracking-wider mb-1">
                        {language === 'en' ? 'Location Name' : 'Nama Lokasi'}
                      </label>
                      <input
                        type="text"
                        value={customLocation}
                        onChange={e => setCustomLocation(e.target.value)}
                        placeholder={language === 'en' ? 'e.g., Veranda Café, Ubud' : 'misal, Kafe Beranda, Ubud'}
                        className="w-full bg-gallery-beige/30 border border-outline-variant/20 rounded-xl px-3 py-2 text-xs outline-none text-charcoal focus:border-terracotta transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-mono text-muted-taupe uppercase tracking-wider mb-1">
                        {language === 'en' ? 'Weather Condition' : 'Kondisi Cuaca'}
                      </label>
                      <input
                        type="text"
                        value={customWeather}
                        onChange={e => setCustomWeather(e.target.value)}
                        placeholder={language === 'en' ? 'e.g., Warm Sun, 28°C' : 'misal, Cerah Hangat, 28°C'}
                        className="w-full bg-gallery-beige/30 border border-outline-variant/20 rounded-xl px-3 py-2 text-xs outline-none text-charcoal focus:border-terracotta transition-colors"
                      />
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Private flag switch */}
              <div 
                onClick={() => setIsPrivate(!isPrivate)}
                className="flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Lock className="w-4 h-4 text-muted-taupe group-hover:text-terracotta" />
                  <span className="font-body-md text-charcoal text-xs">
                    {t.privateForm}
                  </span>
                </div>
                <div className={`w-10 h-5 rounded-full relative transition-colors ${
                  isPrivate ? 'bg-terracotta' : 'bg-surface-container'
                }`}>
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${
                    isPrivate ? 'right-1' : 'left-1'
                  }`} />
                </div>
              </div>
            </div>

            {/* CTA Save button */}
            <div className="pt-6">
              <button
                type="submit"
                className="w-full bg-terracotta hover:bg-terracotta/90 text-white font-headline-md text-[18px] py-4 rounded-xl shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 font-semibold"
              >
                {t.saveToMuseum}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
