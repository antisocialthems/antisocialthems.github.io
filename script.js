// script.js - Основной файл JavaScript для Antisocial Issues

// Защита от копирования и инспектирования кода
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    showNotification('Копирование контента запрещено', 'error');
});

document.addEventListener('keydown', function(e) {
    // Блокировка F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
    if (
        e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && e.key === 'I') || 
        (e.ctrlKey && e.shiftKey && e.key === 'J') || 
        (e.ctrlKey && e.key === 'U') ||
        (e.ctrlKey && e.key === 'S')
    ) {
        e.preventDefault();
        showNotification('Действие заблокировано в целях безопасности', 'error');
        return false;
    }
});

// Запрет выделения текста
document.addEventListener('selectstart', function(e) {
    e.preventDefault();
});

// Бургер-меню
const burgerMenu = document.getElementById('burgerMenu');
const mobileMenu = document.getElementById('mobileMenu');
const closeMenu = document.getElementById('closeMenu');

if (burgerMenu) {
    burgerMenu.addEventListener('click', function() {
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
}

if (closeMenu) {
    closeMenu.addEventListener('click', function() {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
}

// Закрытие мобильного меню при клике на ссылку
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
mobileNavLinks.forEach(link => {
    link.addEventListener('click', function() {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
});

// Переключение языка в футере
const footerLanguageSelect = document.getElementById('footerLanguageSelect');
if (footerLanguageSelect) {
    footerLanguageSelect.addEventListener('change', function() {
        window.location.href = this.value;
    });
}

// Кнопка "Поделиться сайтом"
const shareButton = document.getElementById('shareButton');
const socialSharing = document.getElementById('socialSharing');

if (shareButton) {
    shareButton.addEventListener('click', function() {
        socialSharing.style.display = socialSharing.style.display === 'flex' ? 'none' : 'flex';
        
        if (socialSharing.style.display === 'flex') {
            this.textContent = 'Скрыть опции';
        } else {
            this.textContent = 'Поделиться сайтом';
        }
    });
}

// Функции для кнопок социальных сетей
document.querySelectorAll('.social-button').forEach(button => {
    button.addEventListener('click', function() {
        const platform = this.classList[1];
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(document.title);
        let shareUrl;
        
        switch(platform) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
                break;
            case 'vk':
                shareUrl = `https://vk.com/share.php?url=${url}&title=${title}`;
                break;
            case 'whatsapp':
                shareUrl = `https://wa.me/?text=${title}%20${url}`;
                break;
        }
        
        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
            showNotification('Спасибо за распространение информации!', 'success');
        }
    });
});

// Плавная прокрутка к якорям
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Система уведомлений
function showNotification(message, type = 'info') {
    // Удаляем предыдущее уведомление, если есть
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Создаем новое уведомление
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Стили для уведомления
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: bold;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    if (type === 'error') {
        notification.style.backgroundColor = '#e74c3c';
    } else if (type === 'success') {
        notification.style.backgroundColor = '#2ecc71';
    } else {
        notification.style.backgroundColor = '#3498db';
    }
    
    document.body.appendChild(notification);
    
    // Автоматическое скрытие через 3 секунды
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
    
    // Добавляем анимации
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    
    document.head.appendChild(style);
}

// Загрузка статистики (имитация)
function loadStatistics() {
    // В реальном проекте здесь был бы AJAX-запрос к API
    const stats = [
        { id: 'smoking-deaths', value: '7,000,000' },
        { id: 'alcohol-deaths', value: '3,000,000' },
        { id: 'drug-deaths', value: '500,000' }
    ];
    
    stats.forEach(stat => {
        const element = document.getElementById(stat.id);
        if (element) {
            // Анимация счетчика
            animateCounter(element, 0, parseInt(stat.value.replace(/,/g, '')), 2000);
        }
    });
}

// Анимация счетчика
function animateCounter(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value.toLocaleString();
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Темная тема (по предпочтениям системы)
function initTheme() {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    if (prefersDarkScheme.matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    
    prefersDarkScheme.addEventListener('change', e => {
        if (e.matches) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
    });
}

// Анимация появления элементов при скролле
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    // Наблюдаем за всеми секциями
    document.querySelectorAll('.topic-section').forEach(section => {
        observer.observe(section);
    });
}

// Определение языка браузера и перенаправление (опционально)
function detectLanguage() {
    const userLang = navigator.language || navigator.userLanguage;
    const langCode = userLang.split('-')[0];
    const currentPath = window.location.pathname;
    
    // Если пользователь на главной русской странице и его язык не русский
    if (currentPath === '/' || currentPath === '/index.html') {
        const languageMap = {
            'en': '/en/index.html',
            'zh': '/zh/index.html',
            'ko': '/kr/index.html',
            'ja': '/ja/index.html',
            'ar': '/ar/index.html',
            'fa': '/fa/index.html',
            'ur': '/ur/index.html',
            'es': '/es/index.html',
            'pt': '/pt/index.html',
            'fr': '/fr/index.html',
            'it': '/it/index.html',
            'de': '/de/index.html',
            'nl': '/nl/index.html',
            'pl': '/pl/index.html',
            'hi': '/hi/index.html'
        };
        
        if (languageMap[langCode] && langCode !== 'ru') {
            // Можно предложить перейти на язык пользователя
            // window.location.href = languageMap[langCode];
        }
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Защита от копирования
    document.body.classList.add('no-select', 'no-context');
    
    // Инициализация функций
    initTheme();
    initScrollAnimations();
    detectLanguage();
    
    // Показать приветственное сообщение
    setTimeout(() => {
        showNotification('Добро пожаловать на Antisocial Issues! Здесь только правда.', 'info');
    }, 1000);
    
    // Статистика посещений (имитация)
    console.log('Antisocial Issues - статистика защищена Yandex.Metrika');
    
    // Защита от iframe встраивания
    if (window.location !== window.parent.location) {
        window.top.location = window.location;
    }
});

// Дополнительная защита от DevTools
(function() {
    const devtools = {
        isOpen: false,
        orientation: undefined
    };
    
    const threshold = 160;
    
    const emitEvent = (isOpen, orientation) => {
        if (isOpen && !devtools.isOpen) {
            showNotification('Инструменты разработчика заблокированы', 'error');
            window.location.reload();
        }
    };
    
    setInterval(() => {
        const widthThreshold = window.outerWidth - window.innerWidth > threshold;
        const heightThreshold = window.outerHeight - window.innerHeight > threshold;
        const orientation = widthThreshold ? 'vertical' : 'horizontal';
        
        if (!(heightThreshold && widthThreshold) &&
            ((window.Firebug && window.Firebug.chrome && window.Firebug.chrome.isInitialized) || 
             widthThreshold || 
             heightThreshold)) {
            emitEvent(true, orientation);
        } else {
            emitEvent(false, undefined);
        }
    }, 500);
})();