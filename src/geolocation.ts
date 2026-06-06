export interface GeoLocation {
  latitude: number;
  longitude: number;
  uncertaintyKm?: number;
}

// ─── Emoji country-flag → country key ─────────────────────────────────────────
// Checked first so a 🇯🇵 in a title always beats the word "Japan".
export const EmojiFlagToCountry: Record<string, string> = {
  '🇯🇵': 'japan', '🇰🇷': 'south korea', '🇨🇳': 'china', '🇹🇼': 'taiwan',
  '🇹🇭': 'thailand', '🇻🇳': 'vietnam', '🇮🇩': 'indonesia', '🇵🇭': 'philippines',
  '🇲🇾': 'malaysia', '🇸🇬': 'singapore', '🇭🇰': 'hong kong', '🇲🇲': 'myanmar',
  '🇰🇭': 'cambodia', '🇱🇦': 'laos', '🇧🇩': 'bangladesh', '🇮🇳': 'india',
  '🇵🇰': 'pakistan', '🇳🇵': 'nepal', '🇱🇰': 'sri lanka', '🇲🇳': 'mongolia',
  '🇬🇧': 'united kingdom', '🇺🇸': 'usa', '🇨🇦': 'canada', '🇦🇺': 'australia',
  '🇳🇿': 'new zealand', '🇮🇪': 'ireland', '🇫🇷': 'france', '🇩🇪': 'germany',
  '🇮🇹': 'italy', '🇪🇸': 'spain', '🇵🇹': 'portugal', '🇳🇱': 'netherlands',
  '🇧🇪': 'belgium', '🇨🇭': 'switzerland', '🇦🇹': 'austria', '🇸🇪': 'sweden',
  '🇳🇴': 'norway', '🇩🇰': 'denmark', '🇫🇮': 'finland', '🇮🇸': 'iceland',
  '🇵🇱': 'poland', '🇨🇿': 'czech republic', '🇭🇺': 'hungary', '🇷🇴': 'romania',
  '🇧🇬': 'bulgaria', '🇭🇷': 'croatia', '🇷🇸': 'serbia', '🇸🇰': 'slovakia',
  '🇬🇷': 'greece', '🇹🇷': 'turkey', '🇺🇦': 'ukraine', '🇷🇺': 'russia',
  '🇮🇱': 'israel', '🇸🇦': 'saudi arabia', '🇦🇪': 'uae', '🇶🇦': 'qatar',
  '🇯🇴': 'jordan', '🇪🇬': 'egypt', '🇲🇦': 'morocco', '🇿🇦': 'south africa',
  '🇰🇪': 'kenya', '🇳🇬': 'nigeria', '🇹🇿': 'tanzania', '🇲🇽': 'mexico',
  '🇧🇷': 'brazil', '🇦🇷': 'argentina', '🇨🇴': 'colombia', '🇵🇪': 'peru',
  '🇨🇱': 'chile', '🇻🇪': 'venezuela', '🇪🇨': 'ecuador', '🇺🇾': 'uruguay',
  '🇯🇲': 'jamaica', '🇨🇺': 'cuba', '🇵🇷': 'puerto rico',
};

