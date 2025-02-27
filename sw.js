/**
 * 网站Service Worker
 * 负责资源缓存和离线访问功能
 */

// 缓存版本号，更新缓存时需要修改
const CACHE_VERSION = 'v1.0.0';

// 缓存名称
const CACHE_NAMES = {
  static: `static-${CACHE_VERSION}`,
  images: `images-${CACHE_VERSION}`,
  pages: `pages-${CACHE_VERSION}`,
  fonts: `fonts-${CACHE_VERSION}`
};

// 需要预缓存的静态资源
const STATIC_CACHE_URLS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/utils.js',
  '/js/main.js',
  '/images/placeholder.svg',
  '/offline.html'
];

// 安装事件 - 预缓存静态资源
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAMES.static)
      .then(cache => {
        console.log('缓存静态资源');
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => {
        // 强制激活，不等待旧的Service Worker终止
        return self.skipWaiting();
      })
  );
});

// 激活事件 - 清理旧缓存
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            // 检查当前缓存是否需要删除
            const isOldCache = !Object.values(CACHE_NAMES).includes(cacheName);
            if (isOldCache) {
              console.log('删除旧缓存:', cacheName);
              return caches.delete(cacheName);
            }
            return null;
          }).filter(promise => promise !== null)
        );
      })
      .then(() => {
        // 立即接管所有客户端
        return self.clients.claim();
      })
  );
});

// 请求拦截 - 实现缓存策略
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  
  // 忽略非GET请求和浏览器扩展请求
  if (request.method !== 'GET' || url.origin !== self.location.origin) {
    return;
  }
  
  // 根据资源类型选择不同的缓存策略
  let cacheStrategy;
  
  // HTML页面 - 网络优先，失败时使用缓存
  if (request.headers.get('Accept').includes('text/html')) {
    cacheStrategy = networkFirstStrategy(request, CACHE_NAMES.pages);
  }
  // 图片资源 - 缓存优先，失败时使用网络
  else if (request.url.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i)) {
    cacheStrategy = cacheFirstStrategy(request, CACHE_NAMES.images);
  }
  // 字体资源 - 缓存优先，失败时使用网络
  else if (request.url.match(/\.(woff|woff2|ttf|eot)$/i)) {
    cacheStrategy = cacheFirstStrategy(request, CACHE_NAMES.fonts);
  }
  // 其他静态资源 - 缓存优先，失败时使用网络
  else if (request.url.match(/\.(js|css)$/i)) {
    cacheStrategy = cacheFirstStrategy(request, CACHE_NAMES.static);
  }
  // 其他资源 - 网络优先
  else {
    cacheStrategy = networkFirstStrategy(request, CACHE_NAMES.static);
  }
  
  event.respondWith(cacheStrategy);
});

/**
 * 网络优先策略
 * 先尝试从网络获取资源，失败时使用缓存
 * @param {Request} request 请求对象
 * @param {string} cacheName 缓存名称
 * @returns {Promise<Response>} 响应对象
 */
function networkFirstStrategy(request, cacheName) {
  return fetch(request)
    .then(response => {
      // 检查响应是否有效
      if (!response || response.status !== 200 || response.type !== 'basic') {
        return response;
      }
      
      // 克隆响应，因为响应流只能使用一次
      const responseToCache = response.clone();
      
      // 更新缓存
      caches.open(cacheName)
        .then(cache => {
          cache.put(request, responseToCache);
        });
      
      return response;
    })
    .catch(() => {
      // 网络请求失败，尝试从缓存获取
      return caches.match(request)
        .then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // 如果是HTML页面请求，返回离线页面
          if (request.headers.get('Accept').includes('text/html')) {
            return caches.match('/offline.html');
          }
          
          // 如果是图片请求，返回占位图
          if (request.url.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i)) {
            return caches.match('/images/placeholder.svg');
          }
          
          // 其他资源无法提供
          return new Response('资源不可用', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/plain'
            })
          });
        });
    });
}

/**
 * 缓存优先策略
 * 先尝试从缓存获取资源，失败时使用网络
 * @param {Request} request 请求对象
 * @param {string} cacheName 缓存名称
 * @returns {Promise<Response>} 响应对象
 */
function cacheFirstStrategy(request, cacheName) {
  return caches.match(request)
    .then(cachedResponse => {
      // 如果在缓存中找到响应，直接返回
      if (cachedResponse) {
        return cachedResponse;
      }
      
      // 缓存中没有找到，尝试从网络获取
      return fetch(request)
        .then(response => {
          // 检查响应是否有效
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // 克隆响应，因为响应流只能使用一次
          const responseToCache = response.clone();
          
          // 更新缓存
          caches.open(cacheName)
            .then(cache => {
              cache.put(request, responseToCache);
            });
          
          return response;
        })
        .catch(error => {
          console.error('获取资源失败:', error);
          
          // 如果是图片请求，返回占位图
          if (request.url.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i)) {
            return caches.match('/images/placeholder.svg');
          }
          
          // 其他资源无法提供
          return new Response('资源不可用', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/plain'
            })
          });
        });
    });
}

// 后台同步事件 - 用于离线操作后的数据同步
self.addEventListener('sync', event => {
  if (event.tag === 'sync-comments') {
    event.waitUntil(syncComments());
  }
});

/**
 * 同步评论数据
 * 将离线时保存的评论数据发送到服务器
 */
function syncComments() {
  return self.clients.matchAll()
    .then(clients => {
      clients.forEach(client => {
        // 通知客户端开始同步
        client.postMessage({
          type: 'SYNC_STARTED',
          tag: 'sync-comments'
        });
      });
      
      // 从IndexedDB获取待同步的评论
      // 这里需要实现IndexedDB操作
      // 简化示例，实际应用需要完整实现
      return Promise.resolve();
    })
    .then(() => {
      // 通知客户端同步完成
      return self.clients.matchAll()
        .then(clients => {
          clients.forEach(client => {
            client.postMessage({
              type: 'SYNC_COMPLETED',
              tag: 'sync-comments'
            });
          });
        });
    })
    .catch(error => {
      console.error('同步评论失败:', error);
      
      // 通知客户端同步失败
      return self.clients.matchAll()
        .then(clients => {
          clients.forEach(client => {
            client.postMessage({
              type: 'SYNC_FAILED',
              tag: 'sync-comments',
              error: error.message
            });
          });
        });
    });
}

// 推送通知事件
self.addEventListener('push', event => {
  if (!event.data) return;
  
  try {
    const data = event.data.json();
    
    const options = {
      body: data.body || '有新内容更新',
      icon: data.icon || '/images/icon-192x192.png',
      badge: data.badge || '/images/badge.png',
      data: {
        url: data.url || '/'
      }
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || '爱学霸网站通知', options)
    );
  } catch (error) {
    console.error('处理推送通知失败:', error);
  }
});

// 通知点击事件
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  const url = event.notification.data.url;
  
  event.waitUntil(
    self.clients.matchAll({ type: 'window' })
      .then(clientList => {
        // 查找已打开的窗口
        for (const client of clientList) {
          if (client.url === url && 'focus' in client) {
            return client.focus();
          }
        }
        
        // 如果没有找到已打开的窗口，则打开新窗口
        if (self.clients.openWindow) {
          return self.clients.openWindow(url);
        }
      })
  );
}); 