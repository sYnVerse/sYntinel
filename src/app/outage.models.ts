/** Matches LucentApi OutageDto JSON (camelCase). */
export interface OutageDto {
  id: string;
  title: string;
  description: string;
  link: string;
  thumbnail: string;
  latencyMs: number;
  latitude: number;
  longitude: number;
  uncertaintyKm?: number | null;
  platform: string;
  status: 'down' | 'degraded' | 'up';
  service: string;
  timestamp: number;
}

/** globe.gl point + sidebar details. */
export interface GlobeOutagePoint extends OutageDto {
  markerId: string;
  kind: 'outage';
}

export function toGlobeOutagePoint(d: OutageDto): GlobeOutagePoint | null {
  if (!d.id) return null;
  if (!Number.isFinite(d.latitude) || !Number.isFinite(d.longitude)) return null;
  return {
    ...d,
    markerId: d.id,
    kind: 'outage' as const
  };
}
