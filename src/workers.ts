import { 
  geolocateFromText, 
  applyJitter, 
  CuratedYouTubeCams, 
  CuratedTwitchStreamers, 
  CuratedKickStreamers
} from './geolocation';

export interface Env {
  TWITCH_CLIENT_ID: string;
  TWITCH_CLIENT_SECRET?: string;
  TWITCH_ACCESS_TOKEN: string;
  YOUTUBE_API_KEY: string;
  ASSETS?: {
    fetch: (request: Request) => Promise<Response>;
  };
}

export interface StreamDto {
  title: string;
  description: string;
  link: string;
  thumbnail: string;
  viewerCount: number;
  latitude: number;
  longitude: number;
  uncertaintyKm?: number | null;
  platform?: string | null;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const origin = request.headers.get('Origin') || '*';

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': origin,
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    const url = new URL(request.url);

    // API Routing
    if (url.pathname === '/api/streams') {
      const response = await handleGetStreams(env);
      return addCorsHeaders(response, origin);
    }
    if (url.pathname.startsWith('/api/twitch')) {
      const response = await handleTwitch(request, env);
      return addCorsHeaders(response, origin);
    }
    if (url.pathname.startsWith('/api/youtube')) {
      const response = await handleYouTube(request, env);
      return addCorsHeaders(response, origin);
    }
    if (url.pathname.startsWith('/api/radiobrowser')) {
      const response = await handleRadioBrowser(request);
      return addCorsHeaders(response, origin);
    }
    if (url.pathname.startsWith('/api/kick')) {
      const response = await handleKick(request);
      return addCorsHeaders(response, origin);
    }

    // Option B: Fallback to serving static assets
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response('Not Found', { status: 404 });
  },
};

function addCorsHeaders(response: Response, origin: string): Response {
  const headers = new Headers(response.headers);
  headers.set('Access-Control-Allow-Origin', origin);
  headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

async function getTwitchAccessToken(clientId: string, clientSecret: string): Promise<string | null> {
  try {
    const res = await fetch('https://id.twitch.tv/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`,
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { access_token: string };
    return data.access_token;
  } catch (err) {
    console.error('Error fetching Twitch token:', err);
    return null;
  }
}

async function handleGetStreams(env: Env): Promise<Response> {
  const streams: StreamDto[] = [];
  
  // 1. YouTube Live Cams
  try {
    if (env.YOUTUBE_API_KEY) {
      const videoIds = CuratedYouTubeCams.map(c => c.id).join(',');
      const ytUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,liveStreamingDetails&id=${videoIds}&key=${env.YOUTUBE_API_KEY}`;
      const ytRes = await fetch(ytUrl);
      
      if (ytRes.ok) {
        const ytData = (await ytRes.json()) as any;
        const items = ytData.items || [];
        
        for (const cam of CuratedYouTubeCams) {
          const liveInfo = items.find((item: any) => item.id === cam.id);
          if (liveInfo && liveInfo.snippet?.liveBroadcastContent === 'live') {
            const viewers = parseInt(liveInfo.liveStreamingDetails?.concurrentViewers || '150', 10);
            streams.push({
              title: liveInfo.snippet.title || cam.title,
              description: liveInfo.snippet.description?.slice(0, 150) || cam.description,
              link: cam.link,
              thumbnail: liveInfo.snippet.thumbnails?.medium?.url || cam.thumbnail,
              viewerCount: viewers,
              latitude: cam.latitude,
              longitude: cam.longitude,
              uncertaintyKm: 0.5,
              platform: 'youtube',
            });
          }
        }
      } else {
        throw new Error(`YouTube API returned ${ytRes.status}`);
      }
    } else {
      // Fallback: If no API key, return curated list as active streams
      for (const cam of CuratedYouTubeCams) {
        streams.push({
          title: cam.title,
          description: cam.description,
          link: cam.link,
          thumbnail: cam.thumbnail,
          viewerCount: Math.floor(Math.random() * 350) + 50,
          latitude: cam.latitude,
          longitude: cam.longitude,
          uncertaintyKm: 0.5,
          platform: 'youtube',
        });
      }
    }
  } catch (err) {
    console.error('Failed to get YouTube streams, using fallback:', err);
    for (const cam of CuratedYouTubeCams) {
      streams.push({
        title: cam.title,
        description: cam.description,
        link: cam.link,
        thumbnail: cam.thumbnail,
        viewerCount: 120,
        latitude: cam.latitude,
        longitude: cam.longitude,
        uncertaintyKm: 0.5,
        platform: 'youtube',
      });
    }
  }

  // 2. Twitch IRL Streams
  try {
    const clientId = env.TWITCH_CLIENT_ID;
    let accessToken = env.TWITCH_ACCESS_TOKEN;

    if (clientId && env.TWITCH_CLIENT_SECRET && !accessToken) {
      accessToken = (await getTwitchAccessToken(clientId, env.TWITCH_CLIENT_SECRET)) || '';
    }

    if (clientId && accessToken) {
      const twitchUrl = 'https://api.twitch.tv/helix/streams?game_id=509672&first=100';
      const twitchRes = await fetch(twitchUrl, {
        headers: {
          'Client-ID': clientId,
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (twitchRes.ok) {
        const twitchData = (await twitchRes.json()) as any;
        const liveStreams = twitchData.data || [];

        for (const s of liveStreams) {
          const titleText = `${s.title} ${s.tags ? s.tags.join(' ') : ''}`;
          let location = geolocateFromText(titleText);

          if (!location) {
            const username = s.user_login.toLowerCase();
            const curatedLoc = CuratedTwitchStreamers[username];
            if (curatedLoc) {
              location = applyJitter(curatedLoc.latitude, curatedLoc.longitude, curatedLoc.uncertaintyKm || 10);
            }
          }

          if (!location && s.language) {
            const lang = s.language.toLowerCase();
            if (lang === 'ja') location = applyJitter(35.6595, 139.7006, 150);
            else if (lang === 'ko') location = applyJitter(37.5665, 126.9780, 100);
            else if (lang === 'de') location = applyJitter(51.1657, 10.4515, 200);
            else if (lang === 'fr') location = applyJitter(46.2276, 2.2137, 200);
            else if (lang === 'es') location = applyJitter(40.4637, -3.7492, 200);
            else if (lang === 'it') location = applyJitter(41.8719, 12.5674, 200);
            else if (lang === 'zh') location = applyJitter(25.0330, 121.5654, 80);
            else if (lang === 'th') location = applyJitter(15.8700, 100.9925, 150);
          }

          if (location) {
            streams.push({
              title: s.user_name,
              description: s.title,
              link: `https://twitch.tv/${s.user_login}`,
              thumbnail: s.thumbnail_url.replace('{width}', '320').replace('{height}', '180'),
              viewerCount: s.viewer_count,
              latitude: location.latitude,
              longitude: location.longitude,
              uncertaintyKm: location.uncertaintyKm || 10,
              platform: 'twitch',
            });
          }
        }
      }
    }
  } catch (err) {
    console.error('Failed to fetch Twitch streams:', err);
  }

  // 3. Kick IRL Streams
  try {
    const kickUrl = 'https://kick.com/api/v2/subcategories/travel-outdoors/lives';
    const kickRes = await fetch(kickUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (kickRes.ok) {
      const kickData = (await kickRes.json()) as any;
      const liveStreams = kickData.data || [];

      for (const s of liveStreams) {
        if (!s.slug) continue;
        const titleText = `${s.session?.title || ''}`;
        let location = geolocateFromText(titleText);

        if (!location) {
          const username = s.slug.toLowerCase();
          const curatedLoc = CuratedKickStreamers[username];
          if (curatedLoc) {
            location = applyJitter(curatedLoc.latitude, curatedLoc.longitude, curatedLoc.uncertaintyKm || 20);
          }
        }

        if (location) {
          streams.push({
            title: s.user?.username || s.slug,
            description: s.session?.title || 'Kick Live Stream',
            link: `https://kick.com/${s.slug}`,
            thumbnail: s.session?.thumbnail?.src || 'https://kick.com/favicon.ico',
            viewerCount: s.viewers || 0,
            latitude: location.latitude,
            longitude: location.longitude,
            uncertaintyKm: location.uncertaintyKm || 10,
            platform: 'kick',
          });
        }
      }
    }
  } catch (err) {
    console.error('Failed to fetch Kick streams dynamically:', err);
  }

  return new Response(JSON.stringify(streams), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=60',
    },
  });
}

