// Service Worker版本号，每次更新时需要修改
const CACHE_VERSION = 'v1.0.0';

// 缓存名称
const CACHE_NAME = `bookai-cache-${CACHE_VERSION}`;

// 需要缓存的资源列表
const CACHE_URLS = [
  '/',
  '/index.html',
  '/search.html',
  '/css/style.css',
  '/js/main.js',
  '/manifest.json',
  '/images/chatgpt.svg',
  '/images/deepseek.svg',
  '/images/deepseek-tips.svg',
  '/images/deepseek-money.svg',
  '/images/deepseek-alt.svg',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-solid-900.woff2',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-brands-400.woff2'
];

// 预缓存资源
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: 预缓存资源');
        return cache.addAll(CACHE_URLS);
      })
      .then(() => {
        // 强制激活，不等待旧的Service Worker终止
        return self.skipWaiting();
      })
  );
});

// 清理旧版本缓存
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName.startsWith('bookai-cache-') && cacheName !== CACHE_NAME;
        }).map(cacheName => {
          console.log('Service Worker: 清理旧缓存 ' + cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      // 立即接管所有客户端
      return self.clients.claim();
    })
  );
});

// 缓存优先策略，如果缓存中没有则从网络获取并缓存
self.addEventListener('fetch', event => {
  // 跳过不支持缓存的请求
  if (
    !event.request.url.startsWith('http') || 
    event.request.method !== 'GET' ||
    event.request.url.includes('/admin/') ||
    event.request.url.includes('/api/')
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // 如果在缓存中找到响应，则返回缓存的版本
        if (cachedResponse) {
          // 后台更新缓存
          updateCache(event.request);
          return cachedResponse;
        }

        // 如果缓存中没有，则从网络获取
        return fetchAndCache(event.request);
      })
      .catch(() => {
        // 如果网络和缓存都失败，返回离线页面
        if (event.request.headers.get('Accept').includes('text/html')) {
          return caches.match('/offline.html');
        }
        
        // 对于其他资源，返回一个简单的错误响应
        return new Response('网络连接错误，无法加载资源。', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: new Headers({
            'Content-Type': 'text/plain'
          })
        });
      })
  );
});

// 从网络获取资源并更新缓存
function fetchAndCache(request) {
  return fetch(request)
    .then(response => {
      // 检查是否是有效的响应
      if (!response || response.status !== 200 || response.type !== 'basic') {
        return response;
      }

      // 克隆响应，因为响应流只能使用一次
      const responseToCache = response.clone();

      // 将响应添加到缓存
      caches.open(CACHE_NAME)
        .then(cache => {
          cache.put(request, responseToCache);
        });

      return response;
    });
}

// 后台更新缓存
function updateCache(request) {
  fetch(request)
    .then(response => {
      // 检查是否是有效的响应
      if (!response || response.status !== 200 || response.type !== 'basic') {
        return;
      }

      // 更新缓存
      caches.open(CACHE_NAME)
        .then(cache => {
          cache.put(request, response);
        });
    })
    .catch(() => {
      // 忽略更新缓存时的错误
    });
}

// 后台同步
self.addEventListener('sync', event => {
  if (event.tag === 'sync-comments') {
    event.waitUntil(syncComments());
  } else if (event.tag === 'sync-ratings') {
    event.waitUntil(syncRatings());
  }
});

// 同步评论
function syncComments() {
  return getDataFromIndexedDB('pending-comments')
    .then(comments => {
      return Promise.all(comments.map(comment => {
        return fetch('/api/comments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(comment)
        })
        .then(response => {
          if (response.ok) {
            // 成功提交后从IndexedDB中删除
            return removeFromIndexedDB('pending-comments', comment.id);
          }
        });
      }));
    });
}

// 同步评分
function syncRatings() {
  return getDataFromIndexedDB('pending-ratings')
    .then(ratings => {
      return Promise.all(ratings.map(rating => {
        return fetch('/api/ratings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(rating)
        })
        .then(response => {
          if (response.ok) {
            // 成功提交后从IndexedDB中删除
            return removeFromIndexedDB('pending-ratings', rating.id);
          }
        });
      }));
    });
}

// 从IndexedDB获取数据
function getDataFromIndexedDB(storeName) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('bookai-offline-db', 1);
    
    request.onerror = event => {
      reject('无法打开数据库');
    };
    
    request.onsuccess = event => {
      const db = event.target.result;
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const getAllRequest = store.getAll();
      
      getAllRequest.onsuccess = () => {
        resolve(getAllRequest.result);
      };
      
      getAllRequest.onerror = () => {
        reject('无法获取数据');
      };
    };
    
    request.onupgradeneeded = event => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('pending-comments')) {
        db.createObjectStore('pending-comments', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('pending-ratings')) {
        db.createObjectStore('pending-ratings', { keyPath: 'id' });
      }
    };
  });
}

// 从IndexedDB删除数据
function removeFromIndexedDB(storeName, id) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('bookai-offline-db', 1);
    
    request.onerror = event => {
      reject('无法打开数据库');
    };
    
    request.onsuccess = event => {
      const db = event.target.result;
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const deleteRequest = store.delete(id);
      
      deleteRequest.onsuccess = () => {
        resolve();
      };
      
      deleteRequest.onerror = () => {
        reject('无法删除数据');
      };
    };
  });
}

// 推送通知
self.addEventListener('push', event => {
  if (!event.data) return;
  
  const data = event.data.json();
  
  const options = {
    body: data.body,
    icon: '/images/icons/icon-192x192.png',
    badge: '/images/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url
    },
    actions: [
      {
        action: 'view',
        title: '查看'
      },
      {
        action: 'close',
        title: '关闭'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// 点击通知
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action === 'close') return;
  
  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then(clientList => {
        const url = event.notification.data.url;
        
        // 如果已经有打开的窗口，则导航到URL
        for (const client of clientList) {
          if (client.url === url && 'focus' in client) {
            return client.focus();
          }
        }
        
        // 否则打开新窗口
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
}); 