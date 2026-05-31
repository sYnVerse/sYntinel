interface Location {
  latitude: number;
  longitude: number;
  uncertaintyKm?: number;
}

export interface CuratedStream {
  id: string;
  title: string;
  description: string;
  link: string;
  thumbnail: string;
  latitude: number;
  longitude: number;
  platform: 'twitch' | 'youtube' | 'kick';
}

// Famous global cities with coordinates
export const CityCoordinates: Record<string, Location> = {
  tokyo: { latitude: 35.6595, longitude: 139.7006, uncertaintyKm: 15 },
  shibuya: { latitude: 35.6595, longitude: 139.7006, uncertaintyKm: 5 },
  london: { latitude: 51.5074, longitude: -0.1278, uncertaintyKm: 20 },
  paris: { latitude: 48.8566, longitude: 2.3522, uncertaintyKm: 12 },
  berlin: { latitude: 52.5200, longitude: 13.4050, uncertaintyKm: 15 },
  rome: { latitude: 41.9028, longitude: 12.4964, uncertaintyKm: 15 },
  madrid: { latitude: 40.4168, longitude: -3.7038, uncertaintyKm: 15 },
  amsterdam: { latitude: 52.3676, longitude: 4.9041, uncertaintyKm: 10 },
  brussels: { latitude: 50.8503, longitude: 4.3517, uncertaintyKm: 10 },
  dublin: { latitude: 53.3498, longitude: -6.2603, uncertaintyKm: 10 },
  reykjavik: { latitude: 64.1466, longitude: -21.9426, uncertaintyKm: 8 },
  oslo: { latitude: 59.9139, longitude: 10.7522, uncertaintyKm: 12 },
  stockholm: { latitude: 59.3293, longitude: 18.0686, uncertaintyKm: 15 },
  helsinki: { latitude: 60.1699, longitude: 24.9384, uncertaintyKm: 10 },
  prague: { latitude: 50.0755, longitude: 14.4378, uncertaintyKm: 10 },
  vienna: { latitude: 48.2082, longitude: 16.3738, uncertaintyKm: 12 },
  athens: { latitude: 37.9838, longitude: 23.7275, uncertaintyKm: 15 },
  istanbul: { latitude: 41.0082, longitude: 28.9784, uncertaintyKm: 25 },
  moscow: { latitude: 55.7558, longitude: 37.6173, uncertaintyKm: 30 },
  kyiv: { latitude: 50.4501, longitude: 30.5234, uncertaintyKm: 20 },
  warsaw: { latitude: 52.2297, longitude: 21.0122, uncertaintyKm: 15 },
  budapest: { latitude: 47.4979, longitude: 19.0402, uncertaintyKm: 15 },
  "new york": { latitude: 40.7128, longitude: -74.0060, uncertaintyKm: 25 },
  nyc: { latitude: 40.7128, longitude: -74.0060, uncertaintyKm: 25 },
  manhattan: { latitude: 40.7831, longitude: -73.9712, uncertaintyKm: 10 },
  "times square": { latitude: 40.7580, longitude: -73.9855, uncertaintyKm: 2 },
  "los angeles": { latitude: 34.0522, longitude: -118.2437, uncertaintyKm: 35 },
  la: { latitude: 34.0522, longitude: -118.2437, uncertaintyKm: 35 },
  hollywood: { latitude: 34.0928, longitude: -118.3287, uncertaintyKm: 5 },
  "santa monica": { latitude: 34.0194, longitude: -118.4912, uncertaintyKm: 5 },
  "san francisco": { latitude: 37.7749, longitude: -122.4194, uncertaintyKm: 15 },
  sf: { latitude: 37.7749, longitude: -122.4194, uncertaintyKm: 15 },
  chicago: { latitude: 41.8781, longitude: -87.6298, uncertaintyKm: 25 },
  miami: { latitude: 25.7617, longitude: -80.1918, uncertaintyKm: 20 },
  seattle: { latitude: 47.6062, longitude: -122.3321, uncertaintyKm: 20 },
  boston: { latitude: 42.3601, longitude: -71.0589, uncertaintyKm: 15 },
  "washington dc": { latitude: 38.9072, longitude: -77.0369, uncertaintyKm: 15 },
  "las vegas": { latitude: 36.1699, longitude: -115.1398, uncertaintyKm: 15 },
  toronto: { latitude: 43.6532, longitude: -79.3832, uncertaintyKm: 25 },
  vancouver: { latitude: 49.2827, longitude: -123.1207, uncertaintyKm: 20 },
  montreal: { latitude: 45.5017, longitude: -73.5673, uncertaintyKm: 20 },
  "mexico city": { latitude: 19.4326, longitude: -99.1332, uncertaintyKm: 35 },
  "rio de janeiro": { latitude: -22.9068, longitude: -43.1729, uncertaintyKm: 25 },
  copacabana: { latitude: -22.9707, longitude: -43.1824, uncertaintyKm: 3 },
  "sao paulo": { latitude: -23.5505, longitude: -46.6333, uncertaintyKm: 30 },
  "buenos aires": { latitude: -34.6037, longitude: -58.3816, uncertaintyKm: 25 },
  santiago: { latitude: -33.4489, longitude: -70.6693, uncertaintyKm: 20 },
  sydney: { latitude: -33.8688, longitude: 151.2093, uncertaintyKm: 25 },
  melbourne: { latitude: -37.8136, longitude: 144.9631, uncertaintyKm: 20 },
  brisbane: { latitude: -27.4705, longitude: 153.0260, uncertaintyKm: 20 },
  auckland: { latitude: -36.8485, longitude: 174.7633, uncertaintyKm: 20 },
  wellington: { latitude: -41.2865, longitude: 174.7762, uncertaintyKm: 15 },
  beijing: { latitude: 39.9042, longitude: 116.4074, uncertaintyKm: 30 },
  shanghai: { latitude: 31.2304, longitude: 121.4737, uncertaintyKm: 30 },
  "hong kong": { latitude: 22.3193, longitude: 114.1694, uncertaintyKm: 15 },
  hk: { latitude: 22.3193, longitude: 114.1694, uncertaintyKm: 15 },
  taipei: { latitude: 25.0330, longitude: 121.5654, uncertaintyKm: 15 },
  seoul: { latitude: 37.5665, longitude: 126.9780, uncertaintyKm: 15 },
  singapore: { latitude: 1.3521, longitude: 103.8198, uncertaintyKm: 5 },
  bangkok: { latitude: 13.7563, longitude: 100.5018, uncertaintyKm: 20 },
  "kuala lumpur": { latitude: 3.1390, longitude: 101.6869, uncertaintyKm: 15 },
  jakarta: { latitude: -6.2088, longitude: 106.8456, uncertaintyKm: 25 },
  manila: { latitude: 14.5995, longitude: 120.9842, uncertaintyKm: 20 },
  mumbai: { latitude: 19.0760, longitude: 72.8777, uncertaintyKm: 30 },
  "new delhi": { latitude: 28.6139, longitude: 77.2090, uncertaintyKm: 25 },
  delhi: { latitude: 28.6139, longitude: 77.2090, uncertaintyKm: 25 },
  cairo: { latitude: 30.0444, longitude: 31.2357, uncertaintyKm: 25 },
  "cape town": { latitude: -33.9249, longitude: 18.4241, uncertaintyKm: 20 },
  johannesburg: { latitude: -26.2041, longitude: 28.0473, uncertaintyKm: 20 },
  nairobi: { latitude: -1.2921, longitude: 36.8219, uncertaintyKm: 15 },
  dubai: { latitude: 25.2048, longitude: 55.2708, uncertaintyKm: 15 },
  jerusalem: { latitude: 31.7683, longitude: 35.2137, uncertaintyKm: 10 },
  "tel aviv": { latitude: 32.0853, longitude: 34.7818, uncertaintyKm: 10 },
  riyadh: { latitude: 24.7136, longitude: 46.6753, uncertaintyKm: 20 },
  honolulu: { latitude: 21.3069, longitude: -157.8583, uncertaintyKm: 15 },
  hawaii: { latitude: 19.8968, longitude: -155.5828, uncertaintyKm: 100 },
};

