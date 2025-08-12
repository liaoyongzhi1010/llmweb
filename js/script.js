// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function () {
    initializeNavigation();
    initializeVideoBackground();
    initializeScrollEffects();
    initializeVideoModal();
    initializePageNavigation();
});

// 全屏翻页功能
let currentPage = 0;
let isScrolling = false;
const totalPages = 6;

function initializePageNavigation() {
    const indicators = document.querySelectorAll('.indicator');

    // 初始化视频播放设置
    const bgVideo = document.querySelector('.bg_video video');
    const page2Video = document.querySelector('.bg_video_page2 video');
    const page3Video = document.querySelector('.bg_video_page3 video');
    const page4Video = document.querySelector('.bg_video_page4 video');
    const page5Video = document.querySelector('.bg_video_page5 video');

    if (bgVideo) {
        bgVideo.loop = false; // 不循环播放
        bgVideo.addEventListener('ended', () => {
            console.log('第一页视频播放结束，停留在最后一帧');
        });
    }

    if (page2Video) {
        page2Video.pause(); // 初始暂停第二页视频
        page2Video.loop = false; // 不循环播放
        page2Video.addEventListener('ended', () => {
            console.log('第二页视频播放结束，停留在最后一帧');
        });
    }

    if (page3Video) {
        page3Video.pause(); // 初始暂停第三页视频
        page3Video.loop = false; // 不循环播放
        page3Video.addEventListener('ended', () => {
            console.log('第三页视频播放结束，停留在最后一帧');
        });
    }

    if (page4Video) {
        page4Video.pause(); // 初始暂停第四页视频
        page4Video.loop = false; // 不循环播放
        page4Video.addEventListener('ended', () => {
            console.log('第四页视频播放结束，停留在最后一帧');
        });
    }

    if (page5Video) {
        page5Video.pause(); // 初始暂停第五页视频
        page5Video.loop = false; // 不循环播放
        page5Video.addEventListener('ended', () => {
            console.log('第五页视频播放结束，停留在最后一帧');
        });
    }

    // 滚轮事件监听
    document.addEventListener('wheel', handleWheel, { passive: false });

    // 键盘事件监听
    document.addEventListener('keydown', handleKeydown);

    // 指示器点击事件
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            if (!isScrolling) {
                goToPage(index);
            }
        });
    });

    // 触摸事件支持（移动端）
    initializeTouchNavigation();
}

function handleWheel(e) {
    e.preventDefault();

    if (isScrolling) return;

    const delta = e.deltaY;

    if (delta > 0 && currentPage < totalPages - 1) {
        // 向下滚动，下一页
        goToPage(currentPage + 1);
    } else if (delta < 0 && currentPage > 0) {
        // 向上滚动，上一页
        goToPage(currentPage - 1);
    }
}

function handleKeydown(e) {
    if (isScrolling) return;

    switch (e.key) {
        case 'ArrowDown':
        case 'PageDown':
        case ' ': // 空格键
            e.preventDefault();
            if (currentPage < totalPages - 1) {
                goToPage(currentPage + 1);
            }
            break;
        case 'ArrowUp':
        case 'PageUp':
            e.preventDefault();
            if (currentPage > 0) {
                goToPage(currentPage - 1);
            }
            break;
        case 'Home':
            e.preventDefault();
            goToPage(0);
            break;
        case 'End':
            e.preventDefault();
            goToPage(totalPages - 1);
            break;
    }
}

function goToPage(pageIndex) {
    if (isScrolling || pageIndex === currentPage) return;

    isScrolling = true;
    const partZero = document.querySelector('.part-zero');
    const partOne = document.querySelector('.part-one');
    const partTwo = document.querySelector('.part-two');
    const partThree = document.querySelector('.part-three');
    const partFour = document.querySelector('.part-four');
    const partFive = document.querySelector('.part-five');
    const indicators = document.querySelectorAll('.indicator');

    // 检查页面元素是否存在
    if (!partZero || !partOne || !partTwo || !partThree || !partFour || !partFive) {
        console.error('找不到页面元素！');
        isScrolling = false;
        return;
    }

    // 更新当前页
    currentPage = pageIndex;

    // 全屏滚动切换：每次只显示一个页面
    // 重置所有页面状态
    partZero.classList.remove('hide');
    partOne.classList.remove('active');
    partTwo.classList.remove('active');
    partThree.classList.remove('active');
    partFour.classList.remove('active');
    partFive.classList.remove('active');

    // 根据当前页面显示对应的页面
    if (currentPage === 0) {
        // 显示第1页，隐藏其他页面
    } else if (currentPage === 1) {
        partZero.classList.add('hide');
        partOne.classList.add('active');
    } else if (currentPage === 2) {
        partZero.classList.add('hide');
        partTwo.classList.add('active');
    } else if (currentPage === 3) {
        partZero.classList.add('hide');
        partThree.classList.add('active');
    } else if (currentPage === 4) {
        partZero.classList.add('hide');
        partFour.classList.add('active');
    } else if (currentPage === 5) {
        partZero.classList.add('hide');
        partFive.classList.add('active');
    }

    // 更新指示器状态
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentPage);
    });

    // 视频管理
    managePageVideos();

    // 重置滚动锁定
    setTimeout(() => {
        isScrolling = false;
    }, 800); // 与CSS动画时间匹配
}

