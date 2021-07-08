'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "7694ce11a5de8e68579c57b9b159ffa1",
"assets/FontManifest.json": "db6eb800af849c07f843268049c241fd",
"assets/fonts/geometric.ttf": "bc6d3c66a14c43efc97c79b68821fb50",
"assets/fonts/MaterialIcons-Regular.otf": "4e6447691c9509f7acdbf8a931a85ca1",
"assets/NOTICES": "f3e3fe20ae8e0f83cc206749da7dbd01",
"assets/packages/font_awesome_flutter/lib/fonts/fa-brands-400.ttf": "3241d1d9c15448a4da96df05f3292ffe",
"assets/packages/font_awesome_flutter/lib/fonts/fa-regular-400.ttf": "eaed33dc9678381a55cb5c13edaf241d",
"assets/packages/font_awesome_flutter/lib/fonts/fa-solid-900.ttf": "ffed6899ceb84c60a1efa51c809a57e4",
"assets/resources/alex.jpg": "4f719ee43bb2bcb60be62c7a440b9d7d",
"assets/resources/app_icon_outline.png": "8f04c662876693926f698f9ae8ca8a87",
"assets/resources/buy_coffee_logo.png": "2e2b1bb76ad6287a794813d5b40bde5b",
"assets/resources/florentina.jpg": "42c207fbb38618331fbf3d8b830091e1",
"assets/resources/mock.png": "3d959c6b706736d1c514addea277cf23",
"assets/resources/screenshots/d1.jpg": "43d2b247f63d9634d65dcacb208ee638",
"assets/resources/screenshots/d2.jpg": "b61ee0be123c8a9810e6d398e00f2dc1",
"assets/resources/screenshots/d3.jpg": "7d75cb51058fd52e7489c0ca849e7563",
"assets/resources/screenshots/d4.jpg": "16f7e233fabe9f7580ed90e290dc4830",
"assets/resources/screenshots/d5.jpg": "be947baeaeeaaf0e53dc9c7459423a5f",
"assets/resources/screenshots/d6.jpg": "122970c7bd1e8910e1c54cd2db5c014d",
"assets/resources/screenshots/d7.jpg": "2110fa66ce240558cbe5765e1e64d633",
"assets/resources/screenshots/d8.jpg": "3074f65d4e49ece459b95f6d79a7adeb",
"assets/resources/screenshots/d9.jpg": "91daef5d3529f2576d3b9943f7a48669",
"assets/resources/screenshots/w1.jpg": "7c4ea1f22d74043f0be8d44ab18f482d",
"assets/resources/screenshots/w10.jpg": "e65b3ccb2885a150d69f5c15a008df8d",
"assets/resources/screenshots/w11.jpg": "89469964e656b4a1155381b3e7444921",
"assets/resources/screenshots/w12.jpg": "152c4ec317c186c9b2fc4332565d1043",
"assets/resources/screenshots/w13.jpg": "2b9cb09ed99ab98ba6e3bcd07e263c36",
"assets/resources/screenshots/w2.jpg": "8a5279dd96ed8c7f5caa973c5e477b7e",
"assets/resources/screenshots/w3.jpg": "f25d620cd311ebed3caedb0bfcc11fe2",
"assets/resources/screenshots/w4.jpg": "d960f93cdffca4749f1f72d4fd23d9be",
"assets/resources/screenshots/w5.jpg": "00f6a8629421e3cba15446e32e316bb7",
"assets/resources/screenshots/w6.jpg": "46c230ee982c4290f0b661e122aec7b4",
"assets/resources/screenshots/w7.jpg": "4d9f5a7d65da60cc786aaadd0ccd364a",
"assets/resources/screenshots/w8.jpg": "3a89e6e7739a791ceab937501138bd1a",
"assets/resources/screenshots/w9.jpg": "dacc47c11674949aa2c55be63eb66a15",
"favicon.ico": "2a895a4d74a1d5c61199a54ed7be0dcc",
"icons/Icon-192.png": "5d2a508257339b5a52bda92be60ae1b4",
"icons/Icon-512.png": "5554eac086d12355cdcf72fb1f0186bd",
"index.html": "469b40bbd04a23513ad0faf197e4720d",
"/": "469b40bbd04a23513ad0faf197e4720d",
"main.dart.js": "3b4cb4b45b2c76dbbf6cde163b14bc70",
"manifest.json": "eeedcc880d7147244607f34554e5e67d",
"version.json": "f733a6f927e399869397eccd75a90e0b"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
