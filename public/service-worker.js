const CACHE_NAME = 'cloudinary-image-cache-v1';
const IMAGE_CACHE_URL_PATTERN = /res\.cloudinary\.com|cloudinary\.com\/image\/upload/;

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (
    request.destination === 'image' &&
    IMAGE_CACHE_URL_PATTERN.test(request.url)
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
          return cachedResponse;
        }
        try {
          const response = await fetch(request);
          if (response.status === 200) {
            cache.put(request, response.clone());
          }
          return response;
        } catch (err) {
          // Fallback: return a placeholder image if fetch fails
          return caches.match('/placeholder.svg');
        }
      })
    );
  }
}); 