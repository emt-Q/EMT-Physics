/**
 * EMT Physics – 全局配置
 * ------------------------------------------------------------
 * 所有可配置的数据集中于此。
 *  - 新增物理仿真实验：向 EMT.PHYSICS_SIMS 追加条目
 *  - 调整"物理相关性"判定：修改 EMT.PHYSICS_KEYWORDS / EMT.PHYSICS_STRONG_KEYWORDS
 *  - 配置 AI 助手（艾萨克牛顿爵士）：修改 EMT.CHAT
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
            keywords: ['单摆', '摆长', '简谐', '摆', 'pendulum', 'harmonic', 'simple harmonic'],
            url: 'https://phet.colorado.edu/sims/html/pendulum-lab/latest/pendulum-lab_zh_CN.html'
        },
        {
            name: '电路模拟器 / Circuit Construction Kit',
            keywords: ['电阻', '电流', '电压', '欧姆', '欧姆定律', '电路', '串联', '并联', '安培', '伏特', 'circuit', 'resistance', 'current', 'voltage', 'ohm', 'ampere'],
            url: 'https://phet.colorado.edu/sims/html/circuit-construction-kit-dc/latest/circuit-construction-kit-dc_zh_CN.html'
        },
        {
            name: '力与运动 / Forces and Motion: Basics',
            keywords: ['牛顿第一定律', '牛顿第二定律', '牛顿第三定律', '摩擦力', '合力', '受力分析', '力与运动', 'force', 'friction', 'motion', 'net force'],
            url: 'https://phet.colorado.edu/sims/html/forces-and-motion-basics/latest/forces-and-motion-basics_zh_CN.html'
        },
        {
            name: '能量滑板竞技场 / Energy Skate Park: Basics',
            keywords: ['动能', '势能', '机械能', '能量守恒', '滑板', 'energy', 'kinetic', 'potential', 'mechanical energy', 'skate'],
            url: 'https://phet.colorado.edu/sims/html/energy-skate-park-basics/latest/energy-skate-park-basics_zh_CN.html'
        },
        {
            name: '绳上波动 / Wave on a String',
            keywords: ['绳波', '横波', '波长', '振幅', '波形', '波动', 'wave', 'wavelength', 'amplitude', 'transverse', 'frequency'],
            url: 'https://phet.colorado.edu/sims/html/wave-on-a-string/latest/wave-on-a-string_zh_CN.html'
        },
        {
            name: '抛体运动 / Projectile Motion',
            keywords: ['抛体', '平抛', '斜抛', '抛物线', 'projectile', 'trajectory', 'launch'],
            url: 'https://phet.colorado.edu/sims/html/projectile-motion/latest/projectile-motion_zh_CN.html'
        },
        {
            name: '电容实验室 / Capacitor Lab: Basics',
            keywords: ['电容', '电容器', '平行板', 'capacitor', 'capacitance', 'plate'],
            url: 'https://phet.colorado.edu/sims/html/capacitor-lab-basics/latest/capacitor-lab-basics_zh_CN.html'
        },
        {
            name: '万有引力 / Gravity Force Lab',
            keywords: ['万有引力', '引力', 'gravitational', 'gravity', 'gravitation'],
            url: 'https://phet.colorado.edu/sims/html/gravity-force-lab/latest/gravity-force-lab_zh_CN.html'
        },
        {
            name: '浮力实验 / Buoyancy',
            keywords: ['浮力', '阿基米德', 'buoyancy', 'archimedes', 'displaced'],
            url: 'https://phet.colorado.edu/sims/html/buoyancy/latest/buoyancy_en.html'
        },
        {
            name: '能量形式与转化 / Energy Forms and Changes',
            keywords: ['能量转化', '能量形式', '热传递', '热传导', '内能', 'conduction', 'convection', 'radiation', 'energy forms'],
            url: 'https://phet.colorado.edu/sims/html/energy-forms-and-changes/latest/energy-forms-and-changes_zh_CN.html'
        },
        {
            name: '流体压强 / Under Pressure',
            keywords: ['压强', '流体', '液体压强', '深度', 'pressure', 'fluid', 'hydrostatic'],
            url: 'https://phet.colorado.edu/sims/html/under-pressure/latest/under-pressure_zh_CN.html'
        },
        {
            name: '引力与轨道 / Gravity and Orbits',
            keywords: ['轨道', '公转', '卫星', '行星', '开普勒', 'orbit', 'satellite', 'planet', 'kepler'],
            url: 'https://phet.colorado.edu/sims/html/gravity-and-orbits/latest/gravity-and-orbits_zh_CN.html'
        }
    ];

    /** 物理相关性关键词库（通用物理术语，命中计入得分） */
    EMT.PHYSICS_KEYWORDS = [
        // 力学
        '力学', '单摆', '摆长', '简谐', '牛顿', '惯性', '质量', '重力', '摩擦力', '弹力', '浮力', '压力', '压强',
        '密度', '张力', '引力', '向心力', '离心力', '合力', '作用力', '反作用力', '动量', '冲量', '动能', '势能',
        '机械能', '能量守恒', '功', '功率', '速度', '加速度', '位移', '匀速', '匀加速', '匀变速', '自由落体', '抛体',
        '抛物线', '圆周运动', '角速度', '杠杆', '滑轮', '力矩', '碰撞', '守恒', '弹性', '弹簧', '振幅', '周期',
        '频率', '振动', '机械波', '受力分析', '牛顿定律', '牛顿第一定律', '牛顿第二定律', '牛顿第三定律', '动量守恒',
        // 电学
        '电学', '电荷', '电场', '电流', '电压', '电阻', '欧姆', '欧姆定律', '电路', '串联', '并联', '电容', '电容器',
        '电磁', '磁场', '磁感应', '感应电流', '电磁感应', '变压器', '导线', '安培', '伏特', '库仑', '电功率', '焦耳',
        '导体', '绝缘体', '电势', '电功', '电热', '交流电', '直流电', '静电', '短路', '电源', '电表',
        // 光学
        '光学', '光的反射', '光的折射', '反射', '折射', '透镜', '凸透镜', '凹透镜', '焦距', '成像', '实像', '虚像',
        '色散', '衍射', '干涉', '光谱', '光速', '平面镜', '光路', '入射角', '反射角',
        // 热学
        '热学', '温度', '热量', '比热', '比热容', '热传递', '热传导', '热对流', '热辐射', '内能', '熔化', '凝固',
        '汽化', '液化', '升华', '凝华', '热机', '理想气体', '热胀冷缩', '分子动理论', '扩散', '熔点', '沸点',
        // 近代物理
        '量子', '光子', '光电效应', '相对论', '原子', '原子核', '核能', '放射性', '衰变', '波粒二象性', '质能', '跃迁', '能级',
        // 英文
        'physics', 'force', 'motion', 'velocity', 'acceleration', 'displacement', 'mass', 'gravity', 'friction',
        'momentum', 'impulse', 'energy', 'kinetic', 'potential', 'work', 'power', 'newton', 'inertia', 'pendulum',
        'spring', 'pressure', 'density', 'buoyancy', 'lever', 'torque', 'projectile', 'collision', 'charge',
        'current', 'voltage', 'resistance', 'ohm', 'circuit', 'capacitor', 'electric', 'magnetic',
        'electromagnetic', 'induction', 'lens', 'refraction', 'reflection', 'focal', 'diffraction',
        'interference', 'heat', 'temperature', 'entropy', 'quantum', 'photon', 'relativity', 'atom', 'nuclear',
        'radioactive', 'wave', 'frequency', 'amplitude', 'wavelength', 'inclined', 'diode', 'conductor', 'insulator'
    ];

    /** 强物理关键词（无歧义地指向物理内容，单独命中即判定为物理题） */
    EMT.PHYSICS_STRONG_KEYWORDS = [
        '单摆', '简谐', '欧姆', '欧姆定律', '电流', '电压', '电阻', '电路', '串联', '并联', '摩擦力', '动能', '势能',
        '机械能', '加速度', '牛顿', '动量', '冲量', '浮力', '电容', '电磁', '引力', '光子', '量子', '折射', '透镜',
        '焦距', '光速', '功率', '做功', '匀加速', '自由落体', '抛体', '圆周运动', '万有引力', '电磁感应', '理想气体',
        '波粒二象性', '光电效应', '平抛', '斜抛', '安培', '库仑', '焦耳', '伏特', '阿基米德', '受力分析', '牛顿定律',
        '牛顿第一定律', '牛顿第二定律', '牛顿第三定律', '动量守恒', '能量守恒', '电荷', '电场', '磁场', '内能', '比热容',
        '热传递', '核能', '放射性', '衰变', '相对论', '角速度', '向心力', '离心力', '杠杆', '滑轮', '力矩', '密度',
        '压强', '弹簧', '振幅', '波长', 'energy', 'force', 'gravity', 'velocity', 'acceleration', 'momentum',
        'impulse', 'kinetic', 'potential', 'circuit', 'voltage', 'resistance', 'current', 'ohm', 'pendulum',
        'buoyancy', 'capacitor', 'quantum', 'photon', 'refraction', 'lens', 'focal', 'wavelength', 'frequency',
        'amplitude', 'induction', 'newton', 'work', 'power', 'entropy', 'projectile', 'collision', 'torque', 'friction'
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

    /** AI 助手（艾萨克牛顿爵士）配置 */
    EMT.CHAT = {
        defaultEndpoint: 'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
        defaultModel: '',  // 由用户在设置中填写自己的方舟 Model ID
        maxHistory: 12,    // 保留的最大对话条数
        maxTokens: 1200,   // 单次回答的最大 token 数
        temperature: 0.7,
        quickQuestions: [
            '什么是牛顿第二定律？',
            '欧姆定律怎么用？',
            '单摆的周期和什么有关？',
            '动能和势能有什么区别？'
        ],
        systemPrompt: [
            '你是艾萨克·牛顿爵士（Sir Isaac Newton），英国物理学家、数学家与天文学家，经典力学的奠基人，',
            '正以虚拟导师的身份陪伴 EMT Physics 平台上的物理学习者。',
            '回答要求：',
            '1. 使用简体中文回答，语气严谨而亲切，可适度使用"依我之见""颇为有趣"等学者口吻，但必须通俗易懂；',
            '2. 优先用生活中的类比和简单示例解释物理概念，鼓励学习者动手实验、保持好奇；',
            '3. 涉及公式时，先说明物理意义，再给出公式；',
            '4. 若问题与物理无关，礼貌地将话题引导回物理；',
            '5. 不知道的内容要诚实说明，绝不编造；',
            '6. 单次回答控制在 300 字以内。'
        ].join('\n')
    };
})(typeof window !== 'undefined' ? window : globalThis);
