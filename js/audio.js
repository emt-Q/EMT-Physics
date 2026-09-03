/**
 * 音效模块
 * ------------------------------------------------------------
 * 使用 Web Audio API 原生合成"物理启动"音效，无需外部音频文件。
 * 复用同一个 AudioContext 实例，避免浏览器对音频上下文数量的限制。
 */
(function (global) {
    'use strict';

    const EMT = global.EMT = global.EMT || {};

    let audioCtx = null;

    /** 获取（或首次创建）共享的 AudioContext */
    function getContext() {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return null;
        if (!audioCtx) audioCtx = new AudioContext();
        return audioCtx;
    }

    /** 播放实验启动"充电"音效：220Hz → 880Hz 正弦扫频 */
    function playStartup() {
        const ctx = getContext();
        if (!ctx) return;

        try {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.type = 'sine';
            osc.frequency.setValueAtTime(220, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.5);

            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

            osc.start();
            osc.stop(ctx.currentTime + 0.5);
        } catch (e) {
            console.warn('Audio not supported', e);
        }
    }

    EMT.Audio = {
        playStartup: playStartup
    };
})(window);
