import {
  Dress,
  AccessoryItem,
  UserBehaviorProfile,
  AIRecommendationsResponse,
  RecommendedDressItem,
  RecommendedAccessoryItem,
  TargetedEmailCampaign,
} from '../types';

/**
 * Computes heuristic-based personalized recommendations locally
 * when API is unreachable or while waiting for AI generation.
 */
export function computeLocalRecommendations(
  profile: UserBehaviorProfile,
  allDresses: Dress[],
  allAccessories: AccessoryItem[]
): AIRecommendationsResponse {
  const quiz = profile.quizPreferences;
  const browsedIds = new Set(profile.browsingHistory.map((b) => b.dressId));
  const cartIds = new Set(profile.cartDressIds);
  const wishlistIds = new Set(profile.wishlistDressIds);
  const purchasedIds = new Set(profile.pastPurchases.flatMap((p) => p.dressIds));

  // Determine dominant attributes from browsing and cart
  const occasionFrequency: Record<string, number> = {};
  const silhouetteFrequency: Record<string, number> = {};
  const fabricFrequency: Record<string, number> = {};

  // Weight recent browsing
  profile.browsingHistory.forEach((b) => {
    const dress = allDresses.find((d) => d.id === b.dressId);
    if (dress) {
      occasionFrequency[dress.occasion] = (occasionFrequency[dress.occasion] || 0) + (2 * b.viewCount);
      silhouetteFrequency[dress.silhouette] = (silhouetteFrequency[dress.silhouette] || 0) + (2 * b.viewCount);
      if (dress.fabric) {
        const key = dress.fabric.split(' ')[0] || 'Silk';
        fabricFrequency[key] = (fabricFrequency[key] || 0) + (1 * b.viewCount);
      }
    }
  });

  // Weight cart items heavily
  profile.cartDressIds.forEach((id) => {
    const dress = allDresses.find((d) => d.id === id);
    if (dress) {
      occasionFrequency[dress.occasion] = (occasionFrequency[dress.occasion] || 0) + 5;
      silhouetteFrequency[dress.silhouette] = (silhouetteFrequency[dress.silhouette] || 0) + 5;
    }
  });

  // Weight past purchases
  profile.pastPurchases.forEach((p) => {
    p.dressIds.forEach((id) => {
      const dress = allDresses.find((d) => d.id === id);
      if (dress) {
        occasionFrequency[dress.occasion] = (occasionFrequency[dress.occasion] || 0) + 4;
        silhouetteFrequency[dress.silhouette] = (silhouetteFrequency[dress.silhouette] || 0) + 4;
      }
    });
  });

  // Dominant traits
  const topOccasion = quiz?.occasion && quiz.occasion !== 'All Galas'
    ? quiz.occasion
    : Object.entries(occasionFrequency).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Gala';

  const topSilhouette = quiz?.silhouette
    ? quiz.silhouette
    : Object.entries(silhouetteFrequency).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Column / Sheath';

  // Score dresses
  const scoredDresses: RecommendedDressItem[] = allDresses.map((dress) => {
    let score = 50; // base score
    let matchedReasons: string[] = [];

    // Quiz Match (Highest weight for explicit intent)
    if (quiz?.occasion && (dress.occasion.toLowerCase().includes(quiz.occasion.toLowerCase()) || quiz.occasion.toLowerCase().includes(dress.occasion.toLowerCase()))) {
      score += 25;
      matchedReasons.push(`Matches your designated event preference (${quiz.occasion})`);
    }
    if (quiz?.silhouette && dress.silhouette.toLowerCase().includes(quiz.silhouette.toLowerCase())) {
      score += 22;
      matchedReasons.push(`Tailored to your preferred ${dress.silhouette} cut`);
    }
    if (quiz?.mood) {
      if (quiz.mood.includes('Minimalist') && (dress.silhouette.includes('Column') || dress.silhouette.includes('Bias'))) {
        score += 15;
        matchedReasons.push('Reflects your minimalist, sculptural aesthetic');
      } else if (quiz.mood.includes('Dramatic') && (dress.fabric.includes('Velvet') || dress.fabric.includes('Mikado'))) {
        score += 15;
        matchedReasons.push('Embraces your dramatic, regal mood');
      } else if (quiz.mood.includes('Romantic') && (dress.fabric.includes('Lace') || dress.silhouette.includes('A-Line'))) {
        score += 15;
        matchedReasons.push('Harmonizes with your romantic styling direction');
      }
    }

    // Browsing History affinity
    if (browsedIds.has(dress.id)) {
      score += 8;
      matchedReasons.push('Revisiting an item from your private lookbook explorations');
    } else if (silhouetteFrequency[dress.silhouette]) {
      score += 12;
      matchedReasons.push(`Shares the ${dress.silhouette} silhouette from your recent views`);
    }

    // Cart and Wishlist Affinity
    if (cartIds.has(dress.id)) {
      score -= 20; // Don't re-recommend an item already in active cart as top new discovery
    }
    if (wishlistIds.has(dress.id)) {
      score += 14;
      matchedReasons.push('Saved in your private curation vault');
    }

    // Past Purchase Complementarity
    if (purchasedIds.has(dress.id)) {
      score -= 35; // Don't prioritize repeat purchases of the same formal gown
    }

    // Rating and Bestseller boost
    if (dress.isBestseller) score += 6;
    if (dress.rating >= 4.9) score += 4;

    // Normalize score to 80-99%
    const normalizedScore = Math.min(99, Math.max(78, Math.round(score)));

    // Tag assignment
    let curatorTag = 'Aesthetic Match';
    if (quiz?.silhouette && dress.silhouette.includes(quiz.silhouette)) {
      curatorTag = 'Quiz Silhouette Choice';
    } else if (wishlistIds.has(dress.id)) {
      curatorTag = 'Curator Wishlist Pick';
    } else if (dress.isBestseller) {
      curatorTag = 'Atelier Icon';
    } else if (normalizedScore >= 95) {
      curatorTag = 'Signature 98% Match';
    }

    const reason = matchedReasons.length > 0
      ? matchedReasons.slice(0, 2).join(' • ')
      : `Harmonious drape for formal ${dress.occasion} soirées with opulent ${dress.fabric.split(' ')[0]} texture.`;

    return {
      dress,
      matchScore: normalizedScore,
      reason,
      curatorTag,
    };
  });

  // Sort descending by matchScore
  scoredDresses.sort((a, b) => b.matchScore - a.matchScore);

  // Score accessories to complement top dresses
  const topDresses = scoredDresses.slice(0, 3).map((s) => s.dress);
  const scoredAccessories: RecommendedAccessoryItem[] = allAccessories.map((acc, index) => {
    let accScore = 85 + (index % 12);
    let pairedCategory = 'Jewelry';
    let reason = 'Selected to complete architectural gowns without competing with the neckline.';

    if (acc.category === 'jewelry') {
      pairedCategory = 'Haute Jewelry';
      reason = 'Marquise-cut pavé crystal drops chosen to catch ballroom chandelier lighting.';
    } else if (acc.category === 'bag') {
      pairedCategory = 'Evening Minaudière';
      reason = 'Duchesse satin clutch tailored to sit gracefully against silk and velvet gowns.';
    } else if (acc.category === 'shoes') {
      pairedCategory = 'Atelier Stilettos';
      reason = '90mm metallic nappa heels crafted for effortless posture and red-carpet stride.';
    } else if (acc.category === 'wrap') {
      pairedCategory = 'Silk Stole';
      reason = '100% featherweight mulberry silk stole for cool terrace breezes and arrivals.';
    }

    return {
      accessory: acc,
      matchScore: accScore,
      reason,
      pairedCategory,
    };
  });

  // Synthesize Persona Summary
  let personaSummary = 'The Timeless Couturière: Modern Black Tie & Architectural Silhouettes';
  if (quiz?.mood?.includes('Dramatic') || topOccasion.includes('Gala')) {
    personaSummary = 'The Grand Gala Muse: Sculptural Drapes & Opulent Noir Obsidian';
  } else if (quiz?.mood?.includes('Romantic') || topSilhouette.includes('Bias')) {
    personaSummary = 'The Riviera Silk Purist: Fluid Bias Drapery & Champagne Luminescence';
  } else if (quiz?.occasion?.includes('Cocktail') || topSilhouette.includes('Sheath')) {
    personaSummary = 'The Contemporary Siren: Minimalist Contours & Architectural Refinement';
  }

  const stylistNote = `Our master couturiers have curated these pieces reflecting your interest in ${topSilhouette} drapery and ${topOccasion} formalwear. Each piece balances structured poise with unencumbered ease.`;

  return {
    personaSummary,
    confidenceScore: 96,
    primaryOccasion: topOccasion,
    preferredSilhouette: topSilhouette,
    dresses: scoredDresses.slice(0, 4),
    accessories: scoredAccessories.slice(0, 4),
    stylistNote,
  };
}

