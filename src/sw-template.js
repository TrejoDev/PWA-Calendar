importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js'
  );

workbox.loadModule('workbox-background-sync')
workbox.precaching.precacheAndRoute( self.__WB_MANIFEST );

const { registerRoute } = workbox.routing;
const { CacheFirst, NetworkFirst, NetworkOnly } = workbox.strategies;
const { BackgroundSyncPlugin } = workbox.backgroundSync;

const cacheNetworkFirts = [
  '/api/auth/renew',
  '/api/events'
]

registerRoute(
  ({request, url}) => {

    if( cacheNetworkFirts.includes( url.pathname ) ) return true;

    return false
  },
  new NetworkFirst()
);
// Referencia
// registerRoute(
//   new RegExp('http://localhost:4000/api/events'),
//   new NetworkFirst()
// );

const cacheFirstNetwork = [
  'https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
]

registerRoute(
  ({request, url}) => {

    if( cacheFirstNetwork.includes( url.href ) ) return true;

    return false
  },
  new CacheFirst()
);


//Posteos offline

const bgSyncPlugin = new BackgroundSyncPlugin('posteos-offline', {
  maxRetentionTime: 24 * 60, // Retry for max of 24 Hours (specified in minutes)
});

registerRoute(
  new RegExp('http://localhost:4000/api/events'),
  new NetworkOnly({
    plugins: [bgSyncPlugin],
  }),
  'POST'
)

// Dynamic path for PUT requests
registerRoute(
  new RegExp('http://localhost:4000/api/events/(\\d+)'), // Assuming the dynamic part is a number
  new NetworkOnly({
    plugins: [bgSyncPlugin],
  }),
  'PUT'
);

// Dynamic path for DELETE requests
registerRoute(
  new RegExp('http://localhost:4000/api/events/(\\d+)'), // Assuming the dynamic part is a number
  new NetworkOnly({
    plugins: [bgSyncPlugin],
  }),
  'DELETE'
);






    
