// Service Worker для Antisocial Issues
const CACHE_NAME = 'antisocial-issues-v2.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/rtl.css',
  '/manifest.json',
  '/favicon/favicon.svg',
  '/favicon/favicon.ico',
  '/favicon/favicon.png',
  
  // Основные языковые версии
  '/en/index.html',
  '/zh/index.html',
  '/kr/index.html',
  '/ja/index.html',
  '/ar/index.html',
  '/fa/index.html',
  '/ur/index.html',
  '/es/index.html',
  '/pt/index.html',
  '/fr/index.html',
  '/it/index.html',
  '/de/index.html',
  '/nl/index.html',
  '/pl/index.html',
  '/hi/index.html',
  
  // Политики конфиденциальности и условия
  '/privacy-ru.html',
  '/terms-ru.html',
  '/privacy-en.html',
  '/terms-en.html',
  '/privacy-zh.html',
  '/terms-zh.html',
  '/privacy-kr.html',
  '/terms-kr.html',
  '/privacy-ja.html',
  '/terms-ja.html',
  '/privacy-ar.html',
  '/terms-ar.html',
  '/privacy-fa.html',
  '/terms-fa.html',
  '/privacy-ur.html',
  '/terms-ur.html',
  '/privacy-es.html',
  '/terms-es.html',
  '/privacy-pt.html',
  '/terms-pt.html',
  '/privacy-fr.html',
  '/terms-fr.html',
  '/privacy-it.html',
  '/terms-it.html',
  '/privacy-de.html',
  '/terms-de.html',
  '/privacy-nl.html',
  '/terms-nl.html',
  '/privacy-pl.html',
  '/terms-pl.html',
  '/privacy-hi.html',
  '/terms-hi.html'
];

// Установка Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Активация и очистка старых кешей
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Стратегия кеширования: Network First, Fallback to Cache
self.addEventListener('fetch', event => {
  // Пропускаем аналитику и не-GET запросы
  if (event.request.method !== 'GET' || 
      event.request.url.includes('yandex.ru') ||
      event.request.url.includes('mc.yandex')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Клонируем ответ для кеширования
        const responseClone = response.clone();
        
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        
        return response;
      })
      .catch(() => {
        return caches.match(event.request)
          .then(cachedResponse => {
            if (cachedResponse) {
              return cachedResponse;
            }
            
            // Fallback для навигационных запросов
            if (event.request.mode === 'navigate') {
              return caches.match('/index.html');
            }
            
            return new Response('Offline', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/html'
              })
            });
          });
      })
  );
});

// Периодическая синхронизация (Background Sync)
self.addEventListener('sync', event => {
  if (event.tag === 'sync-content') {
    event.waitUntil(syncContent());
  }
});

async function syncContent() {
  try {
    const response = await fetch('/api/content-updates');
    const data = await response.json();
    
    // Обновляем кеш новым контентом
    const cache = await caches.open(CACHE_NAME);
    await cache.put('/index.html', new Response(data.html));
    
    // Уведомление клиентов об обновлении
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'CONTENT_UPDATED',
        timestamp: Date.now()
      });
    });
  } catch (error) {
    console.error('Sync failed:', error);
  }
}

// Push Notifications
self.addEventListener('push', event => {
  if (!event.data) return;
  
  const data = event.data.json();
  
  const options = {
    body: data.body || 'New update from Antisocial Issues',
    icon: '/favicon/favicon-192x192.png',
    badge: '/favicon/favicon-72x72.png',
    tag: data.tag || 'general',
    renotify: true,
    requireInteraction: data.requireInteraction || false,
    data: {
      url: data.url || '/'
    },
    actions: data.actions || [
      {
        action: 'open',
        title: 'Open'
      },
      {
        action: 'close',
        title: 'Close'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'Antisocial Issues', options)
  );
});

// Обработка кликов по уведомлениям
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action === 'close') {
    return;
  }
  
  const urlToOpen = event.notification.data.url || '/';
  
  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then(clientList => {
      // Проверяем, есть ли уже открытая вкладка
      for (const client of clientList) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Открываем новую вкладку
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Background периодические задачи
self.addEventListener('periodicsync', event => {
  if (event.tag === 'update-content') {
    event.waitUntil(updateContentPeriodically());
  }
});

async function updateContentPeriodically() {
  // Фоновая задача для периодического обновления контента
  console.log('Periodic background sync triggered');
}

// Сообщения от клиентов
self.addEventListener('message', event => {
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data.type === 'GET_CACHE_INFO') {
    event.ports[0].postMessage({
      cacheName: CACHE_NAME,
      urlsCached: urlsToCache.length
    });
  }
});