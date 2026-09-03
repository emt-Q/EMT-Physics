/**
 * 应用核心逻辑模块
 * ------------------------------------------------------------
 *  - 探究者姓名问候（本地持久化）
 *  - 题目图片上传 + 图像预处理 + Tesseract.js OCR 识别
 *  - 物理相关性判定（非物理题给出友好提示）
 *  - 关键词匹配 PhET 仿真实验
 *  - 实验启动倒计时流程（动画 + 音效 + 跳转）
 *  - OCR 结果复制 / 清空
 */
(function (global) {
    'use strict';

    const EMT = global.EMT = global.EMT || {};

    // ---- 模块状态 ----
    let tesseractWorker = null; // OCR Worker 单例（首次识别时懒加载）
    let matchExpUrl = '';       // 当前匹配到的实验链接
    let lastOcrText = '';       // 最近一次识别结果（供复制使用）

    // ---- DOM 缓存（一次性查找，避免重复查询） ----
    let els = null;

    const LS_USERNAME = 'emt-physics-username';

    function cacheDom() {
        els = {
            greetBtn: document.getElementById('greetBtn'),
            username: document.getElementById('username'),
            greeting: document.getElementById('greeting'),
            uploadArea: document.getElementById('uploadArea'),
            imageUpload: document.getElementById('imageUpload'),
            previewWrap: document.getElementById('previewWrap'),
            pBox: document.getElementById('pBox'),
            pFill: document.getElementById('pFill'),
            ocrResult: document.getElementById('ocrResult'),
            copyOcrBtn: document.getElementById('copyOcrBtn'),
            clearOcrBtn: document.getElementById('clearOcrBtn'),
            matchNotice: document.getElementById('matchNotice'),
            matchName: document.getElementById('matchName'),
            matchQuote: document.getElementById('matchQuote'),
            infoNotice: document.getElementById('infoNotice'),
            rejectNotice: document.getElementById('rejectNotice'),
            askNewtonBtn: document.getElementById('askNewtonBtn'),
            startExpBtn: document.getElementById('startExpBtn'),
            expStartModal: document.getElementById('expStartModal'),
            countdownNum: document.getElementById('countdownNum'),
            expStartText: document.getElementById('expStartText')
        };
    }

    // ---- 工具函数 ----

    /** 随机获取一条激励语录 */
    function getEncouragement(userName) {
        const name = userName || "探索者";
        const randomIndex = Math.floor(Math.random() * EMT.ENCOURAGEMENTS.length);
        return EMT.ENCOURAGEMENTS[randomIndex].replace("{name}", name);
    }

    /** 隐藏全部结果提示面板 */
    function hideAllNotices() {
        els.matchNotice.style.display = 'none';
        els.infoNotice.style.display = 'none';
        els.rejectNotice.style.display = 'none';
    }

    // ---- 交互：姓名问候 ----

    function handleGreet() {
        const name = els.username.value.trim();
        if (!name) return;

        els.greeting.innerText = `👋 欢迎加入实验室，物理学家 ${name}。`;
        els.greeting.style.transform = "scale(1.05)";
        setTimeout(() => { els.greeting.style.transform = "scale(1)"; }, 200);

        try { localStorage.setItem(LS_USERNAME, name); } catch (e) { /* 忽略隐私模式 */ }
    }

    function restoreUsername() {
        try {
            const saved = localStorage.getItem(LS_USERNAME);
            if (saved) els.username.value = saved;
        } catch (e) { /* 忽略 */ }
    }

    // ---- 图像预处理：提升 OCR 识别准确率 ----

    /** 读取图片为位图（优先 createImageBitmap，兼容回退 Image） */
    async function loadBitmap(file) {
        if (typeof createImageBitmap === 'function') {
            try { return await createImageBitmap(file); } catch (e) { /* 回退 */ }
        }
        return new Promise((resolve, reject) => {
            const url = URL.createObjectURL(file);
            const img = new Image();
            img.onload = () => { resolve(img); URL.revokeObjectURL(url); };
            img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('图片加载失败')); };
            img.src = url;
        });
    }

    /**
     * 预处理：统一缩放到合理尺寸（Tesseract 在 ~2000px 长边效果最佳），
     * 然后灰度化 + 对比度增强，显著提升低清晰度/低对比度图片的识别率。
     */
    function preprocess(bitmap) {
        const MIN_LONG_EDGE = 1600;
        const MAX_LONG_EDGE = 2400;
        const longEdge = Math.max(bitmap.width, bitmap.height);
        let scale = 1;
        if (longEdge < MIN_LONG_EDGE) scale = MIN_LONG_EDGE / longEdge;
        else if (longEdge > MAX_LONG_EDGE) scale = MAX_LONG_EDGE / longEdge;

        const w = Math.max(1, Math.round(bitmap.width * scale));
        const h = Math.max(1, Math.round(bitmap.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        ctx.drawImage(bitmap, 0, 0, w, h);

        // 灰度 + 对比度增强（逐像素，跨浏览器可靠）
        try {
            const imgData = ctx.getImageData(0, 0, w, h);
            const d = imgData.data;
            const contrast = 1.35;
            for (let i = 0; i < d.length; i += 4) {
                let v = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
                v = (v - 128) * contrast + 128;
                v = v < 0 ? 0 : (v > 255 ? 255 : v);
                d[i] = d[i + 1] = d[i + 2] = v;
            }
            ctx.putImageData(imgData, 0, 0);
        } catch (e) {
            console.warn('图像预处理降级：', e);
        }
        return canvas;
    }

    // ---- 交互：图片上传 → 预处理 → OCR → 分析 ----

    async function handleImageUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 15 * 1024 * 1024) {
            EMT.UI.toast('图片过大（>15MB），请压缩后重试', 'warn');
            return;
        }

        resetMatchState();
        showPreview(file);
        els.ocrResult.innerText = "⚡ 正在解析物理图谱... / Analyzing content...";
        hideAllNotices();
        els.copyOcrBtn.disabled = true;
        els.clearOcrBtn.disabled = false;

        try {
            const worker = await getWorker();

            // 预处理提升识别率
            const bitmap = await loadBitmap(file);
            const processed = preprocess(bitmap);

            const { data: { text } } = await worker.recognize(processed);
            els.pBox.style.display = 'none';

            lastOcrText = (text || '').trim();
            els.ocrResult.innerText = lastOcrText || "（未识别到文字，请尝试更清晰的图片）";
            els.copyOcrBtn.disabled = !lastOcrText;

            analyzeOcr(lastOcrText);
        } catch (err) {
            console.error('OCR failed:', err);
            els.pBox.style.display = 'none';
            els.ocrResult.innerText = "⚠️ OCR 识别失败，请检查网络连接后重试。";
            EMT.UI.toast('识别失败，请检查网络后重试', 'warn');
        }
    }

    /** 识别结果分析：先尝试匹配实验，再做物理相关性判定 */
    function analyzeOcr(text) {
        const sim = EMT.PhysicsTools.matchSim(text);
        if (sim) {
            showMatch(sim);
            return;
        }
        if (EMT.PhysicsTools.detectPhysics(text)) {
            // 物理内容但暂未匹配到具体实验
            els.infoNotice.style.display = 'block';
            EMT.UI.toast('已识别到物理内容，暂未匹配到对应实验');
            return;
        }
        // 非物理内容 → 友好拒绝
        els.rejectNotice.style.display = 'block';
        els.uploadArea.classList.add('shake');
        setTimeout(() => els.uploadArea.classList.remove('shake'), 600);
        EMT.UI.toast('请上传和物理有关的题目哦～', 'warn');
    }

    /** 清空上一次匹配结果，避免旧实验状态残留 */
    function resetMatchState() {
        matchExpUrl = '';
        els.matchName.innerText = '';
        els.matchQuote.innerText = '';
    }

    /** 渲染图片预览；预览完成后释放 Blob URL，防止内存泄漏 */
    function showPreview(file) {
        const url = URL.createObjectURL(file);
        els.previewWrap.innerHTML = `<img src="${url}" alt="上传的题目图片">`;
        const img = els.previewWrap.querySelector('img');
        img.onload = () => URL.revokeObjectURL(url);
        img.onerror = () => URL.revokeObjectURL(url);
    }

    /** 懒加载 Tesseract Worker（首次使用时创建并加载语言包） */
    async function getWorker() {
        if (!tesseractWorker) {
            tesseractWorker = await Tesseract.createWorker(['chi_sim', 'eng'], 1, {
                logger: m => {
                    if (m.status === 'recognizing text') {
                        els.pBox.style.display = 'block';
                        els.pFill.style.width = Math.floor(m.progress * 100) + '%';
                    }
                }
            });
            // 优化识别参数：自动版面分析 + 保留词间距
            try {
                await tesseractWorker.setParameters({
                    tessedit_pageseg_mode: 3,        // PSM.AUTO：自动版面分析
                    preserve_interword_spaces: '1'   // 保留英文词间距
                });
            } catch (paramErr) {
                console.warn('OCR 参数设置失败（不影响识别）：', paramErr);
            }
        }
        return tesseractWorker;
    }

    /** 展示匹配成功面板 */
    function showMatch(sim) {
        els.matchNotice.style.display = 'block';
        els.matchName.innerText = `为您匹配到：${sim.name}`;
        els.matchQuote.innerText = getEncouragement(els.username.value);
        matchExpUrl = sim.url;
        EMT.UI.toast('匹配成功，已锁定目标实验', 'success');
    }

    // ---- 交互：复制 / 清空 ----

    async function handleCopy() {
        if (!lastOcrText) {
            EMT.UI.toast('暂无可复制的识别文字');
            return;
        }
        try {
            await navigator.clipboard.writeText(lastOcrText);
            EMT.UI.toast('识别文字已复制', 'success');
        } catch (e) {
            // 兼容旧浏览器
            const ta = document.createElement('textarea');
            ta.value = lastOcrText;
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            try {
                document.execCommand('copy');
                EMT.UI.toast('识别文字已复制', 'success');
            } catch (e2) {
                EMT.UI.toast('复制失败，请手动选择文字', 'warn');
            }
            document.body.removeChild(ta);
        }
    }

    function handleClear() {
        resetMatchState();
        hideAllNotices();
        lastOcrText = '';
        els.ocrResult.innerText = '识别文字将在此显示...';
        els.previewWrap.innerHTML = '<div class="preview-placeholder">图片预览区</div>';
        els.copyOcrBtn.disabled = true;
        els.clearOcrBtn.disabled = true;
        els.imageUpload.value = '';
        els.pBox.style.display = 'none';
    }

    // ---- 交互：开启实验（倒计时 + 音效 + 跳转） ----

    async function handleStartExperiment() {
        if (!matchExpUrl) return;

        const modal = els.expStartModal;
        const countNum = els.countdownNum;
        const startText = els.expStartText;

        els.startExpBtn.disabled = true; // 防止倒计时期间重复触发
        modal.style.display = 'flex';
        EMT.Audio.playStartup();

        // 3 秒物理倒计时（爆炸动画）
        startText.innerText = "实验加载中...";
        await countDown(3, countNum);
        await countDown(2, countNum);
        await countDown(1, countNum);

        // 倒计时结束 → 实验启动提示
        countNum.innerText = '';
        countNum.style.display = 'none';
        startText.innerText = '实验启动成功！正在进入 PhET 实验室...';
        startText.style.fontSize = "28px";

        // 延迟跳转 → 无缝进入 PhET 仿真实验
        setTimeout(() => {
            window.open(matchExpUrl, '_blank');
            // 重置状态，便于下次使用
            setTimeout(() => {
                modal.style.display = 'none';
                countNum.style.display = 'block';
                startText.style.fontSize = "24px";
                els.startExpBtn.disabled = false;
            }, 1000);
        }, 1200);
    }

    /** 倒计时函数（带物理爆炸动画） */
    function countDown(num, el) {
        return new Promise(resolve => {
            el.innerText = num;
            el.style.animation = 'none';
            void el.offsetHeight; // 触发重绘以重置动画
            el.style.animation = 'countBlast 0.9s ease-out forwards';
            setTimeout(resolve, 1000);
        });
    }

    // ---- 初始化：绑定事件 ----

    function init() {
        cacheDom();
        restoreUsername();

        els.greetBtn.addEventListener('click', handleGreet);
        els.imageUpload.addEventListener('change', handleImageUpload);
        els.uploadArea.addEventListener('click', () => els.imageUpload.click());
        els.startExpBtn.addEventListener('click', handleStartExperiment);
        els.copyOcrBtn.addEventListener('click', handleCopy);
        els.clearOcrBtn.addEventListener('click', handleClear);
        els.askNewtonBtn.addEventListener('click', () => {
            if (global.EMT.Chat) EMT.Chat.open();
        });

        // 键盘可达性：Enter / Space 触发上传
        els.uploadArea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                els.imageUpload.click();
            }
        });
    }

    EMT.OCR = {
        init: init,
        getLastText: () => lastOcrText
    };
})(window);
