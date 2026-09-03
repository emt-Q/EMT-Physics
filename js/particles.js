/**
 * 粒子背景模块
 * ------------------------------------------------------------
 * Canvas 2D 动态量子粒子背景，营造物理宇宙氛围。
 */
(function (global) {
    'use strict';

    const EMT = global.EMT = global.EMT || {};

    const PARTICLE_COUNT = 80;

    function init() {
        const bg = document.getElementById('particle-bg');
        if (!bg) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        bg.appendChild(canvas);

        const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 1.5 + 0.5,
            vx: Math.random() * 0.5 - 0.25,
            vy: Math.random() * 0.5 - 0.25,
            // 品牌色系粒子（量子蓝 + 紫）
            color: `rgba(${Math.floor(59 + Math.random() * 50)}, ${Math.floor(130 + Math.random() * 50)}, ${Math.floor(246)}, ${Math.random() * 0.4})`
        }));

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
            });
            requestAnimationFrame(animate);
        }

        animate();

        // 窗口尺寸变化时同步画布
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    EMT.Particles = {
        init: init
    };
})(window);
