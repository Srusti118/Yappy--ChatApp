const CACHE_NAME = 'yappy-cache-v1'

const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/favicon.svg',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/screenshots/screenshot-desktop.png',
  '/screenshots/screenshot-mobile.png'
]

// 1. Install Event — Pre-caching core stable assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installed (v1)')
  self.skipWaiting()
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Pre-caching static assets')
      return cache.addAll(ASSETS_TO_CACHE)
    })
  )
})

// 2. Activate Event — Cleaning up outdated caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activated (v1)')
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cache) => {
            if (cache !== CACHE_NAME) {
              console.log('[Service Worker] Deleting old cache:', cache)
              return caches.delete(cache)
            }
          })
        )
      })
    ])
  )
})

/**
 * Helper to check if a request is a document navigation request.
 * Excludes API routes and static asset files.
 */
function isDocumentNavigation(request) {
  const acceptHeader = request.headers.get('accept')
  const isHtml = acceptHeader && acceptHeader.includes('text/html')
  const isGet = request.method === 'GET'

  if (!isGet || !isHtml) return false

  const urlObj = new URL(request.url)
  const pathname = urlObj.pathname

  // Exclude backend API routes
  if (pathname.startsWith('/api/')) return false

  // Exclude static assets with file extensions (e.g. .js, .css, .png, .svg)
  const fileExtensionRegex = /\.[a-z0-9]{2,4}$/i
  if (fileExtensionRegex.test(pathname)) return false

  return true
}

// 3. Fetch Event — Intercept and route requests based on Caching Strategies
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') {
    return
  }

  const url = event.request.url

  // Bypass service worker caching for API calls to ensure live data & authentication
  if (url.includes('/api/')) {
    return
  }

  // Cache-First Strategy for Frontend Static Assets (UI shell)
  if (url.startsWith(self.location.origin)) {
    const isNavigation = event.request.mode === 'navigate' || (event.request.headers.get('accept') && event.request.headers.get('accept').includes('text/html'))

    if (isNavigation) {
      event.respondWith(
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache)
            })
          }
          return networkResponse
        }).catch((err) => {
          console.log('[Service Worker] Navigation fetch failed, serving cache fallback:', err)
          return caches.match(event.request, { ignoreSearch: true }).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse
            }
            if (isDocumentNavigation(event.request)) {
              return caches.match('/', { ignoreSearch: true })
            }
            return caches.match('/offline.html', { ignoreSearch: true })
          })
        })
      )
      return
    }

    event.respondWith(
      caches.match(event.request, { ignoreSearch: true }).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse
        }

        return fetch(event.request).then((networkResponse) => {
          // Dynamically cache production JS/CSS assets
          const isAsset = url.includes('/assets/')

          if (networkResponse && networkResponse.status === 200 && isAsset) {
            const responseToCache = networkResponse.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache)
            })
          }
          return networkResponse
        }).catch((error) => {
          console.log('[Service Worker] Static fetch failed, routing fallback for document:', error)
          if (isDocumentNavigation(event.request)) {
            return caches.match('/', { ignoreSearch: true })
          }
          throw error
        })
      })
    )
  }
})

// 4. Push Event — Triggered when a push message is received from the server
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push event received')

  let data = {
    title: 'Yappy',
    body: 'You have a new message!',
    url: '/'
  }

  // Parse payload from server if present
  if (event.data) {
    try {
      data = event.data.json()
    } catch (err) {
      console.error('[Service Worker] Failed to parse push data as JSON', err)
      data.body = event.data.text()
    }
  }

  const options = {
    body: data.body,
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    data: {
      url: data.url || '/'
    },
    vibrate: [100, 50, 100],
    requireInteraction: true
  }

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  )
})

// 5. Notification Click Event — Triggered when user clicks the notification
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification clicked')
  event.notification.close()

  const targetUrl = event.notification.data?.url || '/'

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          const clientUrl = new URL(client.url)
          if (clientUrl.origin === self.location.origin) {
            client.focus()
            return client.navigate(targetUrl)
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow(targetUrl)
        }
      })
  )
})
