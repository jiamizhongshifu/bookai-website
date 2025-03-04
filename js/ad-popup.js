/**
 * 广告弹窗脚本
 * 用于在首页显示广告弹窗
 */

document.addEventListener('DOMContentLoaded', function() {
    // 创建弹窗元素
    function createAdPopup() {
        // 检查是否已经存在弹窗
        if (document.getElementById('adPopup')) {
            return;
        }

        // 创建弹窗容器
        const popupContainer = document.createElement('div');
        popupContainer.id = 'adPopup';
        popupContainer.className = 'ad-popup-overlay';

        // 弹窗内容
        popupContainer.innerHTML = `
            <div class="ad-popup-content">
                <button type="button" class="ad-popup-close" aria-label="关闭">&times;</button>
                <div class="ad-popup-logo">
                    <span class="ad-logo-w">W</span> 野卡
                </div>
                <h2 class="ad-popup-title">2分钟拥有海外虚拟信用卡，畅享全球AI服务！</h2>
                <p class="ad-popup-subtitle">一键解锁ChatGPT Plus、Claude、Midjourney等全球AI服务</p>
                <p class="ad-popup-description">
                    Wildcard野卡是国内领先的海外虚拟信用卡平台，无需海外手机号，无需实体卡，支持支付宝充值，安全便捷，已为10万+用户提供稳定可靠的支付服务。
                </p>
                <ul class="ad-popup-features">
                    <li><span class="ad-check-icon">✓</span> 支持ChatGPT Plus订阅</li>
                    <li><span class="ad-check-icon">✓</span> 支持Claude会员开通</li>
                    <li><span class="ad-check-icon">✓</span> 支持OpenAI API充值</li>
                </ul>
                <a href="https://yeka.ai/i/OKZVLIME" class="ad-popup-button">立即获取虚拟卡 →</a>
                <p class="ad-popup-later">稍后再说</p>
            </div>
        `;

        // 添加到body
        document.body.appendChild(popupContainer);

        // 添加关闭事件
        const closeButton = popupContainer.querySelector('.ad-popup-close');
        closeButton.addEventListener('click', closeAdPopup);

        // 点击"稍后再说"也关闭弹窗
        const laterButton = popupContainer.querySelector('.ad-popup-later');
        laterButton.addEventListener('click', closeAdPopup);

        // 点击弹窗外部区域关闭弹窗
        popupContainer.addEventListener('click', function(e) {
            if (e.target === popupContainer) {
                closeAdPopup();
            }
        });

        // 显示弹窗
        setTimeout(() => {
            popupContainer.classList.add('show');
        }, 300);
    }

    // 关闭弹窗
    function closeAdPopup() {
        const popup = document.getElementById('adPopup');
        if (popup) {
            popup.classList.remove('show');
            setTimeout(() => {
                popup.remove();
            }, 300);
        }
    }

    // 显示弹窗
    createAdPopup();
});
