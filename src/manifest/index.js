import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lire package.json
const pkg = JSON.parse(readFileSync(path.join(__dirname, '../../package.json')));

// CSP est géré différemment dans V3
const developmentCSP = {
  extension_pages: "script-src 'self' 'wasm-unsafe-eval'; object-src 'self'",
};

const productionCSP = {
  extension_pages: "script-src 'self'; object-src 'self'",
};

const manifestInput = {
  manifest_version: 3,
  name: '__MSG_extensionName__',
  version: pkg.version,
  default_locale: 'fr',

  // Web Accessible Resources nécessite une structure différente en V3
  web_accessible_resources: [
    {
      resources: ['icons/*', 'images/*'],
      matches: [
        '*://*.amazon.ca/*'
      ],
    },
  ],

  icons: {
    32: 'icons/favicon-48.png',
    48: 'icons/favicon-48.png',
    96: 'icons/favicon-96.png',
    128: 'icons/favicon-128.png',
  },

  description: '__MSG_extensionDescription__',
  homepage_url: 'https://github.com/bolet777/MaZoneLocale',
  short_name: 'mazonelocale',

  // Permissions séparées en V3
  permissions: ['storage', 'scripting'],

  // Host permissions doivent être déclarées séparément
  host_permissions: [
    '*://*.amazon.ca/*'
  ],

  // Content Security Policy V3
  content_security_policy: process.env.NODE_ENV === 'development' ? developmentCSP : productionCSP,

  // Action remplace browser_action en V3
  action: {
    default_title: 'MaZoneLocale',
    default_icon: {
      32: 'icons/favicon-32.png',
      48: 'icons/favicon-48.png',
      96: 'icons/favicon-96.png',
      128: 'icons/favicon-128.png',
    },
  },

  // Content scripts restent similaires
  content_scripts: [
    {
      matches: [
        '*://*.amazon.ca/*'
      ],
      js: ['content_script.js'],
      css: ['content_script.css'],
      run_at: 'document_start',
      all_frames: false,
    },
  ],

  // Déclaration conditionnelle des propriétés spécifiques aux navigateurs
  ...(process.env.TARGET === 'firefox' && {
    browser_specific_settings: {
      gecko: {
        id: 'ccosenza.dlab@gmail.com',
      },
    },
  }),

  ...(process.env.TARGET === 'chrome' && {
    minimum_chrome_version: '88',
  }),

  ...(process.env.TARGET === 'opera' && {
    minimum_opera_version: '74',
    developer: {
      name: 'bolet',
    },
  }),
};

export default manifestInput;