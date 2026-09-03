/**
 * AI 学习助手模块：艾萨克牛顿爵士
 * ------------------------------------------------------------
 * 基于火山方舟（豆包大模型）OpenAI 兼容接口，浏览器直连（接口已支持 CORS）。
 * API Key 与模型 ID 由用户在设置中填写，仅保存在本地浏览器 localStorage，
 * 不会上传到任何服务器。建议使用受限权限的 Key 以控制用量。
 */
(function (global) {
    'use strict';

    const EMT = global.EMT = global.EMT || {};

    const LS_SETTINGS = 'emt-ai-settings';
    const LS_HISTORY = 'emt-chat-history';
    const LS_HINT = 'emt-chat-hint-shown';

    let els = null;
    let settings = {};
    let history = [];
    let busy = false;

    function cacheDom() {
        els = {
            chatBtn: document.getElementById('chatBtn'),
            chatPanel: document.getElementById('chatPanel'),
            chatClose: document.getElementById('chatClose'),
            chatOpenSettings: document.getElementById('chatOpenSettings'),
            chatMessages: document.getElementById('chatMessages'),
            chatQuick: document.getElementById('chatQuick'),
            chatInput: document.getElementById('chatInput'),
            chatSend: document.getElementById('chatSend'),
            aiModal: document.getElementById('aiSettingsModal'),
            aiKey: document.getElementById('aiKey'),
            aiModel: document.getElementById('aiModel'),
            aiEndpoint: document.getElementById('aiEndpoint'),
            aiSave: document.getElementById('aiSave'),
            aiCancel: document.getElementById('aiCancel')
        };
    }

    // ---- 持久化 ----

    function loadSettings() {
        try { settings = JSON.parse(localStorage.getItem(LS_SETTINGS)) || {}; }
        catch (e) { settings = {}; }
        if (!settings.endpoint) settings.endpoint = EMT.CHAT.defaultEndpoint;
        if (!settings.model) settings.model = EMT.CHAT.defaultModel || '';
        if (!settings.apiKey) settings.apiKey = '';
    }

    function saveSettings() {
        try { localStorage.setItem(LS_SETTINGS, JSON.stringify(settings)); }
        catch (e) { /* 隐私模式忽略 */ }
    }

    function loadHistory() {
        try {
            const raw = JSON.parse(localStorage.getItem(LS_HISTORY));
            if (Array.isArray(raw)) {
                history = raw.filter(m => m && typeof m.content === 'string');
            }
        } catch (e) { history = []; }
    }

    function persistHistory() {
        try {
            localStorage.setItem(LS_HISTORY, JSON.stringify(history.slice(-EMT.CHAT.maxHistory)));
        } catch (e) { /* 忽略 */ }
    }

    // ---- 面板开关 ----

    function open() {
        els.chatPanel.classList.add('open');
        els.chatBtn.classList.add('hidden');
        if (history.length === 0) {
            addMessage('assistant', '我是艾萨克·牛顿爵士。凡是我能解答的物理问题，愿与您一同探究。请提问吧。');
        }
        renderMessages();
        els.chatInput.focus();
        try { localStorage.setItem(LS_HINT, '1'); } catch (e) { /* 忽略 */ }
        els.chatBtn.classList.remove('new');
    }

    function close() {
        els.chatPanel.classList.remove('open');
        els.chatBtn.classList.remove('hidden');
    }

    function toggle() {
        if (els.chatPanel.classList.contains('open')) close();
        else open();
    }

    // ---- 消息渲染 ----

    function appendBubble(role, content) {
        const div = document.createElement('div');
        div.className = 'msg ' + (role === 'user' ? 'user' : (role === 'assistant' ? 'assistant' : 'system'));
        div.textContent = content; // textContent 防 XSS
        els.chatMessages.appendChild(div);
        scrollBottom();
        return div;
    }

    function addMessage(role, content) {
        history.push({ role: role === 'user' ? 'user' : 'assistant', content: content });
        if (role === 'assistant') persistHistory();
        appendBubble(role, content);
    }

    function scrollBottom() {
        els.chatMessages.scrollTop = els.chatMessages.scrollHeight;
    }

    function renderMessages() {
        els.chatMessages.innerHTML = '';
        if (history.length === 0) {
            appendBubble('assistant', '我是艾萨克·牛顿爵士。凡是我能解答的物理问题，愿与您一同探究。请提问吧。');
            return;
        }
        history.forEach(m => appendBubble(m.role, m.content));
    }

    function showThinking() {
        const div = document.createElement('div');
        div.className = 'msg assistant thinking';
        div.innerHTML = '<span>牛顿爵士正在思考</span><span class="dot"></span><span class="dot"></span><span class="dot"></span>';
        els.chatMessages.appendChild(div);
        scrollBottom();
    }

    function hideThinking() {
        const t = els.chatMessages.querySelector('.thinking');
        if (t) t.remove();
    }

    // ---- 快捷提问 ----

    function renderQuick() {
        els.chatQuick.innerHTML = '';
        EMT.CHAT.quickQuestions.forEach(q => {
            const chip = document.createElement('button');
            chip.type = 'button';
            chip.className = 'chat-chip';
            chip.textContent = q;
            chip.addEventListener('click', () => {
                els.chatInput.value = q;
                send();
            });
            els.chatQuick.appendChild(chip);
        });
    }

    // ---- 请求豆包 API ----

    async function requestAI(userText) {
        if (!settings.apiKey) throw { code: 'NO_KEY' };
        if (!settings.model) throw { code: 'NO_MODEL' };

        const messages = [
            { role: 'system', content: EMT.CHAT.systemPrompt },
            ...history.slice(-EMT.CHAT.maxHistory) // 已包含刚加入的用户消息
        ];

        const res = await fetch(settings.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + settings.apiKey
            },
            body: JSON.stringify({
                model: settings.model,
                messages: messages,
                temperature: EMT.CHAT.temperature,
                max_tokens: EMT.CHAT.maxTokens
            })
        });

        if (!res.ok) {
            if (res.status === 401) throw { code: 'HTTP', message: 'API Key 无效或已过期，请在设置中重新填写。' };
            if (res.status === 429) throw { code: 'HTTP', message: '请求过于频繁，请稍后再试。' };
            throw { code: 'HTTP', message: `请求失败（HTTP ${res.status}），请检查 Key 与模型 ID。` };
        }

        const data = await res.json();
        const content = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
        if (!content) throw { code: 'EMPTY', message: 'AI 未返回有效内容，请重试。' };
        return content;
    }

    async function send() {
        const text = els.chatInput.value.trim();
        if (!text || busy) return;

        els.chatInput.value = '';
        addMessage('user', text);
        autoGrowInput();
        showThinking();
        busy = true;
        els.chatSend.disabled = true;

        try {
            const reply = await requestAI(text);
            hideThinking();
            addMessage('assistant', reply);
        } catch (err) {
            hideThinking();
            handleError(err);
        } finally {
            busy = false;
            els.chatSend.disabled = false;
            els.chatInput.focus();
        }
    }

    function handleError(err) {
        if (err.code === 'NO_KEY') {
            showSettings();
            addMessage('system', '请先点击右上角 ⚙ 填写豆包（火山方舟）API Key，即可向牛顿爵士提问。');
        } else if (err.code === 'NO_MODEL') {
            showSettings();
            addMessage('system', '请先点击右上角 ⚙ 填写模型 ID（在火山方舟控制台创建推理接入点后获取）。');
        } else if (err.code === 'HTTP') {
            addMessage('system', err.message);
            if (err.message.indexOf('401') === -1 && err.message.indexOf('429') === -1) {
                showSettings();
            }
        } else {
            addMessage('system', '网络连接失败或接口不可达，请检查网络与接口地址后重试。');
        }
    }

    // ---- 设置弹窗 ----

    function showSettings() {
        els.aiKey.value = settings.apiKey || '';
        els.aiModel.value = settings.model || '';
        els.aiEndpoint.value = settings.endpoint || EMT.CHAT.defaultEndpoint;
        els.aiModal.classList.add('open');
    }

    function hideSettings() {
        els.aiModal.classList.remove('open');
    }

    /** 保存并测试连接 */
    async function handleSaveSettings() {
        settings.apiKey = els.aiKey.value.trim();
        settings.model = els.aiModel.value.trim();
        settings.endpoint = els.aiEndpoint.value.trim() || EMT.CHAT.defaultEndpoint;
        saveSettings();

        if (!settings.apiKey || !settings.model) {
            EMT.UI.toast('请填写 API Key 与模型 ID', 'warn');
            return;
        }

        // 测试连接：发送最小请求
        els.aiSave.disabled = true;
        els.aiSave.textContent = '测试中...';
        try {
            const res = await fetch(settings.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + settings.apiKey
                },
                body: JSON.stringify({
                    model: settings.model,
                    messages: [
                        { role: 'system', content: '你是一个连接测试助手。' },
                        { role: 'user', content: '请只回复四个字：连接成功' }
                    ],
                    max_tokens: 20
                })
            });
            if (res.ok) {
                EMT.UI.toast('连接成功，牛顿爵士已就位', 'success');
                hideSettings();
                close();
                open();
            } else if (res.status === 401) {
                EMT.UI.toast('连接失败：API Key 无效', 'warn');
            } else {
                EMT.UI.toast(`连接失败（HTTP ${res.status}），请检查配置`, 'warn');
            }
        } catch (e) {
            EMT.UI.toast('连接失败：网络错误或接口不可达', 'warn');
        } finally {
            els.aiSave.disabled = false;
            els.aiSave.textContent = '保存并测试连接';
        }
    }

    // ---- 输入框自适应高度 ----

    function autoGrowInput() {
        els.chatInput.style.height = 'auto';
        els.chatInput.style.height = Math.min(els.chatInput.scrollHeight, 96) + 'px';
    }

    // ---- 初始化 ----

    function init() {
        cacheDom();
        loadSettings();
        loadHistory();
        renderQuick();

        els.chatBtn.addEventListener('click', () => {
            open();
            els.chatBtn.classList.remove('new');
            try { localStorage.setItem(LS_HINT, '1'); } catch (e) { /* 忽略 */ }
        });
        els.chatClose.addEventListener('click', close);
        els.chatOpenSettings.addEventListener('click', (e) => { e.stopPropagation(); showSettings(); });
        els.chatSend.addEventListener('click', send);
        els.aiSave.addEventListener('click', handleSaveSettings);
        els.aiCancel.addEventListener('click', hideSettings);
        els.aiModal.addEventListener('click', (e) => {
            if (e.target === els.aiModal) hideSettings();
        });

        els.chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                send();
            }
        });
        els.chatInput.addEventListener('input', autoGrowInput);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                hideSettings();
                if (els.chatPanel.classList.contains('open')) close();
            }
        });

        // 首次访问给悬浮按钮加提示光圈
        let hintShown = false;
        try { hintShown = !!localStorage.getItem(LS_HINT); } catch (e) { /* 忽略 */ }
        if (!hintShown) els.chatBtn.classList.add('new');
    }

    EMT.Chat = {
        init: init,
        open: open,
        close: close,
        toggle: toggle,
        send: send
    };
})(window);
