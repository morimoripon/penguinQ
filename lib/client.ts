import { createClient } from 'microcms-js-sdk'; //ES6

if (!process.env.MICROCMS_SERVICE_DOMAIN) {
  throw new Error('MICROCMS_DOMAINが設定されていません')
}

if (!process.env.MICROCMS_API_KEY) {
  throw new Error('MICROCMS_API_KEYが設定されていません')
}

const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN, // YOUR_DOMAIN is the XXXX part of XXXX.microcms.io
  apiKey: process.env.MICROCMS_API_KEY,
});

export default client;