// 文档页面交互功能
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeNavCollapse();
    initializeTabs();
    initializeCodeCopy();
    initializeFAQ();
    initializeSmoothScrolling();
    initializePageLoad();
});

// 导航折叠功能
function initializeNavCollapse() {
    const navTitles = document.querySelectorAll('.nav-title');
    
    navTitles.forEach(title => {
        title.addEventListener('click', function() {
            const navSection = this.parentElement;
            const isCollapsed = navSection.classList.contains('collapsed');
            
            if (isCollapsed) {
                navSection.classList.remove('collapsed');
                this.classList.remove('collapsed');
            } else {
                navSection.classList.add('collapsed');
                this.classList.add('collapsed');
            }
        });
    });
}

// 导航功能
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.docs-nav a');
    const sections = document.querySelectorAll('.content-block');
    const docsContent = document.querySelector('.docs-content');
    
    console.log('所有sections:', Array.from(sections).map(s => s.id)); // 调试输出
    
    // 点击导航链接
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement && docsContent) {
                // 移除所有激活状态
                navLinks.forEach(l => l.classList.remove('active'));
                // 激活当前链接
                this.classList.add('active');
                
                // 计算目标位置（相对于内容容器）
                const containerRect = docsContent.getBoundingClientRect();
                const targetRect = targetElement.getBoundingClientRect();
                const scrollTop = docsContent.scrollTop;
                const targetPosition = targetRect.top - containerRect.top + scrollTop - 20;
                
                // 滚动到目标位置
                docsContent.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // 滚动时更新导航状态
    if (docsContent) {
        const observerOptions = {
            root: docsContent,
            rootMargin: '-20% 0px -60% 0px',
            threshold: [0, 0.1, 0.5]
        };
        
        const observer = new IntersectionObserver(function(entries) {
            let visibleSections = [];
            
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
                    const sectionId = entry.target.id;
                    visibleSections.push({
                        id: sectionId,
                        element: entry.target,
                        ratio: entry.intersectionRatio
                    });
                }
            });
            
            // 检查是否滚动到底部
            const scrollTop = docsContent.scrollTop;
            const scrollHeight = docsContent.scrollHeight;
            const clientHeight = docsContent.clientHeight;
            const isAtBottom = scrollTop + clientHeight >= scrollHeight - 100; // 增加容差到100px
            
            console.log('滚动状态:', { 
                scrollTop, 
                scrollHeight, 
                clientHeight, 
                calc: scrollTop + clientHeight,
                threshold: scrollHeight - 100,
                isAtBottom,
                visibleSections: visibleSections.map(s => s.id)
            });
            
            if (isAtBottom) {
                // 强制激活error-handling
                console.log('强制激活error-handling');
                const errorHandlingLink = document.querySelector(`.docs-nav a[href="#error-handling"]`);
                if (errorHandlingLink) {
                    navLinks.forEach(l => l.classList.remove('active'));
                    errorHandlingLink.classList.add('active');
                }
            } else if (visibleSections.length > 0) {
                // 激活可见性最高的section
                const mostVisible = visibleSections.reduce((prev, current) => 
                    current.ratio > prev.ratio ? current : prev
                );
                
                const activeLink = document.querySelector(`.docs-nav a[href="#${mostVisible.id}"]`);
                if (activeLink) {
                    navLinks.forEach(l => l.classList.remove('active'));
                    activeLink.classList.add('active');
                }
            }
        }, observerOptions);
        
        sections.forEach(section => {
            observer.observe(section);
        });
    }
}

// 选项卡功能
function initializeTabs() {
    window.showTab = function(tabName) {
        // 隐藏所有选项卡内容
        const tabContents = document.querySelectorAll('.tab-content');
        tabContents.forEach(content => {
            content.classList.remove('active');
        });
        
        // 移除所有按钮的激活状态
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => {
            btn.classList.remove('active');
        });
        
        // 显示选中的选项卡
        const selectedTab = document.getElementById(tabName);
        if (selectedTab) {
            selectedTab.classList.add('active');
        }
        
        // 激活对应的按钮
        const clickedButton = event.target;
        clickedButton.classList.add('active');
    };
}