function managePageVideos() {
    const bgVideo = document.querySelector('.bg_video video');
    const page2Video = document.querySelector('.bg_video_page2 video');
    const page3Video = document.querySelector('.bg_video_page3 video');
    const page4Video = document.querySelector('.bg_video_page4 video');
    const page5Video = document.querySelector('.bg_video_page5 video');

    // 先暂停所有视频，避免冲突
    if (bgVideo) bgVideo.pause();
    if (page2Video) page2Video.pause();
    if (page3Video) page3Video.pause();
    if (page4Video) page4Video.pause();
    if (page5Video) page5Video.pause();

    // 立即播放对应视频
    if (currentPage === 0) {
        // 第一页 - 播放第一页视频
        if (bgVideo) {
            bgVideo.currentTime = 0; // 从头开始播放
            bgVideo.play().catch(error => {
                console.log('第一页视频播放失败:', error.name);
            });
        }
    } else if (currentPage === 1) {
        // 第二页 - 播放第二页视频
        if (page2Video) {
            page2Video.currentTime = 0;
            page2Video.play().catch(error => {
                console.log('第二页视频播放失败:', error.name);
            });
        }
    } else if (currentPage === 2) {
        // 第三页 - 播放第三页视频
        if (page3Video) {
            page3Video.currentTime = 0;
            page3Video.play().catch(error => {
                console.log('第三页视频播放失败:', error.name);
            });
        }
    } else if (currentPage === 3) {
        // 第四页 - 播放第四页视频
        if (page4Video) {
            page4Video.currentTime = 0;
            page4Video.play().catch(error => {
                console.log('第四页视频播放失败:', error.name);
            });
        }
    } else if (currentPage === 4) {
        // 第五页 - 播放第五页视频
        if (page5Video) {
            page5Video.currentTime = 0;
            page5Video.play().catch(error => {
                console.log('第五页视频播放失败:', error.name);
            });
        }
    }
}

// 触摸导航支持
function initializeTouchNavigation() {
    let startY = 0;
    let endY = 0;
    const minSwipeDistance = 50;

    document.addEventListener('touchstart', (e) => {
        startY = e.touches[0].clientY;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
        if (isScrolling) return;

        endY = e.changedTouches[0].clientY;
        const diff = startY - endY;

        if (Math.abs(diff) > minSwipeDistance) {
            if (diff > 0 && currentPage < totalPages - 1) {
                // 向上滑动，下一页
                goToPage(currentPage + 1);
            } else if (diff < 0 && currentPage > 0) {
                // 向下滑动，上一页
                goToPage(currentPage - 1);
            }
        }
    }, { passive: true });
}

// 导航栏滚动效果
function initializeNavigation() {
    const nav = document.querySelector('.commonHeader');

    if (nav) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;

            if (scrolled > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        });
    }

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

// 视频背景初始化（在1秒显示文字，播放完成后停留在最后一帧作为背景）
function initializeVideoBackground() {
    const video = document.querySelector('.bg_video video');
    const mainUI = document.querySelector('.main-ui');

    if (video && mainUI) {
        // 设置初始透明度
        mainUI.style.opacity = '0';

        // 监听视频时间更新，在1秒显示文字
        video.addEventListener('timeupdate', () => {
            if (video.currentTime >= 1 && mainUI.style.opacity === '0') {
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
            if (video.duration < 1) {
                // 如果视频少于1秒，等待视频播放完后再显示文字
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

// 滚动效果和视差（简化版）
function initializeScrollEffects() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;

        // 主内容轻微视差效果
        const heroContent = document.querySelector('.main-ui');
        if (heroContent && scrolled < window.innerHeight) {
            heroContent.style.transform = `translateY(${scrolled * 0.05}px)`;
        }
    });
}

// 视频弹窗功能
function initializeVideoModal() {
    const modal = document.getElementById('videoModal');
    const videoPlayBtn = document.querySelector('.video-play-btn');
    const closeBtn = document.querySelector('.videoClose');
    const demoVideo = modal ? modal.querySelector('video') : null;

    console.log('Video modal elements found');

    // 打开弹窗
    if (videoPlayBtn) {
        videoPlayBtn.addEventListener('click', () => {
            console.log('Video play button clicked');
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            // 延迟播放，确保弹窗完全显示后自动播放
            setTimeout(() => {
                if (demoVideo) {
                    demoVideo.play().catch(error => {
                        console.log('视频播放失败:', error);
                    });
                }
            }, 300);
        });
    } else {
        console.log('Video play button not found');
    }

    // 关闭弹窗
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        if (demoVideo) {
            demoVideo.pause();
            demoVideo.currentTime = 0;
        }
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // 点击背景关闭
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // ESC键关闭
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.style.display === 'block') {
            closeModal();
        }
    });
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