// Countries for broad fallback geolocation
export const CountryCoordinates: Record<string, Location> = {
  japan: { latitude: 36.2048, longitude: 138.2529, uncertaintyKm: 400 },
  "united kingdom": { latitude: 55.3781, longitude: -3.4360, uncertaintyKm: 300 },
  uk: { latitude: 55.3781, longitude: -3.4360, uncertaintyKm: 300 },
  england: { latitude: 52.3555, longitude: -1.1743, uncertaintyKm: 150 },
  scotland: { latitude: 56.4907, longitude: -4.2026, uncertaintyKm: 150 },
  france: { latitude: 46.2276, longitude: 2.2137, uncertaintyKm: 300 },
  germany: { latitude: 51.1657, longitude: 10.4515, uncertaintyKm: 300 },
  italy: { latitude: 41.8719, longitude: 12.5674, uncertaintyKm: 300 },
  spain: { latitude: 40.4637, longitude: -3.7492, uncertaintyKm: 300 },
  "united states": { latitude: 37.0902, longitude: -95.7129, uncertaintyKm: 1500 },
  usa: { latitude: 37.0902, longitude: -95.7129, uncertaintyKm: 1500 },
  america: { latitude: 37.0902, longitude: -95.7129, uncertaintyKm: 1500 },
  canada: { latitude: 56.1304, longitude: -106.3468, uncertaintyKm: 1500 },
  australia: { latitude: -25.2744, longitude: 133.7751, uncertaintyKm: 1200 },
  "new zealand": { latitude: -40.9006, longitude: 174.8860, uncertaintyKm: 400 },
  brazil: { latitude: -14.2350, longitude: -51.9253, uncertaintyKm: 1000 },
  korea: { latitude: 35.9078, longitude: 127.7669, uncertaintyKm: 150 },
  "south korea": { latitude: 35.9078, longitude: 127.7669, uncertaintyKm: 150 },
  thailand: { latitude: 15.8700, longitude: 100.9925, uncertaintyKm: 250 },
  taiwan: { latitude: 23.6978, longitude: 120.9605, uncertaintyKm: 100 },
  ireland: { latitude: 53.4129, longitude: -8.2439, uncertaintyKm: 150 },
  switzerland: { latitude: 46.8182, longitude: 8.2275, uncertaintyKm: 80 },
  austria: { latitude: 47.5162, longitude: 14.5501, uncertaintyKm: 100 },
  netherlands: { latitude: 52.1326, longitude: 5.2913, uncertaintyKm: 80 },
  holland: { latitude: 52.1326, longitude: 5.2913, uncertaintyKm: 80 },
  sweden: { latitude: 60.1282, longitude: 18.6435, uncertaintyKm: 400 },
  norway: { latitude: 60.4720, longitude: 8.4689, uncertaintyKm: 400 },
  denmark: { latitude: 56.2639, longitude: 9.5018, uncertaintyKm: 100 },
  mexico: { latitude: 23.6345, longitude: -102.5528, uncertaintyKm: 600 },
  "south africa": { latitude: -30.5595, longitude: 22.9375, uncertaintyKm: 400 },
  india: { latitude: 20.5937, longitude: 78.9629, uncertaintyKm: 800 },
};

