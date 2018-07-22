// Files to cache
var cacheName = 'superForm';
var appShellFiles = [
  'css/jq.ui.css/',
  'css/main.css/',
  'css/plugin.css/',
  'js/jq.js',
  'js/jq.styleform.js',
  'js/jq.ui.js',
  'js/jq.validate.js',
  'js/additional+methods.js',
  'index.html',
  'gfx/logo.png'
];

// Installing Service Worker
self.addEventListener('install', function(e) {
  console.log('[Service Worker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[Service Worker] Caching all: app shell and content');
      return cache.addAll(appShellFiles);
    })
  );
});

// Fetching content using Service Worker
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(r) {
      console.log('[Service Worker] Fetching resource: '+e.request.url);
      return r || fetch(e.request).then(function(response) {
        return caches.open(cacheName).then(function(cache) {
          console.log('[Service Worker] Caching new resource: '+e.request.url);
          cache.put(e.request, response.clone());
          return response;
        });
      });
    })
  );
});