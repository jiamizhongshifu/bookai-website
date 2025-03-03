/**
 * 错误处理和日志记录
 */

const ErrorHandler = {
    // 错误类型
    ERROR_TYPES: {
        NETWORK: 'network',
        JAVASCRIPT: 'javascript',
        RESOURCE: 'resource',
        SECURITY: 'security'
    },

    // 错误级别
    ERROR_LEVELS: {
        INFO: 'info',
        WARNING: 'warning',
        ERROR: 'error',
        CRITICAL: 'critical'
    },

    // 初始化错误处理
    init() {
        // 捕获未处理的Promise错误
        window.addEventListener('unhandledrejection', (event) => {
            this.logError(event.reason, 'PROMISE_REJECTION');
        });

        // 捕获JavaScript错误
        window.addEventListener('error', (event) => {
            this.logError(event.error, 'JAVASCRIPT_ERROR');
        });

        // 捕获资源加载错误
        document.addEventListener('error', (event) => {
            if (event.target.tagName === 'IMG' || event.target.tagName === 'SCRIPT' || event.target.tagName === 'LINK') {
                this.logError(new Error(`资源加载失败: ${event.target.src || event.target.href}`), 'RESOURCE_ERROR');
            }
        }, true);
    },

    // 记录错误
    logError(error, type = 'UNKNOWN', level = 'error') {
        const errorLog = {
            timestamp: new Date().toISOString(),
            type: type,
            level: level,
            message: error.message || String(error),
            stack: error.stack,
            url: window.location.href,
            userAgent: navigator.userAgent
        };

        // 在控制台显示错误
        console.error('错误日志:', errorLog);

        // 可以在这里添加错误上报逻辑
        this.reportError(errorLog);

        // 显示用户友好的错误提示
        if (level === 'critical') {
            this.showErrorMessage('抱歉，发生了一个错误。请刷新页面或稍后重试。');
        }
    },

    // 上报错误到服务器
    reportError(errorLog) {
        // 这里可以添加将错误上报到服务器的逻辑
        // 例如使用 Beacon API 或 XMLHttpRequest
        if (navigator.sendBeacon) {
            const blob = new Blob([JSON.stringify(errorLog)], { type: 'application/json' });
            navigator.sendBeacon('/api/log-error', blob);
        }
    },

    // 显示错误消息给用户
    showErrorMessage(message) {
        // 创建错误提示元素
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;

        // 添加到页面
        document.body.insertBefore(errorDiv, document.body.firstChild);

        // 5秒后自动消失
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
};

// 初始化错误处理
document.addEventListener('DOMContentLoaded', () => {
    ErrorHandler.init();
}); 