// Stable, high-quality YouTube live cameras
export const CuratedYouTubeCams = [
  {
    id: "y60wEpD5mTI",
    title: "Shibuya Crossing Live Cam",
    description: "Live camera overview of the famous Shibuya Crossing in Tokyo, Japan.",
    link: "https://www.youtube.com/watch?v=y60wEpD5mTI",
    thumbnail: "https://i.ytimg.com/vi/y60wEpD5mTI/hqdefault.jpg",
    latitude: 35.6595,
    longitude: 139.7006,
    platform: "youtube" as const,
  },
  {
    id: "mRe-514tGMg",
    title: "Times Square Live Camera",
    description: "Real-time street webcam from Times Square, New York City.",
    link: "https://www.youtube.com/watch?v=mRe-514tGMg",
    thumbnail: "https://i.ytimg.com/vi/mRe-514tGMg/hqdefault.jpg",
    latitude: 40.7580,
    longitude: -73.9855,
    platform: "youtube" as const,
  },
  {
    id: "ph1vpnYIXCs",
    title: "Venice - Rialto Bridge Live Stream",
    description: "Watch gondolas and traffic on the Grand Canal of Venice, Italy.",
    link: "https://www.youtube.com/watch?v=ph1vpnYIXCs",
    thumbnail: "https://i.ytimg.com/vi/ph1vpnYIXCs/hqdefault.jpg",
    latitude: 45.4380,
    longitude: 12.3359,
    platform: "youtube" as const,
  },
  {
    id: "nOCp23X_l9A",
    title: "Eiffel Tower Live Cam",
    description: "Live view of the Eiffel Tower from the Seine River in Paris, France.",
    link: "https://www.youtube.com/watch?v=nOCp23X_l9A",
    thumbnail: "https://i.ytimg.com/vi/nOCp23X_l9A/hqdefault.jpg",
    latitude: 48.8584,
    longitude: 2.2945,
    platform: "youtube" as const,
  },
  {
    id: "dD28Q2t-2eM",
    title: "Abbey Road Crossing Live",
    description: "Live camera at the world-famous Abbey Road zebra crossing in London, UK.",
    link: "https://www.youtube.com/watch?v=dD28Q2t-2eM",
    thumbnail: "https://i.ytimg.com/vi/dD28Q2t-2eM/hqdefault.jpg",
    latitude: 51.5322,
    longitude: -0.1773,
    platform: "youtube" as const,
  },
  {
    id: "_031vHlDq2s",
    title: "Santa Monica Beach & Pier Webcam",
    description: "Live look at the beach and Pacific Park Ferris wheel in Santa Monica, California.",
    link: "https://www.youtube.com/watch?v=_031vHlDq2s",
    thumbnail: "https://i.ytimg.com/vi/_031vHlDq2s/hqdefault.jpg",
    latitude: 34.0101,
    longitude: -118.4960,
    platform: "youtube" as const,
  },
  {
    id: "a6m3Z7_1fFs",
    title: "Temple Bar Live Stream - Dublin",
    description: "Watch live street music and pedestrians outside Temple Bar, Dublin, Ireland.",
    link: "https://www.youtube.com/watch?v=a6m3Z7_1fFs",
    thumbnail: "https://i.ytimg.com/vi/a6m3Z7_1fFs/hqdefault.jpg",
    latitude: 53.3444,
    longitude: -6.2592,
    platform: "youtube" as const,
  },
  {
    id: "J4lXwRuhgUY",
    title: "Sydney Harbour Live Camera",
    description: "Live view of the Sydney Opera House and Sydney Harbour Bridge from Australia.",
    link: "https://www.youtube.com/watch?v=J4lXwRuhgUY",
    thumbnail: "https://i.ytimg.com/vi/J4lXwRuhgUY/hqdefault.jpg",
    latitude: -33.8688,
    longitude: 151.2093,
    platform: "youtube" as const,
  },
  {
    id: "jD1L-F-y7rA",
    title: "Copacabana Beach Live Stream - Rio",
    description: "Live camera overview of Copacabana Beach in Rio de Janeiro, Brazil.",
    link: "https://www.youtube.com/watch?v=jD1L-F-y7rA",
    thumbnail: "https://i.ytimg.com/vi/jD1L-F-y7rA/hqdefault.jpg",
    latitude: -22.9707,
    longitude: -43.1824,
    platform: "youtube" as const,
  },
  {
    id: "c1nJ3uSPlXo",
    title: "Prague Old Town Square Live Cam",
    description: "Scenic live look at the Astronomical Clock and Old Town Square in Prague, Czech Republic.",
    link: "https://www.youtube.com/watch?v=c1nJ3uSPlXo",
    thumbnail: "https://i.ytimg.com/vi/c1nJ3uSPlXo/hqdefault.jpg",
    latitude: 50.0875,
    longitude: 14.4212,
    platform: "youtube" as const,
  },
];

