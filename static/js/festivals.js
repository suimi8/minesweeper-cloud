/**
 * Global Adaptive Festival Theme System
 * 全局节日主题自适应系统 (核心JS逻辑)
 * 
 * 功能：
 * 1. 自动检测当前日期是否对应的节日
 * 2. 也是农历节日支持 (2025-2028 硬编码映射)
 * 3. 自动应用 CSS 变量主题
 * 4. 提供用户手动覆盖/预览接口
 */

(function (window, document) {
    'use strict';

    // 配置：节日日期映射
    // 农历节日需每年单独配置 (为了性能不引入庞大的农历库)
    const LUNAR_FESTIVALS = {
        2025: {
            'spring_festival': { start: '01-28', end: '02-04' },   // 春节
            'dragon_boat': { start: '05-31', end: '06-02' },   // 端午
            'mid_autumn': { start: '10-06', end: '10-08' }    // 中秋
        },
        2026: {
            'spring_festival': { start: '02-14', end: '02-24' },   // 春节 (与情人节重叠，处理优先级)
            'dragon_boat': { start: '06-18', end: '06-20' },   // 端午
            'mid_autumn': { start: '09-24', end: '09-26' }    // 中秋
        },
        2027: {
            'spring_festival': { start: '02-05', end: '02-12' },   // 春节
            'dragon_boat': { start: '06-08', end: '06-10' },   // 端午
            'mid_autumn': { start: '09-14', end: '09-16' }    // 中秋
        },
        2028: {
            'spring_festival': { start: '01-25', end: '02-01' },   // 春节
            'dragon_boat': { start: '05-27', end: '05-29' },   // 端午
            'mid_autumn': { start: '10-02', end: '10-04' }    // 中秋
        }
    };

    // 公历固定节日
    const SOLAR_FESTIVALS = [
        { id: 'new_year', name: '元旦', start: '01-01', end: '01-03', priority: 10 },
        { id: 'valentine', name: '情人节', start: '02-14', end: '02-14', priority: 100 }, // 高优先级于春节
        { id: 'qingming', name: '清明节', start: '04-04', end: '04-06', priority: 10 },
        { id: 'labor_day', name: '劳动节', start: '05-01', end: '05-05', priority: 10 },
        { id: 'national_day', name: '国庆节', start: '10-01', end: '10-07', priority: 10 },
        { id: 'christmas', name: '圣诞节', start: '12-24', end: '12-26', priority: 10 }
    ];

    const STORAGE_KEY_AUTO = 'linuxdo_festival_auto'; // 'true' or 'false'
    const STORAGE_KEY_PREVIEW = 'linuxdo_festival_preview'; // session-based override

    // 辅助：日期格式化 MM-DD
    function formatDate(date) {
        const m = (date.getMonth() + 1).toString().padStart(2, '0');
        const d = date.getDate().toString().padStart(2, '0');
        return `${m}-${d}`;
    }

    // 核心管理器
    const Festivals = {
        activeThemeId: null,
        STANDARD_THEMES: ['light', 'dark', 'system', 'cyberpunk', 'emerald', 'sunset', 'sea', 'volcano'],

        // 初始化
        init: function () {
            // 读取后端渲染的主题设置
            const currentTheme = document.documentElement.getAttribute('data-site-theme');
            console.log(`[System] Init Theme: ${currentTheme}`);

            // 逻辑分叉：自动托管 vs 强制指定
            if (!currentTheme || currentTheme === 'system') {
                // 模式 A: 自动托管 (System/Auto)
                this.checkAndApply();
                // 监听 visibility change 以防跨夜
                document.addEventListener('visibilitychange', () => {
                    if (!document.hidden) this.checkAndApply();
                });
            } else {
                // 模式 B: 强制指定 (Manual)
                if (this.isFestival(currentTheme)) {
                    // 节日主题：触发副作用 (隐藏Canvas, 显示祝福)
                    this.applyTheme(currentTheme, 'Manual Setting');
                } else {
                    // 普通主题：确保 Canvas 可见
                    const canvas = document.querySelector('canvas');
                    if (canvas) {
                        canvas.style.opacity = '1';
                        canvas.style.pointerEvents = 'auto';
                    }
                    console.log(`[System] Keeping manual standard theme: ${currentTheme}`);
                }
            }
            console.log('[System] Festival Theme Manager initialized.');
        },

        // 判断是否为节日主题 ID
        isFestival: function (id) {
            return id && !this.STANDARD_THEMES.includes(id);
        },

        // 检查并应用主题（仅在 System 模式下调用）
        checkAndApply: function () {
            const festival = this.detectFestival(new Date());
            if (festival) {
                this.applyTheme(festival.id, `Auto-Detected: ${festival.name}`);
            } else {
                // 没有节日，恢复默认状态 (Canvas可见)
                const canvas = document.querySelector('canvas');
                if (canvas) {
                    canvas.style.opacity = '1';
                    canvas.style.pointerEvents = 'auto';
                }
            }
        },

        // 检测当前日期对应的节日
        detectFestival: function (date) {
            const dateStr = formatDate(date);
            const year = date.getFullYear();

            let candidates = [];

            // 1. 检查公历
            SOLAR_FESTIVALS.forEach(f => {
                if (dateStr >= f.start && dateStr <= f.end) {
                    candidates.push(f);
                }
            });

            // 2. 检查农历
            const lunarConfig = LUNAR_FESTIVALS[year];
            if (lunarConfig) {
                for (const [id, range] of Object.entries(lunarConfig)) {
                    if (dateStr >= range.start && dateStr <= range.end) {
                        candidates.push({
                            id: id,
                            name: id, 
                            priority: id === 'spring_festival' ? 50 : 20
                        });
                    }
                }
            }

            if (candidates.length === 0) return null;

            // 按优先级排序
            candidates.sort((a, b) => b.priority - a.priority);
            return candidates[0];
        },

        // 应用主题
        applyTheme: function (themeId, reason) {
            console.log(`[System] Applying Festival Theme: ${themeId} (${reason})`);

            // 同时设置 html 和 body 以确保覆盖
            document.documentElement.setAttribute('data-theme', themeId);
            document.body.setAttribute('data-theme', themeId);

            this.activeThemeId = themeId;

            // 1. 强制通知系统更新 (解决 Three.js 颜色不刷新问题)
            if (typeof window.updateThemeColor === 'function') {
                window.updateThemeColor();
            }

            // 2. 处理背景冲突：如果是节日主题（有背景图），隐藏 Three.js Canvas
            const isFestival = this.isFestival(themeId);

            const canvas = document.querySelector('canvas');
            if (canvas) {
                if (isFestival) {
                    canvas.style.transition = 'opacity 0.5s ease';
                    canvas.style.opacity = '0';
                    canvas.style.pointerEvents = 'none'; // 防止遮挡交互
                } else {
                    canvas.style.opacity = '1';
                    canvas.style.pointerEvents = 'auto';
                }
            }

            // 3. 触发 Toast 通知
            if (window.showLiveToast && reason.includes('Auto')) {
                const key = 'festival_toast_shown_' + themeId;
                if (!window.sessionStorage.getItem(key)) {
                    const names = {
                        'new_year': '元旦', 'spring_festival': '春节', 'valentine': '情人节',
                        'qingming': '清明', 'labor_day': '劳动节', 'dragon_boat': '端午节',
                        'mid_autumn': '中秋节', 'national_day': '国庆节', 'christmas': '圣诞节'
                    };
                    const name = names[themeId] || '节日';
                    window.showLiveToast(`🎉 ${name}快乐！已为您启用节日限定主题`);
                    window.sessionStorage.setItem(key, 'true');
                }
            }

            // 4. 触发节日弹窗祝福 (仅一次)
            this.showGreeting(themeId);
        },

        // 移除废弃的装饰逻辑 (已整合进 CSS 背景)
        addDecorations: function () { },
        removeDecorations: function () { },

        // 显示节日祝福弹窗
        showGreeting: function (themeId) {
            const key = `greeting_shown_${themeId}_${new Date().getFullYear()}`;
            if (sessionStorage.getItem(key)) return;

            const content = this.getGreetingContent(themeId);
            if (!content) return;

            // 创建 Modal DOM
            const overlay = document.createElement('div');
            overlay.className = 'festival-modal-overlay';
            overlay.id = 'festivalModal';

            overlay.innerHTML = `
                <div class="festival-modal-content">
                    <button class="festival-modal-close" onclick="this.closest('.festival-modal-overlay').remove()">×</button>
                    <div class="festival-modal-text">
                        <div class="festival-modal-title">${content.title}</div>
                        <div class="festival-modal-body">${content.body}</div>
                        <button class="festival-btn" onclick="this.closest('.festival-modal-overlay').remove()">${content.btn}</button>
                    </div>
                </div>
            `;

            document.body.appendChild(overlay);

            // 动画入场
            requestAnimationFrame(() => {
                overlay.classList.add('active');
            });

            sessionStorage.setItem(key, 'true');
        },

        getGreetingContent: function (themeId) {
            const map = {
                'spring_festival': {
                    title: '🦄 恭贺新禧 · 马到成功',
                    body: '积分商城祝您：<br>新春快乐，阖家幸福！<br>代码无Bug，上线零故障。<br>愿您在开源的道路上越走越远！',
                    btn: '🧧 领取好运'
                },
                'new_year': {
                    title: '🎉 元旦快乐',
                    body: '新的一年，新的开始！<br>愿您的技术更上一层楼，<br>所有的 Flag 都能屹立不倒！',
                    btn: '🚀 开启 2026'
                },
                'valentine': {
                    title: '💖 情人节快乐',
                    body: '愿所有的 Bug 都能被温柔以待，<br>愿所有的提交都能被顺利合并。<br>代码与爱，缺一不可。',
                    btn: '🌹 接受爱意'
                },
                'qingming': {
                    title: '🌿 清明安康',
                    body: '春风拂柳，细雨纷纷。<br>缅怀过去，珍惜当下。<br>愿内心清明，岁月安好。',
                    btn: '🍃 踏青去'
                },
                'labor_day': {
                    title: '🛠️ 劳动节快乐',
                    body: '致敬每一位在代码世界耕耘的开发者！<br>只有辛勤的键盘敲击，<br>才能构建出伟大的数字世界。',
                    btn: '🥤 犒劳自己'
                },
                'dragon_boat': {
                    title: '🐲 端午安康',
                    body: '粽叶飘香，龙舟竞渡。<br>无论甜粽还是咸粽，<br>祝您身体健康，万事“粽”意！',
                    btn: '🛶 乘风破浪'
                },
                'mid_autumn': {
                    title: '🥮 中秋团圆',
                    body: '海上生明月，天涯共此时。<br>无论身在何处，<br>我们与您同在，共赏一轮月。',
                    btn: '🌕 但愿人长久'
                },
                'national_day': {
                    title: '🇨🇳 国庆快乐',
                    body: '盛世华诞，举国同庆。<br>愿祖国繁荣昌盛，<br>愿您的生活如代码般逻辑严密，运行流畅！',
                    btn: '🎈 欢度佳节'
                },
                'christmas': {
                    title: '🎄 Merry Christmas',
                    body: '愿您的圣诞充满温馨与喜悦！<br>May your code be merry and bright,<br>and your deploy be silent night.',
                    btn: '🎅 Ho Ho Ho'
                }
            };
            return map[themeId] || null;
        }
    };

    // 暴露全局 API
    window.Festivals = Festivals;

    // 自动启动
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => Festivals.init());
    } else {
        Festivals.init();
    }

})(window, document);
