export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': 'https://lucent.christran.io',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    const url = new URL(request.url);

    if (url.pathname.startsWith('/api/twitch')) {
      return handleTwitch(request, env);
    }
    if (url.pathname.startsWith('/api/youtube')) {
      return handleYouTube(request, env);
    }
    if (url.pathname.startsWith('/api/radiobrowser')) {
      return handleRadioBrowser(request, env);
    }
    if (url.pathname.startsWith('/api/kick')) {
      return handleKick(request, env);
    }

    return new Response('Not Found', { status: 404 });
  },
};

async function handleTwitch(request: Request, env: Env) {
  const clientId = env.TWITCH_CLIENT_ID;
  const accessToken = env.TWITCH_ACCESS_TOKEN;

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

  return addCorsHeaders(response, 'https://lucent.christran.io');
}

async function handleYouTube(request: Request, env: Env) {
  const apiKey = env.YOUTUBE_API_KEY;
  const url = new URL(request.url);
  url.hostname = 'www.googleapis.com';
  url.pathname = url.pathname.replace('/api/youtube', '/youtube/v3');
  url.searchParams.set('key', apiKey);

  const response = await fetch(url.toString());
  return addCorsHeaders(response, 'https://lucent.christran.io');
}

async function handleRadioBrowser(request: Request, env: Env) {
  const url = new URL(request.url);
  url.hostname = 'de1.api.radio-browser.info';
  url.pathname = url.pathname.replace('/api/radiobrowser', '');

  const response = await fetch(url.toString());
  return addCorsHeaders(response, 'https://lucent.christran.io');
}

async function handleKick(request: Request, env: Env) {
  const url = new URL(request.url);
  url.hostname = 'kick.com';
  url.pathname = url.pathname.replace('/api/kick', '/api');

  const response = await fetch(url.toString());
  return addCorsHeaders(response, 'https://lucent.christran.io');
}

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

interface Env {
  TWITCH_CLIENT_ID: string;
  TWITCH_ACCESS_TOKEN: string;
  YOUTUBE_API_KEY: string;
}