// Popular Twitch IRL Streamers with fallback locations
export const CuratedTwitchStreamers: Record<string, Location> = {
  jakenbakelive: { latitude: 35.6595, longitude: 139.7006, uncertaintyKm: 30 }, // Tokyo
  hachubby: { latitude: 37.5665, longitude: 126.9780, uncertaintyKm: 10 }, // Seoul
  exbc: { latitude: 37.5665, longitude: 126.9780, uncertaintyKm: 15 }, // Seoul
  robcdfs: { latitude: 35.6595, longitude: 139.7006, uncertaintyKm: 20 }, // Tokyo
  roamingtours: { latitude: 51.5074, longitude: -0.1278, uncertaintyKm: 10 }, // London
  joeykaotyk: { latitude: 25.0330, longitude: 121.5654, uncertaintyKm: 25 }, // Taipei
  cooksux: { latitude: 34.0522, longitude: -118.2437, uncertaintyKm: 20 }, // Los Angeles
  hitch: { latitude: 49.2827, longitude: -123.1207, uncertaintyKm: 50 }, // Vancouver / Roadtrip
  extraemily: { latitude: 30.2672, longitude: -97.7431, uncertaintyKm: 10 }, // Austin
};

// Popular Kick IRL Streamers with fallback locations
export const CuratedKickStreamers: Record<string, Location> = {
  iceposeidon: { latitude: 34.0522, longitude: -118.2437, uncertaintyKm: 50 }, // Los Angeles / Travel
  nino: { latitude: 35.6595, longitude: 139.7006, uncertaintyKm: 30 }, // Tokyo
  sampepper: { latitude: 25.7617, longitude: -80.1918, uncertaintyKm: 50 }, // Miami / Travel
};

