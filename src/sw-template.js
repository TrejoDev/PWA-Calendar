importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js'
  );

workbox.precaching.precacheAndRoute( self.__WB_MANIFEST );

const { registerRoute } = workbox.routing;
const { CacheFirst } = workbox.strategies;

registerRoute(
  new RegExp('https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css'),
  new CacheFirst()
)

registerRoute(
  new RegExp('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'),
  new CacheFirst()
)

// registerRoute(
//   new RegExp('https://api.example.com/data'),
//   new NetworkFirst()
// );

// registerRoute(
//   new RegExp('https://api.example.com/data'),
//   new NetworkFirst()
// );