// 代码复制功能
function initializeCodeCopy() {
    window.copyCode = function(button) {
        const codeBlock = button.closest('.code-block');
        const code = codeBlock.querySelector('pre code');
        const text = code.textContent;
        
        // 使用现代 Clipboard API
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(function() {
                showCopySuccess(button);
            }).catch(function(err) {
                showCopyError(button);
                console.error('复制失败:', err);
            });
        } else {
            // 回退到传统方法
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            
            try {
                document.execCommand('copy');
                showCopySuccess(button);
            } catch (err) {
                showCopyError(button);
                console.error('复制失败:', err);
            }
            
            document.body.removeChild(textarea);
        }
    };
    
    function showCopySuccess(button) {
        const originalText = button.textContent;
        button.textContent = '已复制!';
        button.style.background = '#10b981';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 2000);
    }
    
    function showCopyError(button) {
        const originalText = button.textContent;
        button.textContent = '复制失败';
        button.style.background = '#ef4444';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 2000);
    }
}

// FAQ展开/折叠功能
function initializeFAQ() {
    window.toggleFAQ = function(element) {
        const faqItem = element.parentElement;
        const faqAnswer = faqItem.querySelector('.faq-answer');
        const toggle = element.querySelector('.faq-toggle');
        
        if (faqAnswer.classList.contains('active')) {
            faqAnswer.classList.remove('active');
            element.classList.remove('active');
            toggle.textContent = '+';
        } else {
            // 关闭其他已展开的FAQ
            document.querySelectorAll('.faq-answer.active').forEach(answer => {
                answer.classList.remove('active');
                answer.parentElement.querySelector('.faq-question').classList.remove('active');
                answer.parentElement.querySelector('.faq-toggle').textContent = '+';
            });
            
            // 展开当前FAQ
            faqAnswer.classList.add('active');
            element.classList.add('active');
            toggle.textContent = '−';
        }
    };
}

// 平滑滚动
function initializeSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement && targetId !== '#help-section' && targetId !== '#api-section') {
                e.preventDefault();
                const headerHeight = document.querySelector('.commonHeader').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 页面加载动画和hash处理
function initializePageLoad() {
    setTimeout(function() {
        document.body.classList.add('loaded');
        
        // 处理URL中的hash，自动跳转到对应模块
        if (window.location.hash) {
            const hash = window.location.hash;
            const targetElement = document.querySelector(hash);
            const docsContent = document.querySelector('.docs-content');
            
            if (targetElement && docsContent) {
                setTimeout(() => {
                    // 计算目标位置
                    const containerRect = docsContent.getBoundingClientRect();
                    const targetRect = targetElement.getBoundingClientRect();
                    const scrollTop = docsContent.scrollTop;
                    const targetPosition = targetRect.top - containerRect.top + scrollTop - 20;
                    
                    // 滚动到目标位置
                    docsContent.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // 更新导航激活状态
                    const navLinks = document.querySelectorAll('.docs-nav a');
                    const targetLink = document.querySelector(`.docs-nav a[href="${hash}"]`);
                    if (targetLink) {
                        navLinks.forEach(l => l.classList.remove('active'));
                        targetLink.classList.add('active');
                    }
                }, 200);
            }
        }
    }, 100);
}

// 工具函数：防抖
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 工具函数：节流
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// 键盘快捷键
document.addEventListener('keydown', function(e) {
    // ESC键关闭所有展开的FAQ
    if (e.key === 'Escape') {
        document.querySelectorAll('.faq-answer.active').forEach(answer => {
            answer.classList.remove('active');
            answer.parentElement.querySelector('.faq-question').classList.remove('active');
            answer.parentElement.querySelector('.faq-toggle').textContent = '+';
        });
    }
});

// 页面加载完成后执行
window.addEventListener('load', function() {
    console.log('CryptoLLM 文档页面加载完成');
    
    // 如果URL中有hash，滚动到对应位置
    if (window.location.hash) {
        setTimeout(() => {
            const target = document.querySelector(window.location.hash);
            if (target) {
                const headerHeight = document.querySelector('.commonHeader').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }, 100);
    }
});

// 错误处理
window.addEventListener('error', function(e) {
    console.error('页面错误:', e.error);
});