/**
 * Fetches AI recommendations from server (Gemini),
 * gracefully falling back to the local deterministic model.
 */
export async function getAIRecommendations(
  profile: UserBehaviorProfile,
  allDresses: Dress[],
  allAccessories: AccessoryItem[]
): Promise<AIRecommendationsResponse> {
  try {
    const res = await fetch('/api/recommendations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile, dressesCount: allDresses.length }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.dresses && data.dresses.length > 0) {
        // Hydrate dress & accessory objects
        const hydratedDresses: RecommendedDressItem[] = data.dresses
          .map((item: any) => {
            const dress = allDresses.find((d) => d.id === item.dressId);
            if (!dress) return null;
            return {
              dress,
              matchScore: item.matchScore || 95,
              reason: item.reason || 'AI Curated match for your taste profile.',
              curatorTag: item.curatorTag || 'Haute Match',
            };
          })
          .filter(Boolean) as RecommendedDressItem[];

        const hydratedAccessories: RecommendedAccessoryItem[] = (data.accessories || [])
          .map((item: any) => {
            const acc = allAccessories.find((a) => a.id === item.accessoryId);
            if (!acc) return null;
            return {
              accessory: acc,
              matchScore: item.matchScore || 92,
              reason: item.reason || 'Curated accessory pairing.',
              pairedCategory: item.pairedCategory || acc.category,
            };
          })
          .filter(Boolean) as RecommendedAccessoryItem[];

        if (hydratedDresses.length > 0) {
          return {
            personaSummary: data.personaSummary || 'The Infi Haute Couturière',
            confidenceScore: data.confidenceScore || 97,
            primaryOccasion: data.primaryOccasion || 'Black Tie & Gala',
            preferredSilhouette: data.preferredSilhouette || 'Column / Sheath',
            dresses: hydratedDresses,
            accessories: hydratedAccessories.length > 0 ? hydratedAccessories : computeLocalRecommendations(profile, allDresses, allAccessories).accessories,
            stylistNote: data.stylistNote || 'Curated based on your active preferences and atelier interactions.',
          };
        }
      }
    }
  } catch (err) {
    console.warn('AI Recommendation API unavailable, employing luxury couture heuristic:', err);
  }

  return computeLocalRecommendations(profile, allDresses, allAccessories);
}

