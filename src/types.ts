export type Language = 'en' | 'id';

export type View = 'home' | 'gallery' | 'add' | 'chronicles' | 'detail';

export interface Artifact {
  id: string;
  title: string;
  titleId: string;
  description: string;
  descriptionId: string;
  imageUrl: string;
  year: number;
  date: string;
  dateId: string;
  addedBy: string;
  addedById: string;
  mood: string;
  moodId: string;
  location: string;
  locationId: string;
  weather: string;
  weatherId: string;
  category: 'Photo' | 'Video' | 'Voice' | 'Music' | 'Screen' | 'Map' | 'Other';
  resonance: string; // Emoji
  tags: string[];
  tagsId: string[];
  partnerPerspective?: string;
  partnerPerspectiveId?: string;
  isPrivate: boolean;
  includeLocation: boolean;
}

export interface UserProfile {
  name: string;
  avatarUrl: string;
  partnerName: string;
}

export interface AppState {
  currentLanguage: Language;
  currentView: View;
  selectedArtifactId: string | null;
  artifacts: Artifact[];
  userProfile: UserProfile;
  partnerProgress: number; // e.g. 50%
}