async function handleTwitch(request: Request, env: Env): Promise<Response> {
  const clientId = env.TWITCH_CLIENT_ID;
  let accessToken = env.TWITCH_ACCESS_TOKEN;

  if (clientId && env.TWITCH_CLIENT_SECRET && !accessToken) {
    accessToken = (await getTwitchAccessToken(clientId, env.TWITCH_CLIENT_SECRET)) || '';
  }

  if (!clientId || !accessToken) {
    return new Response('Twitch API credentials missing', { status: 401 });
  }

  const twitchUrl = new URL(request.url);
  twitchUrl.hostname = 'api.twitch.tv';
  twitchUrl.pathname = twitchUrl.pathname.replace('/api/twitch', '');

  const response = await fetch(twitchUrl.toString(), {
    method: request.method,
    headers: {
      'Client-ID': clientId,
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  return response;
}

async function handleYouTube(request: Request, env: Env): Promise<Response> {
  const apiKey = env.YOUTUBE_API_KEY;
  if (!apiKey) {
    return new Response('YouTube API key missing', { status: 401 });
  }

  const url = new URL(request.url);
  url.hostname = 'www.googleapis.com';
  url.pathname = url.pathname.replace('/api/youtube', '/youtube/v3');
  url.searchParams.set('key', apiKey);

  const response = await fetch(url.toString(), {
    method: request.method,
  });
  return response;
}

async function handleRadioBrowser(request: Request): Promise<Response> {
  const url = new URL(request.url);
  url.hostname = 'de1.api.radio-browser.info';
  url.pathname = url.pathname.replace('/api/radiobrowser', '');

  const response = await fetch(url.toString(), {
    method: request.method,
  });
  return response;
}

async function handleKick(request: Request): Promise<Response> {
  const url = new URL(request.url);
  url.hostname = 'kick.com';
  url.pathname = url.pathname.replace('/api/kick', '/api');

  const response = await fetch(url.toString(), {
    method: request.method,
  });
  return response;
}