// Helper: Applies a small random offset (jitter) to coordinates to prevent markers stacking perfectly
export function applyJitter(lat: number, lng: number, rangeKm: number = 2.0): Location {
  const earthRadiusKm = 6371;
  const maxOffsetRad = rangeKm / earthRadiusKm;
  
  // Random angle and random distance within the circle
  const angle = Math.random() * 2 * Math.PI;
  const distance = Math.random() * maxOffsetRad;
  
  const dLat = distance * Math.cos(angle);
  const dLng = (distance * Math.sin(angle)) / Math.cos((lat * Math.PI) / 180);
  
  return {
    latitude: lat + (dLat * 180) / Math.PI,
    longitude: lng + (dLng * 180) / Math.PI,
    uncertaintyKm: rangeKm,
  };
}

// Function to scan text for location markers and geolocate
export function geolocateFromText(text: string): Location | null {
  const normalized = text.toLowerCase();
  
  // 1. Search for city coordinates
  for (const [city, loc] of Object.entries(CityCoordinates)) {
    // Exact word boundary matching for cities
    const regex = new RegExp(`\\b${city}\\b`, 'i');
    if (regex.test(normalized)) {
      return applyJitter(loc.latitude, loc.longitude, 2.5);
    }
  }
  
  // 2. Search for country coordinates
  for (const [country, loc] of Object.entries(CountryCoordinates)) {
    const regex = new RegExp(`\\b${country}\\b`, 'i');
    if (regex.test(normalized)) {
      // Larger jitter for countries since they represent a wider area
      return applyJitter(loc.latitude, loc.longitude, 50.0);
    }
  }
  
  return null;
}