// ─── City coordinates (checked before countries) ─────────────────────────────
export const CityCoordinates: Record<string, GeoLocation> = {
  // Japan
  tokyo:       { latitude: 35.6762, longitude: 139.6503, uncertaintyKm: 15 },
  shibuya:     { latitude: 35.6595, longitude: 139.7006, uncertaintyKm: 3 },
  shinjuku:    { latitude: 35.6938, longitude: 139.7034, uncertaintyKm: 3 },
  akihabara:   { latitude: 35.7022, longitude: 139.7741, uncertaintyKm: 2 },
  asakusa:     { latitude: 35.7147, longitude: 139.7967, uncertaintyKm: 2 },
  harajuku:    { latitude: 35.6702, longitude: 139.7027, uncertaintyKm: 2 },
  ikebukuro:   { latitude: 35.7295, longitude: 139.7109, uncertaintyKm: 3 },
  osaka:       { latitude: 34.6937, longitude: 135.5023, uncertaintyKm: 12 },
  kyoto:       { latitude: 35.0116, longitude: 135.7681, uncertaintyKm: 10 },
  nara:        { latitude: 34.6851, longitude: 135.8050, uncertaintyKm: 8 },
  hiroshima:   { latitude: 34.3853, longitude: 132.4553, uncertaintyKm: 10 },
  fukuoka:     { latitude: 33.5904, longitude: 130.4017, uncertaintyKm: 10 },
  sapporo:     { latitude: 43.0618, longitude: 141.3545, uncertaintyKm: 12 },
  yokohama:    { latitude: 35.4437, longitude: 139.6380, uncertaintyKm: 10 },
  nagoya:      { latitude: 35.1815, longitude: 136.9066, uncertaintyKm: 10 },
  okinawa:     { latitude: 26.2124, longitude: 127.6809, uncertaintyKm: 30 },
  sendai:      { latitude: 38.2688, longitude: 140.8721, uncertaintyKm: 10 },
  kobe:        { latitude: 34.6901, longitude: 135.1956, uncertaintyKm: 8 },

  // South Korea
  seoul:       { latitude: 37.5665, longitude: 126.9780, uncertaintyKm: 15 },
  hongdae:     { latitude: 37.5563, longitude: 126.9238, uncertaintyKm: 2 },
  itaewon:     { latitude: 37.5345, longitude: 126.9940, uncertaintyKm: 2 },
  myeongdong:  { latitude: 37.5636, longitude: 126.9826, uncertaintyKm: 2 },
  busan:       { latitude: 35.1796, longitude: 129.0756, uncertaintyKm: 12 },
  incheon:     { latitude: 37.4563, longitude: 126.7052, uncertaintyKm: 15 },
  daegu:       { latitude: 35.8714, longitude: 128.6014, uncertaintyKm: 10 },
  jeju:        { latitude: 33.4996, longitude: 126.5312, uncertaintyKm: 20 },
  gyeongju:    { latitude: 35.8562, longitude: 129.2247, uncertaintyKm: 8 },

  // China
  beijing:     { latitude: 39.9042, longitude: 116.4074, uncertaintyKm: 30 },
  shanghai:    { latitude: 31.2304, longitude: 121.4737, uncertaintyKm: 25 },
  guangzhou:   { latitude: 23.1291, longitude: 113.2644, uncertaintyKm: 20 },
  shenzhen:    { latitude: 22.5431, longitude: 114.0579, uncertaintyKm: 15 },
  chengdu:     { latitude: 30.5728, longitude: 104.0668, uncertaintyKm: 15 },
  xian:        { latitude: 34.3416, longitude: 108.9398, uncertaintyKm: 15 },

  // Taiwan
  taipei:      { latitude: 25.0330, longitude: 121.5654, uncertaintyKm: 12 },
  ximending:   { latitude: 25.0448, longitude: 121.5055, uncertaintyKm: 2 },
  tainan:      { latitude: 22.9998, longitude: 120.2270, uncertaintyKm: 10 },
  kaohsiung:   { latitude: 22.6273, longitude: 120.3014, uncertaintyKm: 10 },

  // Southeast Asia
  bangkok:      { latitude: 13.7563, longitude: 100.5018, uncertaintyKm: 20 },
  'chiang mai': { latitude: 18.7883, longitude: 98.9853,  uncertaintyKm: 10 },
  phuket:       { latitude: 7.8804,  longitude: 98.3923,  uncertaintyKm: 15 },
  pattaya:      { latitude: 12.9236, longitude: 100.8825, uncertaintyKm: 8 },
  'ho chi minh': { latitude: 10.8231, longitude: 106.6297, uncertaintyKm: 15 },
  saigon:       { latitude: 10.8231, longitude: 106.6297, uncertaintyKm: 15 },
  hanoi:        { latitude: 21.0278, longitude: 105.8342, uncertaintyKm: 12 },
  'da nang':    { latitude: 16.0544, longitude: 108.2022, uncertaintyKm: 8 },
  'hoi an':     { latitude: 15.8800, longitude: 108.3380, uncertaintyKm: 5 },
  singapore:    { latitude: 1.3521,  longitude: 103.8198, uncertaintyKm: 5 },
  'kuala lumpur': { latitude: 3.1390, longitude: 101.6869, uncertaintyKm: 15 },
  kl:           { latitude: 3.1390,  longitude: 101.6869, uncertaintyKm: 15 },
  bali:         { latitude: -8.4095, longitude: 115.1889, uncertaintyKm: 20 },
  ubud:         { latitude: -8.5069, longitude: 115.2625, uncertaintyKm: 5 },
  seminyak:     { latitude: -8.6913, longitude: 115.1598, uncertaintyKm: 3 },
  jakarta:      { latitude: -6.2088, longitude: 106.8456, uncertaintyKm: 25 },
  manila:       { latitude: 14.5995, longitude: 120.9842, uncertaintyKm: 20 },
  cebu:         { latitude: 10.3157, longitude: 123.8854, uncertaintyKm: 10 },
  'phnom penh': { latitude: 11.5564, longitude: 104.9282, uncertaintyKm: 10 },
  'siem reap':  { latitude: 13.3633, longitude: 103.8564, uncertaintyKm: 8 },
  'vientiane':  { latitude: 17.9757, longitude: 102.6331, uncertaintyKm: 8 },
  'yangon':     { latitude: 16.8661, longitude: 96.1951,  uncertaintyKm: 12 },

  // India / South Asia
  mumbai:       { latitude: 19.0760, longitude: 72.8777,  uncertaintyKm: 30 },
  delhi:        { latitude: 28.6139, longitude: 77.2090,  uncertaintyKm: 25 },
  'new delhi':  { latitude: 28.6139, longitude: 77.2090,  uncertaintyKm: 25 },
  bangalore:    { latitude: 12.9716, longitude: 77.5946,  uncertaintyKm: 20 },
  bengaluru:    { latitude: 12.9716, longitude: 77.5946,  uncertaintyKm: 20 },
  kolkata:      { latitude: 22.5726, longitude: 88.3639,  uncertaintyKm: 20 },
  chennai:      { latitude: 13.0827, longitude: 80.2707,  uncertaintyKm: 20 },
  hyderabad:    { latitude: 17.3850, longitude: 78.4867,  uncertaintyKm: 20 },
  goa:          { latitude: 15.2993, longitude: 74.1240,  uncertaintyKm: 20 },
  kathmandu:    { latitude: 27.7172, longitude: 85.3240,  uncertaintyKm: 10 },
  colombo:      { latitude: 6.9271,  longitude: 79.8612,  uncertaintyKm: 10 },

  // Europe
  london:       { latitude: 51.5074, longitude: -0.1278,  uncertaintyKm: 20 },
  paris:        { latitude: 48.8566, longitude: 2.3522,   uncertaintyKm: 12 },
  berlin:       { latitude: 52.5200, longitude: 13.4050,  uncertaintyKm: 15 },
  rome:         { latitude: 41.9028, longitude: 12.4964,  uncertaintyKm: 15 },
  barcelona:    { latitude: 41.3874, longitude: 2.1686,   uncertaintyKm: 10 },
  madrid:       { latitude: 40.4168, longitude: -3.7038,  uncertaintyKm: 15 },
  seville:      { latitude: 37.3891, longitude: -5.9845,  uncertaintyKm: 8 },
  granada:      { latitude: 37.1773, longitude: -3.5986,  uncertaintyKm: 6 },
  lisbon:       { latitude: 38.7223, longitude: -9.1393,  uncertaintyKm: 10 },
  porto:        { latitude: 41.1579, longitude: -8.6291,  uncertaintyKm: 8 },
  amsterdam:    { latitude: 52.3676, longitude: 4.9041,   uncertaintyKm: 10 },
  brussels:     { latitude: 50.8503, longitude: 4.3517,   uncertaintyKm: 10 },
  zurich:       { latitude: 47.3769, longitude: 8.5417,   uncertaintyKm: 8 },
  vienna:       { latitude: 48.2082, longitude: 16.3738,  uncertaintyKm: 12 },
  prague:       { latitude: 50.0755, longitude: 14.4378,  uncertaintyKm: 10 },
  budapest:     { latitude: 47.4979, longitude: 19.0402,  uncertaintyKm: 12 },
  warsaw:       { latitude: 52.2297, longitude: 21.0122,  uncertaintyKm: 15 },
  krakow:       { latitude: 50.0647, longitude: 19.9450,  uncertaintyKm: 8 },
  stockholm:    { latitude: 59.3293, longitude: 18.0686,  uncertaintyKm: 12 },
  oslo:         { latitude: 59.9139, longitude: 10.7522,  uncertaintyKm: 12 },
  copenhagen:   { latitude: 55.6761, longitude: 12.5683,  uncertaintyKm: 10 },
  helsinki:     { latitude: 60.1699, longitude: 24.9384,  uncertaintyKm: 10 },
  reykjavik:    { latitude: 64.1466, longitude: -21.9426, uncertaintyKm: 8 },
  dublin:       { latitude: 53.3498, longitude: -6.2603,  uncertaintyKm: 10 },
  edinburgh:    { latitude: 55.9533, longitude: -3.1883,  uncertaintyKm: 8 },
  athens:       { latitude: 37.9838, longitude: 23.7275,  uncertaintyKm: 15 },
  istanbul:     { latitude: 41.0082, longitude: 28.9784,  uncertaintyKm: 25 },
  venice:       { latitude: 45.4408, longitude: 12.3155,  uncertaintyKm: 5 },
  florence:     { latitude: 43.7696, longitude: 11.2558,  uncertaintyKm: 8 },
  milan:        { latitude: 45.4654, longitude: 9.1859,   uncertaintyKm: 12 },
  naples:       { latitude: 40.8518, longitude: 14.2681,  uncertaintyKm: 10 },
  kyiv:         { latitude: 50.4501, longitude: 30.5234,  uncertaintyKm: 20 },
  moscow:       { latitude: 55.7558, longitude: 37.6173,  uncertaintyKm: 30 },
  'st petersburg': { latitude: 59.9311, longitude: 30.3609, uncertaintyKm: 15 },

  // North America
  'new york':    { latitude: 40.7128, longitude: -74.0060, uncertaintyKm: 25 },
  nyc:           { latitude: 40.7128, longitude: -74.0060, uncertaintyKm: 25 },
  manhattan:     { latitude: 40.7831, longitude: -73.9712, uncertaintyKm: 8 },
  'times square': { latitude: 40.7580, longitude: -73.9855, uncertaintyKm: 1 },
  brooklyn:      { latitude: 40.6782, longitude: -73.9442, uncertaintyKm: 8 },
  'los angeles': { latitude: 34.0522, longitude: -118.2437, uncertaintyKm: 35 },
  la:            { latitude: 34.0522, longitude: -118.2437, uncertaintyKm: 35 },
  hollywood:     { latitude: 34.0928, longitude: -118.3287, uncertaintyKm: 5 },
  'santa monica': { latitude: 34.0194, longitude: -118.4912, uncertaintyKm: 5 },
  'san francisco': { latitude: 37.7749, longitude: -122.4194, uncertaintyKm: 15 },
  sf:            { latitude: 37.7749, longitude: -122.4194, uncertaintyKm: 15 },
  chicago:       { latitude: 41.8781, longitude: -87.6298, uncertaintyKm: 25 },
  miami:         { latitude: 25.7617, longitude: -80.1918, uncertaintyKm: 20 },
  'miami beach': { latitude: 25.7907, longitude: -80.1300, uncertaintyKm: 5 },
  seattle:       { latitude: 47.6062, longitude: -122.3321, uncertaintyKm: 18 },
  boston:        { latitude: 42.3601, longitude: -71.0589, uncertaintyKm: 15 },
  austin:        { latitude: 30.2672, longitude: -97.7431, uncertaintyKm: 15 },
  nashville:     { latitude: 36.1627, longitude: -86.7816, uncertaintyKm: 15 },
  denver:        { latitude: 39.7392, longitude: -104.9903, uncertaintyKm: 15 },
  portland:      { latitude: 45.5051, longitude: -122.6750, uncertaintyKm: 15 },
  'san diego':   { latitude: 32.7157, longitude: -117.1611, uncertaintyKm: 18 },
  phoenix:       { latitude: 33.4484, longitude: -112.0740, uncertaintyKm: 20 },
  'new orleans': { latitude: 29.9511, longitude: -90.0715, uncertaintyKm: 15 },
  'las vegas':   { latitude: 36.1699, longitude: -115.1398, uncertaintyKm: 12 },
  'washington dc': { latitude: 38.9072, longitude: -77.0369, uncertaintyKm: 15 },
  toronto:       { latitude: 43.6532, longitude: -79.3832, uncertaintyKm: 20 },
  vancouver:     { latitude: 49.2827, longitude: -123.1207, uncertaintyKm: 18 },
  montreal:      { latitude: 45.5017, longitude: -73.5673, uncertaintyKm: 18 },
  'mexico city': { latitude: 19.4326, longitude: -99.1332, uncertaintyKm: 35 },
  cancun:        { latitude: 21.1619, longitude: -86.8515, uncertaintyKm: 10 },
  honolulu:      { latitude: 21.3069, longitude: -157.8583, uncertaintyKm: 12 },

  // South America
  'rio de janeiro': { latitude: -22.9068, longitude: -43.1729, uncertaintyKm: 25 },
  rio:              { latitude: -22.9068, longitude: -43.1729, uncertaintyKm: 25 },
  copacabana:       { latitude: -22.9707, longitude: -43.1824, uncertaintyKm: 3 },
  ipanema:          { latitude: -22.9868, longitude: -43.2046, uncertaintyKm: 2 },
  'sao paulo':      { latitude: -23.5505, longitude: -46.6333, uncertaintyKm: 30 },
  'buenos aires':   { latitude: -34.6037, longitude: -58.3816, uncertaintyKm: 25 },
  santiago:         { latitude: -33.4489, longitude: -70.6693, uncertaintyKm: 20 },
  bogota:           { latitude: 4.7110,   longitude: -74.0721, uncertaintyKm: 20 },
  lima:             { latitude: -12.0464, longitude: -77.0428, uncertaintyKm: 20 },
  medellin:         { latitude: 6.2476,   longitude: -75.5658, uncertaintyKm: 12 },
  cartagena:        { latitude: 10.3910,  longitude: -75.4794, uncertaintyKm: 8 },

  // Oceania
  sydney:     { latitude: -33.8688, longitude: 151.2093, uncertaintyKm: 25 },
  melbourne:  { latitude: -37.8136, longitude: 144.9631, uncertaintyKm: 20 },
  brisbane:   { latitude: -27.4705, longitude: 153.0260, uncertaintyKm: 18 },
  perth:      { latitude: -31.9505, longitude: 115.8605, uncertaintyKm: 18 },
  auckland:   { latitude: -36.8485, longitude: 174.7633, uncertaintyKm: 18 },
  wellington: { latitude: -41.2865, longitude: 174.7762, uncertaintyKm: 12 },

  // Middle East / Africa
  dubai:        { latitude: 25.2048, longitude: 55.2708,  uncertaintyKm: 15 },
  'abu dhabi':  { latitude: 24.4539, longitude: 54.3773,  uncertaintyKm: 12 },
  doha:         { latitude: 25.2854, longitude: 51.5310,  uncertaintyKm: 10 },
  riyadh:       { latitude: 24.7136, longitude: 46.6753,  uncertaintyKm: 20 },
  'tel aviv':   { latitude: 32.0853, longitude: 34.7818,  uncertaintyKm: 10 },
  jerusalem:    { latitude: 31.7683, longitude: 35.2137,  uncertaintyKm: 10 },
  cairo:        { latitude: 30.0444, longitude: 31.2357,  uncertaintyKm: 25 },
  marrakech:    { latitude: 31.6295, longitude: -7.9811,  uncertaintyKm: 8 },
  casablanca:   { latitude: 33.5731, longitude: -7.5898,  uncertaintyKm: 10 },
  nairobi:      { latitude: -1.2921, longitude: 36.8219,  uncertaintyKm: 15 },
  'cape town':  { latitude: -33.9249, longitude: 18.4241, uncertaintyKm: 18 },
  johannesburg: { latitude: -26.2041, longitude: 28.0473, uncertaintyKm: 20 },
  zanzibar:     { latitude: -6.1659,  longitude: 39.1994, uncertaintyKm: 10 },
};

