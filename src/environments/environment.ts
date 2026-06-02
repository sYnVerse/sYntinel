export const environment = {
  production: false,

  /**
   * `/api/outages` — dev: proxied to Wrangler dev (`proxy.conf.json`); prod: same path on lucent.earth.
   */
  outagesUrl: '/api/outages',
};