/**
 * Product detail page "You May Also Like" recommendation generator
 * Takes current dress, user profile, and returns tailored alternatives.
 */
export function getProductPageRecommendations(
  currentDress: Dress,
  profile: UserBehaviorProfile,
  allDresses: Dress[],
  allAccessories: AccessoryItem[]
): { dresses: RecommendedDressItem[]; accessories: RecommendedAccessoryItem[] } {
  const otherDresses = allDresses.filter((d) => d.id !== currentDress.id);
  const quiz = profile.quizPreferences;

  const scoredDresses: RecommendedDressItem[] = otherDresses.map((dress) => {
    let score = 70;
    let reasons: string[] = [];

    // Occasion or Category alignment
    if (dress.occasion === currentDress.occasion) {
      score += 15;
      reasons.push(`Complementary ${dress.occasion} gala alternative`);
    }
    if (dress.category === currentDress.category) {
      score += 10;
      reasons.push(`Sister silhouette in ${dress.category}`);
    }

    // Fabric or Silhouette harmony
    if (dress.silhouette === currentDress.silhouette) {
      score += 12;
      reasons.push(`Matches the ${dress.silhouette} structural line`);
    }
    if (dress.fabric.split(' ')[0] === currentDress.fabric.split(' ')[0]) {
      score += 8;
      reasons.push(`Shares pure ${dress.fabric.split(' ')[0]} weaving`);
    }

    // Personal user quiz boost
    if (quiz?.silhouette && dress.silhouette.toLowerCase().includes(quiz.silhouette.toLowerCase())) {
      score += 10;
      reasons.push(`Aligns with your ${quiz.silhouette} quiz preference`);
    }

    // Viewed before
    if (profile.browsingHistory.some((b) => b.dressId === dress.id)) {
      score += 6;
      reasons.push('Previously explored by you');
    }

    const matchScore = Math.min(99, Math.max(82, score));
    return {
      dress,
      matchScore,
      reason: reasons.length > 0 ? reasons.join(' • ') : `Curated styling alternative for ${currentDress.name}.`,
      curatorTag: dress.silhouette === currentDress.silhouette ? 'Same Silhouette' : 'Editorial Sister',
    };
  });

  scoredDresses.sort((a, b) => b.matchScore - a.matchScore);

  // Accessories specifically curated for this dress
  const pairedAccessories: RecommendedAccessoryItem[] = (currentDress.completeTheLook || allAccessories.slice(0, 3)).map((acc, i) => ({
    accessory: acc,
    matchScore: 96 - (i * 2),
    reason: `Specifically proportioned to balance ${currentDress.name}'s neckline and movement.`,
    pairedCategory: acc.category.toUpperCase(),
  }));

  return {
    dresses: scoredDresses.slice(0, 3),
    accessories: pairedAccessories,
  };
}