// ─── Country coordinates ──────────────────────────────────────────────────────
export const CountryCoordinates: Record<string, GeoLocation> = {
  japan:            { latitude: 36.2048,  longitude: 138.2529,  uncertaintyKm: 400 },
  'south korea':    { latitude: 35.9078,  longitude: 127.7669,  uncertaintyKm: 150 },
  korea:            { latitude: 35.9078,  longitude: 127.7669,  uncertaintyKm: 150 },
  china:            { latitude: 35.8617,  longitude: 104.1954,  uncertaintyKm: 800 },
  taiwan:           { latitude: 23.6978,  longitude: 120.9605,  uncertaintyKm: 100 },
  thailand:         { latitude: 15.8700,  longitude: 100.9925,  uncertaintyKm: 250 },
  vietnam:          { latitude: 14.0583,  longitude: 108.2772,  uncertaintyKm: 300 },
  indonesia:        { latitude: -0.7893,  longitude: 113.9213,  uncertaintyKm: 600 },
  philippines:      { latitude: 12.8797,  longitude: 121.7740,  uncertaintyKm: 400 },
  malaysia:         { latitude: 4.2105,   longitude: 101.9758,  uncertaintyKm: 300 },
  singapore:        { latitude: 1.3521,   longitude: 103.8198,  uncertaintyKm: 5 },
  'hong kong':      { latitude: 22.3193,  longitude: 114.1694,  uncertaintyKm: 15 },
  hk:               { latitude: 22.3193,  longitude: 114.1694,  uncertaintyKm: 15 },
  myanmar:          { latitude: 21.9162,  longitude: 95.9560,   uncertaintyKm: 300 },
  cambodia:         { latitude: 12.5657,  longitude: 104.9910,  uncertaintyKm: 150 },
  india:            { latitude: 20.5937,  longitude: 78.9629,   uncertaintyKm: 800 },
  nepal:            { latitude: 28.3949,  longitude: 84.1240,   uncertaintyKm: 200 },
  'united kingdom': { latitude: 55.3781,  longitude: -3.4360,   uncertaintyKm: 300 },
  uk:               { latitude: 55.3781,  longitude: -3.4360,   uncertaintyKm: 300 },
  england:          { latitude: 52.3555,  longitude: -1.1743,   uncertaintyKm: 150 },
  scotland:         { latitude: 56.4907,  longitude: -4.2026,   uncertaintyKm: 150 },
  ireland:          { latitude: 53.4129,  longitude: -8.2439,   uncertaintyKm: 150 },
  france:           { latitude: 46.2276,  longitude: 2.2137,    uncertaintyKm: 300 },
  germany:          { latitude: 51.1657,  longitude: 10.4515,   uncertaintyKm: 300 },
  italy:            { latitude: 41.8719,  longitude: 12.5674,   uncertaintyKm: 300 },
  spain:            { latitude: 40.4637,  longitude: -3.7492,   uncertaintyKm: 300 },
  portugal:         { latitude: 39.3999,  longitude: -8.2245,   uncertaintyKm: 150 },
  netherlands:      { latitude: 52.1326,  longitude: 5.2913,    uncertaintyKm: 80 },
  holland:          { latitude: 52.1326,  longitude: 5.2913,    uncertaintyKm: 80 },
  belgium:          { latitude: 50.5039,  longitude: 4.4699,    uncertaintyKm: 80 },
  switzerland:      { latitude: 46.8182,  longitude: 8.2275,    uncertaintyKm: 80 },
  austria:          { latitude: 47.5162,  longitude: 14.5501,   uncertaintyKm: 100 },
  sweden:           { latitude: 60.1282,  longitude: 18.6435,   uncertaintyKm: 400 },
  norway:           { latitude: 60.4720,  longitude: 8.4689,    uncertaintyKm: 400 },
  denmark:          { latitude: 56.2639,  longitude: 9.5018,    uncertaintyKm: 100 },
  finland:          { latitude: 61.9241,  longitude: 25.7482,   uncertaintyKm: 300 },
  iceland:          { latitude: 64.9631,  longitude: -19.0208,  uncertaintyKm: 150 },
  greece:           { latitude: 39.0742,  longitude: 21.8243,   uncertaintyKm: 200 },
  turkey:           { latitude: 38.9637,  longitude: 35.2433,   uncertaintyKm: 400 },
  ukraine:          { latitude: 48.3794,  longitude: 31.1656,   uncertaintyKm: 300 },
  russia:           { latitude: 61.5240,  longitude: 105.3188,  uncertaintyKm: 2000 },
  'czech republic': { latitude: 49.8175,  longitude: 15.4730,   uncertaintyKm: 100 },
  poland:           { latitude: 51.9194,  longitude: 19.1451,   uncertaintyKm: 250 },
  hungary:          { latitude: 47.1625,  longitude: 19.5033,   uncertaintyKm: 100 },
  croatia:          { latitude: 45.1000,  longitude: 15.2000,   uncertaintyKm: 150 },
  usa:              { latitude: 37.0902,  longitude: -95.7129,  uncertaintyKm: 1500 },
  america:          { latitude: 37.0902,  longitude: -95.7129,  uncertaintyKm: 1500 },
  'united states':  { latitude: 37.0902,  longitude: -95.7129,  uncertaintyKm: 1500 },
  canada:           { latitude: 56.1304,  longitude: -106.3468, uncertaintyKm: 1500 },
  mexico:           { latitude: 23.6345,  longitude: -102.5528, uncertaintyKm: 600 },
  australia:        { latitude: -25.2744, longitude: 133.7751,  uncertaintyKm: 1200 },
  'new zealand':    { latitude: -40.9006, longitude: 174.8860,  uncertaintyKm: 400 },
  brazil:           { latitude: -14.2350, longitude: -51.9253,  uncertaintyKm: 1000 },
  argentina:        { latitude: -38.4161, longitude: -63.6167,  uncertaintyKm: 600 },
  colombia:         { latitude: 4.5709,   longitude: -74.2973,  uncertaintyKm: 400 },
  peru:             { latitude: -9.1900,  longitude: -75.0152,  uncertaintyKm: 500 },
  chile:            { latitude: -35.6751, longitude: -71.5430,  uncertaintyKm: 600 },
  israel:           { latitude: 31.0461,  longitude: 34.8516,   uncertaintyKm: 80 },
  uae:              { latitude: 23.4241,  longitude: 53.8478,   uncertaintyKm: 100 },
  'saudi arabia':   { latitude: 23.8859,  longitude: 45.0792,   uncertaintyKm: 500 },
  egypt:            { latitude: 26.8206,  longitude: 30.8025,   uncertaintyKm: 400 },
  morocco:          { latitude: 31.7917,  longitude: -7.0926,   uncertaintyKm: 300 },
  'south africa':   { latitude: -30.5595, longitude: 22.9375,   uncertaintyKm: 400 },
  kenya:            { latitude: -0.0236,  longitude: 37.9062,   uncertaintyKm: 300 },
};



// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Small random offset so nearby markers don't stack perfectly. */
export function applyJitter(lat: number, lng: number, rangeKm: number = 2): GeoLocation {
  const R = 6371;
  const maxRad = rangeKm / R;
  const angle = Math.random() * 2 * Math.PI;
  const dist  = Math.random() * maxRad;
  const dLat  = dist * Math.cos(angle);
  const dLng  = (dist * Math.sin(angle)) / Math.cos((lat * Math.PI) / 180);
  return {
    latitude:     lat + (dLat * 180) / Math.PI,
    longitude:    lng + (dLng * 180) / Math.PI,
    uncertaintyKm: rangeKm,
  };
}

/**
 * Scan a stream title/description for location clues.
 * Priority: city text → emoji flag → country text.
 */
export function geolocateFromText(text: string): GeoLocation | null {
  if (!text) return null;

  // ── 1. Try to extract location from common bracket / separator formats ──────
  // Handles: "[Tokyo]", "【Osaka】", "(Seoul)", "📍 Bangkok", "in Kyoto", "@ Paris"
  const extracted = extractLocationHint(text);
  if (extracted) {
    const result = matchCity(extracted) || matchCountry(extracted);
    if (result) return result;
  }

  // ── 2. City name anywhere in the text ─────────────────────────────────────
  const cityMatch = matchCity(text);
  if (cityMatch) return cityMatch;

  // ── 3. Emoji country flag ─────────────────────────────────────────────────
  for (const [emoji, countryKey] of Object.entries(EmojiFlagToCountry)) {
    if (text.includes(emoji)) {
      // If the title also contains a city from that country, the city match
      // above already handled it; here we fall back to country-level.
      const loc = CountryCoordinates[countryKey];
      if (loc) return applyJitter(loc.latitude, loc.longitude, loc.uncertaintyKm || 200);
    }
  }

  // ── 4. Country name anywhere in the text ─────────────────────────────────
  return matchCountry(text);
}

