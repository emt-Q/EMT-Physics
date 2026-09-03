/**
 * 应用核心逻辑模块
 * ------------------------------------------------------------
 *  - 探究者姓名问候
 *  - 题目图片上传 + Tesseract.js OCR 识别
 *  - 关键词匹配 PhET 仿真实验
 *  - 实验启动倒计时流程（动画 + 音效 + 跳转）
 */
(function (global) {
    'use strict';

    const EMT = global.EMT = global.EMT || {};

    // ---- 模块状态 ----
    let tesseractWorker = null; // OCR Worker 单例（首次识别时懒加载）
    let matchExpUrl = '';       // 当前匹配到的实验链接

    // ---- DOM 缓存（一次性查找，避免重复查询） ----
    let els = null;

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
            matchNotice: document.getElementById('matchNotice'),
            matchName: document.getElementById('matchName'),
            matchQuote: document.getElementById('matchQuote'),
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

    // ---- 交互：姓名问候 ----

    function handleGreet() {
        const name = els.username.value.trim();
        if (!name) return;

        els.greeting.innerText = `👋 欢迎加入实验室，物理学家 ${name}。`;
        // 微小震动反馈
        els.greeting.style.transform = "scale(1.05)";
        setTimeout(() => { els.greeting.style.transform = "scale(1)"; }, 200);
    }

    // ---- 交互：图片上传 → OCR → 匹配 ----

    async function handleImageUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        resetMatchState();
        showPreview(file);
        els.ocrResult.innerText = "⚡ 正在解析物理图谱... / Analyzing content...";
        els.matchNotice.style.display = 'none';

        try {
            const worker = await getWorker();
            const { data: { text } } = await worker.recognize(file);
            els.ocrResult.innerText = text || "（未识别到文字，请尝试更清晰的图片）";
            els.pBox.style.display = 'none';
            matchPhysicsExperiment(text);
        } catch (err) {
            console.error('OCR failed:', err);
            els.ocrResult.innerText = "⚠️ OCR 识别失败，请检查网络连接后重试。";
            els.pBox.style.display = 'none';
        }
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
        }
        return tesseractWorker;
    }

    /** 关键词匹配物理仿真实验 */
    function matchPhysicsExperiment(text) {
        const lowerText = text.toLowerCase().replace(/\s+/g, '');
        const match = EMT.PHYSICS_SIMS.find(s =>
            s.keywords.some(k => lowerText.includes(k.toLowerCase()))
        );
        if (!match) return;

        els.matchNotice.style.display = 'block';
        els.matchName.innerText = `为您匹配到：${match.name}`;
        els.matchQuote.innerText = getEncouragement(els.username.value);
        matchExpUrl = match.url;
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

        els.greetBtn.addEventListener('click', handleGreet);
        els.imageUpload.addEventListener('change', handleImageUpload);
        els.uploadArea.addEventListener('click', () => els.imageUpload.click());
        els.startExpBtn.addEventListener('click', handleStartExperiment);

        // 键盘可达性：Enter / Space 触发上传
        els.uploadArea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                els.imageUpload.click();
            }
        });
    }

    EMT.OCR = {
        init: init
    };
})(window);
