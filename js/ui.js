/**
 * 通用 UI 模块
 * ------------------------------------------------------------
 *  - Toast 轻提示
 *  - 导航栏平滑滚动（实验室 / 愿景 / 关于）
 *  - 页脚年份自动更新
 */
(function (global) {
    'use strict';

    const EMT = global.EMT = global.EMT || {};

    let toastBox = null;

    /**
     * 轻提示
     * @param {string} message 文案
     * @param {string} [type]  info | success | warn
     */
    function toast(message, type) {
        if (!toastBox) toastBox = document.getElementById('toastBox');
        if (!toastBox) return;

        const t = document.createElement('div');
        t.className = 'toast ' + (type || 'info');
        t.textContent = message;
        toastBox.appendChild(t);
        requestAnimationFrame(() => t.classList.add('show'));
        setTimeout(() => {
            t.classList.remove('show');
            setTimeout(() => t.remove(), 350);
        }, 2600);
    }

    function scrollToElement(el) {
        if (!el) return;
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function init() {
        // 导航栏平滑滚动
        const navBrand = document.getElementById('navBrand');
        const navLab = document.getElementById('navLab');
        const navVision = document.getElementById('navVision');
        const navAbout = document.getElementById('navAbout');

        if (navBrand) navBrand.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
        if (navLab) navLab.addEventListener('click', () => scrollToElement(document.getElementById('workspace')));
        if (navVision) navVision.addEventListener('click', () => scrollToElement(document.getElementById('vision')));
        if (navAbout) navAbout.addEventListener('click', () => scrollToElement(document.getElementById('about')));

        // 页脚年份自动更新
        const yearEl = document.getElementById('year');
        if (yearEl) {
            const currentYear = new Date().getFullYear();
            yearEl.textContent = Math.max(2025, currentYear);
        }
    }

    EMT.UI = {
        init: init,
        toast: toast
    };
})(window);