// ─── Private helpers ──────────────────────────────────────────────────────────

function matchCity(text: string): GeoLocation | null {
  const t = text.toLowerCase();
  for (const [city, loc] of Object.entries(CityCoordinates)) {
    // Word-boundary match (handles multi-word cities too)
    const re = new RegExp(`(?<![\\w])${escapeRe(city)}(?![\\w])`, 'i');
    if (re.test(t)) {
      return applyJitter(loc.latitude, loc.longitude, 2.5);
    }
  }
  return null;
}

function matchCountry(text: string): GeoLocation | null {
  const t = text.toLowerCase();
  for (const [country, loc] of Object.entries(CountryCoordinates)) {
    const re = new RegExp(`(?<![\\w])${escapeRe(country)}(?![\\w])`, 'i');
    if (re.test(t)) {
      return applyJitter(loc.latitude, loc.longitude, loc.uncertaintyKm || 300);
    }
  }
  return null;
}

/** Pull out a hint from common title patterns. */
function extractLocationHint(text: string): string | null {
  // 📍 or 🗺️ followed by a word
  const pinMatch = text.match(/(?:📍|🗺️)\s*([A-Za-z][A-Za-z\s,'-]{1,40})/u);
  if (pinMatch) return pinMatch[1];

  // Brackets: [Tokyo], 【Seoul】, (Osaka)
  const bracketMatch = text.match(/[\[【(]([A-Za-z][A-Za-z\s,'-]{1,30})[\]】)]/u);
  if (bracketMatch) return bracketMatch[1];

  // "in Tokyo", "in Seoul", "@ Bangkok"
  const inMatch = text.match(/\b(?:in|at|@)\s+([A-Z][A-Za-z\s,'-]{1,30})/u);
  if (inMatch) return inMatch[1];

  // " | Tokyo", " - Seoul" after pipe or dash
  const sepMatch = text.match(/[|–-]\s*([A-Z][A-Za-z\s,'-]{1,30})(?:\s|$)/u);
  if (sepMatch) return sepMatch[1];

  return null;
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
