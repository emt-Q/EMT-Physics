/**
 * EMT Physics – 全局配置
 * ------------------------------------------------------------
 * 所有可配置的数据集中于此。新增物理仿真实验时，只需在
 * EMT.PHYSICS_SIMS 数组中追加条目，无需改动其他代码。
 */
(function (global) {
    'use strict';

    const EMT = global.EMT = global.EMT || {};

    /** 打字机动画参数 */
    EMT.config = {
        mission: "Helping more physics beginners access equitable educational opportunities.",
        typeSpeed: 80,     // 打字速度（毫秒/字符）
        deleteSpeed: 40,   // 删除速度（毫秒/字符）
        pauseTime: 3000    // 完整显示后的停顿时间（毫秒）
    };

    /** 物理仿真实验库：关键词命中后匹配对应 PhET 实验 */
    EMT.PHYSICS_SIMS = [
        {
            name: '单摆实验室 / Pendulum Lab',
            keywords: ['单摆', '摆长', '周期', '简谐', 'pendulum', 'length', 'period', 'harmonic'],
            url: 'https://phet.colorado.edu/sims/html/pendulum-lab/latest/pendulum-lab_zh_CN.html'
        },
        {
            name: '电路模拟器 / Circuit Construction Kit',
            keywords: ['电阻', '电流', '电压', '欧姆', 'circuit', 'resistance', 'current', 'voltage', 'ohm'],
            url: 'https://phet.colorado.edu/sims/html/circuit-construction-kit-dc/latest/circuit-construction-kit-dc_zh_CN.html'
        }
    ];

    /** 物理探索激励语录（{name} 会被替换为探究者姓名） */
    EMT.ENCOURAGEMENTS = [
        "恭喜 {name} 踏上了一片新的物理陆地！🌍",
        "伟大的发现往往源于 {name} 的一次尝试。",
        "物理世界的大门已为 {name} 敞开，真理在等待。",
        "保持好奇心，{name}，你正在追随牛顿的脚步。",
        "每一次模拟，都是 {name} 与宇宙法则的对话。",
        "{name}，愿你的求知欲像熵增一样不可逆转！",
        "这一刻，{name} 离万物之理又近了一步。"
    ];
})(window);
