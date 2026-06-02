import type { GlobeOutagePoint } from './outage.models';

export type GlobeMapPoint = GlobeOutagePoint;

export function isGlobeOutageMapPoint(p: GlobeMapPoint): p is GlobeOutagePoint {
  return p.kind === 'outage';
}

export function mapPointMarkerId(p: GlobeMapPoint): string {
  return p.markerId;
}