/**
 * Generates an individualized VIP Email Campaign tailored to the client's profile
 */
export async function generateTargetedEmailCampaign(
  profile: UserBehaviorProfile,
  recommendations: AIRecommendationsResponse,
  clientName: string = 'Hélène Vance',
  clientEmail: string = 'helene.vance@atelier-client.com'
): Promise<TargetedEmailCampaign> {
  const topDresses = recommendations.dresses.slice(0, 2);
  const topAccessories = recommendations.accessories.slice(0, 2);
  const occasion = recommendations.primaryOccasion || 'Autumn Black-Tie Soirée';

  const subjectLine = `${clientName}, your Private Infi Atelier Edit awaits | Handcrafted for your ${occasion}`;
  const preheader = `Selected gowns and accessories based on your recent explorations of ${recommendations.preferredSilhouette} tailoring.`;
  const heroTagline = `The Private Salon Edit: ${recommendations.personaSummary}`;

  const personalSalutation = `Dear ${clientName},`;
  const couturierNote = `During your recent visits to Infi, our master couturiers noted your discerning eye for ${recommendations.preferredSilhouette} silhouettes and ${recommendations.primaryOccasion} tailoring. In celebration of upcoming private salon appointments, we have prepared this exclusive edit curated specifically around your aesthetic preferences.`;

  return {
    campaignId: `CAMP-${Date.now().toString(36).toUpperCase()}`,
    clientName,
    clientEmail,
    subjectLine,
    preheader,
    heroTagline,
    personalSalutation,
    couturierNote,
    recommendedDresses: topDresses.map((rd) => ({
      dress: rd.dress,
      exclusiveNote: `Curated for your preferences: ${rd.reason}`,
      matchScore: rd.matchScore,
    })),
    recommendedAccessories: topAccessories.map((ra) => ({
      accessory: ra.accessory,
      pairReason: ra.reason,
    })),
    privateInvitationCode: `VIP-INFI-${new Date().getFullYear()}`,
    vipBenefit: 'Complimentary private bespoke alteration consultation & priority courier shipping',
    generatedDate: new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
  };
}
