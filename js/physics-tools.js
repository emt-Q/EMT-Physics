/**
 * 物理文本分析工具（纯函数模块，无 DOM 依赖，可在 Node 中直接测试）
 * ------------------------------------------------------------
 *  - 文本归一化
 *  - 物理相关性判定（关键词得分 + 物理单位强信号）
 *  - 仿真实验匹配
 */
(function (global) {
    'use strict';

    const EMT = global.EMT = global.EMT || {};

    /** 归一化：转小写 + 去除所有空白 */
    function normalize(text) {
        return String(text || '').toLowerCase().replace(/\s+/g, '');
    }

    /** 物理单位正则：数字+单位 是物理内容的强信号 */
    const UNIT_PATTERN = /(\d+(?:\.\d+)?\s*(?:kg|m\/s2|m\/s²|m\/s|km\/h|cm\/s|N|J|W|V|A|Ω|ohm|Hz|Pa|kPa|kWh|kJ|°C|℃|mol)\b)/i;

    /**
     * 关键词命中判断：
     *  - 纯英文关键词使用词边界，在"保留空格"的原文上匹配
     *    （归一化去空格会导致 explain newton 变成 explainnewton，词边界失效）
     *  - 中文关键词在去空格后的归一化文本上直接包含匹配（OCR 常在汉字间插入杂散空格）
     */
    function keywordHit(normText, spaceText, keyword) {
        const k = String(keyword).toLowerCase();
        if (!k) return false;
        if (/^[a-z\s]+$/.test(k)) {
            const escaped = k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            return new RegExp('\\b' + escaped + '\\b').test(spaceText);
        }
        return normText.includes(k);
    }

    /**
     * 判定文本是否与物理相关。
     * 规则：强关键词任一命中 → 物理；
     *       否则 关键词命中数 + (含物理单位 ? 1 : 0) >= 2 → 物理。
     * 说明：单独的物理单位不足以判定（避免"大米10kg"之类的误判），
     *       需与至少一个物理关键词叠加，或两个以上关键词共同命中。
     */
    function detectPhysics(text) {
        const raw = String(text || '');
        const norm = normalize(raw);
        if (!norm) return false;
        const spaceText = raw.toLowerCase();

        if (EMT.PHYSICS_STRONG_KEYWORDS.some(k => keywordHit(norm, spaceText, k))) {
            return true;
        }

        let score = 0;
        for (const k of EMT.PHYSICS_KEYWORDS) {
            if (keywordHit(norm, spaceText, k)) score += 1;
        }
        if (UNIT_PATTERN.test(raw)) score += 1;
        return score >= 2;
    }

    /** 匹配仿真实验，返回实验对象或 null */
    function matchSim(text) {
        const norm = normalize(text);
        if (!norm) return null;
        const spaceText = String(text).toLowerCase();
        return EMT.PHYSICS_SIMS.find(s =>
            s.keywords.some(k => keywordHit(norm, spaceText, k))
        ) || null;
    }

    EMT.PhysicsTools = {
        normalize: normalize,
        keywordHit: keywordHit,
        detectPhysics: detectPhysics,
        matchSim: matchSim
    };
})(typeof window !== 'undefined' ? window : globalThis);
