
import { GoogleGenAI } from "@google/genai";

// Curated high-quality professional photography for a luxury hospitality aesthetic.
// Registry keys provide immediate return of stock photos, while other prompts use Gemini generation.
const IMAGE_REGISTRY: Record<string, string> = {
  hero: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1920",
  dining_general: "https://images.unsplash.com/photo-1550966841-3ee7adac1668?auto=format&fit=crop&q=80&w=1200",
  dining_lhorizon: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=1200",
  dining_charcoal: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=1200",
  dining_sanctuary: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=1200",
  wellness_general: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1200",
  amenity_pool: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&q=80&w=1200",
  amenity_games: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=1200",
  amenity_spa: "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&q=80&w=1200",
  standard_room: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=1200",
  business_room: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=1200",
  executive_room: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1200",
  suite_room: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=1200",
  about_heritage: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=1200",
  about_vision: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1200",
  faq_section: "https://images.unsplash.com/photo-1517672346350-f2737089fc97?auto=format&fit=crop&q=80&w=1200"
};

// Fixed: Implemented Gemini 2.5 Flash Image generation for dynamic descriptive prompts, while maintaining static registry for known keys.
export const generateAppImage = async (prompt: string): Promise<string | null> => {
  // Return from registry immediately if it's a known key for performance and curated aesthetics
  const registryKey = prompt as keyof typeof IMAGE_REGISTRY;
  if (IMAGE_REGISTRY[registryKey]) {
    return IMAGE_REGISTRY[registryKey];
  }

  // Use Gemini to generate an image for unknown/descriptive prompts
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
    });

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        // Iterate through all parts to find the image part as recommended.
        if (part.inlineData) {
          const base64EncodeString: string = part.inlineData.data;
          return `data:image/png;base64,${base64EncodeString}`;
        }
      }
    }
  } catch (error) {
    console.error('Gemini Image generation failed:', error);
  }

  // Fallback to standard room image if generation fails or it was an unknown key
  return IMAGE_REGISTRY.standard_room;
};

export const APP_IMAGE_PROMPTS = {
  hero: "hero",
  dining_general: "dining_general",
  dining_lhorizon: "dining_lhorizon",
  dining_charcoal: "dining_charcoal",
  dining_sanctuary: "dining_sanctuary",
  wellness_general: "wellness_general",
  amenity_pool: "amenity_pool",
  amenity_games: "amenity_games",
  amenity_spa: "amenity_spa",
  standard_room: "standard_room",
  business_room: "business_room",
  executive_room: "executive_room",
  suite_room: "suite_room",
  video_poster: "hero",
  about_heritage: "about_heritage",
  about_vision: "about_vision",
  faq_section: "faq_section"
};
