/**
 * EMT Physics – 应用入口
 * ------------------------------------------------------------
 * DOM 就绪后依次初始化各模块（脚本位于 body 末尾，通常已就绪）。
 */
(function (global) {
    'use strict';

    const EMT = global.EMT = global.EMT || {};

    function init() {
        // 使命宣言打字机动画
        EMT.Typewriter.run(EMT.config.mission, 'mission-text');

        // 物理粒子背景
        EMT.Particles.init();

        // 通用 UI（导航滚动 / Toast / 页脚年份）
        EMT.UI.init();

        // 应用核心交互（问候 / OCR / 实验启动）
        EMT.OCR.init();

        // AI 学习助手（艾萨克牛顿爵士）
        EMT.Chat.init();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})(window);
