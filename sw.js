// NOME DA VERSÃO (MUDE AQUI PARA ATUALIZAR O APP)
const CACHE_NAME = 'quiz-biblico-v1';

// Arquivos que serão salvos no celular do usuário
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './questions.json',
  './manifest.json',
  './img/logo.png',
  './img/icone-antigo.png', // Verifique se o nome é esse mesmo
  './img/icone-novo.png',   // Verifique se o nome é esse mesmo
  './audio/music.mp3',
  './audio/correct.mp3',
  './audio/wrong.mp3'
];

// 1. INSTALAÇÃO (Baixa os arquivos)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Arquivos em cache salvos com sucesso!');
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. ATIVAÇÃO (Limpa versões antigas do cache para atualizar)
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // Apaga caches antigos (Update automático)
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 3. INTERCEPTAÇÃO (Serve arquivos offline ou busca online)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Se tiver no cache, usa o cache. Se não, busca na rede.
        return response || fetch(event.request);
      })
  );
});