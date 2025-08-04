// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeVideoBackground();
    initializeDemoAnimations();
    initializeScrollEffects();
    initializeVideoModal();
    initializeMobileMenu();
});

// 导航栏滚动效果
function initializeNavigation() {
    const nav = document.querySelector('.top-navigation');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        if (scrolled > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // 平滑滚动到锚点
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 70; // 减去导航栏高度
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 视频背景初始化（在2.5秒显示文字，播放完成后停留在最后一帧作为背景）
function initializeVideoBackground() {
    const video = document.querySelector('.bg_video video');
    const mainUI = document.querySelector('.main-ui');
    
    if (video && mainUI) {
        // 监听视频时间更新，在2.5秒显示文字
        video.addEventListener('timeupdate', () => {
            if (video.currentTime >= 2.5 && mainUI.style.opacity === '0') {
                mainUI.style.opacity = '1';
            }
        });
        
        // 视频播放结束后的处理
        video.addEventListener('ended', () => {
            // 停留在最后一帧
            video.currentTime = video.duration;
            video.pause(); // 确保视频暂停在最后一帧
            
            // 确保文字内容已显示
            if (mainUI.style.opacity === '0') {
                mainUI.style.opacity = '1';
            }
        });
        
        // 确保视频可以自动播放
        video.play().catch(error => {
            console.log('视频自动播放失败:', error);
            // 如果视频播放失败，直接显示文字内容
            setTimeout(() => {
                mainUI.style.opacity = '1';
            }, 1000);
            showVideoPlayButton();
        });

        // 视频加载完成后的处理
        video.addEventListener('loadeddata', () => {
            video.style.opacity = '1';
        });

        // 视频播放错误处理
        video.addEventListener('error', (e) => {
            console.log('视频加载错误:', e);
            // 视频出错时直接显示文字内容
            mainUI.style.opacity = '1';
            showFallbackImage();
        });

        // 如果视频很短，设置最小等待时间
        video.addEventListener('loadedmetadata', () => {
            if (video.duration < 2.5) {
                // 如果视频少于2.5秒，等待视频播放完后再显示文字
                setTimeout(() => {
                    if (mainUI.style.opacity === '0') {
                        mainUI.style.opacity = '1';
                    }
                }, video.duration * 1000 + 500);
            }
        });
    }
}

// 显示视频播放按钮（移动端可能需要）
function showVideoPlayButton() {
    const mainUI = document.querySelector('.main-ui');
    const playBtn = document.createElement('button');
    playBtn.className = 'video-play-fallback';
    playBtn.innerHTML = '▶ 播放背景视频';
    playBtn.style.cssText = `
        position: absolute;
        top: 20px;
        right: 20px;
        background: rgba(255, 255, 255, 0.2);
        color: white;
        border: none;
        padding: 10px 15px;
        border-radius: 25px;
        cursor: pointer;
        backdrop-filter: blur(10px);
        z-index: 20;
    `;
    
    playBtn.addEventListener('click', () => {
        const video = document.querySelector('.bg_video video');
        video.play().then(() => {
            playBtn.remove();
        });
    });
    
    document.querySelector('.part-zero').appendChild(playBtn);
    
    // 如果用户点击播放按钮，也要显示文字
    playBtn.addEventListener('click', () => {
        setTimeout(() => {
            mainUI.style.opacity = '1';
        }, 1000);
    });
}

// 显示备用图片
function showFallbackImage() {
    const videoElement = document.querySelector('.bg_video video');
    const bgVideo = document.querySelector('.bg_video');
    const mainUI = document.querySelector('.main-ui');
    
    // 创建备用背景
    const fallbackDiv = document.createElement('div');
    fallbackDiv.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #667eea, #764ba2);
        background-size: cover;
        background-position: center;
    `;
    
    bgVideo.appendChild(fallbackDiv);
    videoElement.style.display = 'none';
    
    // 显示文字内容
    mainUI.style.opacity = '1';
}

// 数字动画计数器
function initializeCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    const observerOptions = {
        threshold: 0.7
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => {
        observer.observe(counter);
    });
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000; // 2秒动画
    const step = target / (duration / 16); // 每16ms更新一次
    let current = 0;

    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        // 格式化数字显示
        if (target >= 1000000) {
            element.textContent = (current / 1000000).toFixed(1) + 'M+';
        } else if (target >= 1000) {
            element.textContent = (current / 1000).toFixed(0) + 'K+';
        } else {
            element.textContent = current.toFixed(1);
        }
    }, 16);
}

// 滚动效果和视差（简化版，不影响演示区域）
function initializeScrollEffects() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        // 滚动指示器淡出
        if (scrollIndicator) {
            const opacity = Math.max(1 - scrolled / 300, 0);
            scrollIndicator.style.opacity = opacity;
        }
        
        // 主内容轻微视差效果
        const heroContent = document.querySelector('.hero-content');
        if (heroContent && scrolled < window.innerHeight) {
            heroContent.style.transform = `translateY(${scrolled * 0.1}px)`;
        }
    });
}

// 视频弹窗功能
function initializeVideoModal() {
    const modal = document.getElementById('videoModal');
    const videoPlayBtn = document.querySelector('.video-play-btn');
    const closeBtn = document.querySelector('.modal-close');
    const demoVideo = document.getElementById('demoVideo');
    
    // 打开弹窗
    if (videoPlayBtn) {
        videoPlayBtn.addEventListener('click', () => {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            // 延迟播放，确保弹窗完全显示
            setTimeout(() => {
                demoVideo.play();
            }, 300);
        });
    }
    
    // 关闭弹窗
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        demoVideo.pause();
        demoVideo.currentTime = 0;
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    // 点击背景关闭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // ESC键关闭
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
}

// 移动端菜单
function initializeMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (toggle && navLinks) {
        toggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            toggle.classList.toggle('active');
        });
        
        // 点击菜单项后关闭菜单
        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                toggle.classList.remove('active');
            });
        });
    }
}

// 滚动到功能区域
function scrollToFeatures() {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
        const offsetTop = featuresSection.offsetTop - 70;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// 按钮涟漪效果
function createRippleEffect(event, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    `;
    
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// 为按钮添加涟漪效果
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-primary') || 
        e.target.classList.contains('btn-secondary')) {
        const button = e.target;
        if (getComputedStyle(button).position === 'static') {
            button.style.position = 'relative';
        }
        if (getComputedStyle(button).overflow !== 'hidden') {
            button.style.overflow = 'hidden';
        }
        createRippleEffect(e, button);
    }
});

// 添加涟漪动画CSS
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .nav-links.active {
        display: flex;
        position: fixed;
        top: 70px;
        left: 0;
        right: 0;
        background: rgba(10, 10, 10, 0.95);
        backdrop-filter: blur(20px);
        flex-direction: column;
        padding: 20px;
        gap: 20px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .mobile-menu-toggle.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .mobile-menu-toggle.active span:nth-child(2) {
        opacity: 0;
    }
    
    .mobile-menu-toggle.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
`;
document.head.appendChild(rippleStyle);

// 页面性能优化
function initializePerformanceOptimizations() {
    // 图片懒加载
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // 预加载关键资源
    const preloadVideo = document.createElement('link');
    preloadVideo.rel = 'preload';
    preloadVideo.as = 'video';
    preloadVideo.href = 'assets/videos/background.mp4';
    document.head.appendChild(preloadVideo);
}

// 错误处理
window.addEventListener('error', (e) => {
    console.error('页面错误:', e.error);
    // 可以在这里添加错误上报逻辑
});

// 初始化性能优化
document.addEventListener('DOMContentLoaded', initializePerformanceOptimizations);