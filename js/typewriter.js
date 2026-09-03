/**
 * 打字机动画模块
 * ------------------------------------------------------------
 * 使命宣言逐字输入 / 删除的循环动画，模拟信号传输效果。
 */
(function (global) {
    'use strict';

    const EMT = global.EMT = global.EMT || {};

    /** 延时工具 */
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    /**
     * 在指定元素内循环播放打字机动画
     * @param {string} text      要展示的完整文本
     * @param {string} elementId 目标元素 ID
     */
    async function runTypeCycle(text, elementId) {
        const element = document.getElementById(elementId);
        if (!element) return;

        while (true) {
            // 逐字输入
            for (let i = 0; i <= text.length; i++) {
                element.textContent = text.substring(0, i);
                await sleep(EMT.config.typeSpeed);
            }
            await sleep(EMT.config.pauseTime);
            // 逐字删除
            for (let i = text.length; i >= 0; i--) {
                element.textContent = text.substring(0, i);
                await sleep(EMT.config.deleteSpeed);
            }
            await sleep(800);
        }
    }

    EMT.Typewriter = {
        run: runTypeCycle
    };
})(window);
