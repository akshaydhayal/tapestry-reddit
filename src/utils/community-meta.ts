export interface CommunityMeta {
  isCommunity: boolean;
  name?: string;
  gateType?: 'public' | 'fairscore';
  fairScoreGate?: number;
}

const META_DELIMITER = '|COMMUNITY_META|';

export function packCommunityMeta(bio: string, meta: CommunityMeta): string {
  const cleanBio = extractCommunityMeta(bio).cleanBio;
  return `${cleanBio}${META_DELIMITER}${JSON.stringify(meta)}`;
}

export function extractCommunityMeta(bio: string | null | undefined): { cleanBio: string, meta: CommunityMeta | null } {
  if (!bio) return { cleanBio: '', meta: null };
  
  const separatorIndex = bio.indexOf(META_DELIMITER);
  if (separatorIndex === -1) {
    return { cleanBio: bio, meta: null };
  }

  const cleanBio = bio.substring(0, separatorIndex);
  const metaString = bio.substring(separatorIndex + META_DELIMITER.length);
  
  try {
    const meta = JSON.parse(metaString) as CommunityMeta;
    return { cleanBio, meta };
  } catch (e) {
    console.error("Failed to parse community metadata", e);
    return { cleanBio, meta: null };
  }
}

// Ensure FairScore cache works alongside CommunityMeta
// We should use extractFairScore string manipulation safely.
// Note: If both metas exist, we should unpack in order.
// Let's assume fairscore is always at the very end.
