/* =================================================================
   二十四节气 · 天文计算引擎 + SVG 可视化
   基于 Jean Meeus《Astronomical Algorithms》的太阳黄经计算
   ================================================================= */

// ============================
//  第一部分：节气数据定义
// ============================

const SOLAR_TERMS = [
    { name: '立春', lon: 315, approxM: 2, approxD: 4,
      desc: '东风解冻，万物复苏，一年之始',
      pentads: ['东风解冻', '蛰虫始振', '鱼陟负冰'] },
    { name: '雨水', lon: 330, approxM: 2, approxD: 19,
      desc: '冰雪消融，降水渐增，草木萌动',
      pentads: ['獭祭鱼', '鸿雁来', '草木萌动'] },
    { name: '惊蛰', lon: 345, approxM: 3, approxD: 6,
      desc: '春雷始鸣，蛰虫惊醒，桃花初绽',
      pentads: ['桃始华', '仓庚鸣', '鹰化为鸠'] },
    { name: '春分', lon: 0,   approxM: 3, approxD: 21,
      desc: '昼夜等分，玄鸟至，雷乃发声',
      pentads: ['玄鸟至', '雷乃发声', '始电'] },
    { name: '清明', lon: 15,  approxM: 4, approxD: 5,
      desc: '气清景明，万物皆显，虹始见',
      pentads: ['桐始华', '田鼠化为鴽', '虹始见'] },
    { name: '谷雨', lon: 30,  approxM: 4, approxD: 20,
      desc: '雨生百谷，萍始生，播种希望',
      pentads: ['萍始生', '鸣鸠拂羽', '戴胜降于桑'] },
    { name: '立夏', lon: 45,  approxM: 5, approxD: 6,
      desc: '夏之始也，蝼蝈鸣，万物并秀',
      pentads: ['蝼蝈鸣', '蚯蚓出', '王瓜生'] },
    { name: '小满', lon: 60,  approxM: 5, approxD: 21,
      desc: '物致于此，小得盈满，麦秋将至',
      pentads: ['苦菜秀', '靡草死', '麦秋至'] },
    { name: '芒种', lon: 75,  approxM: 6, approxD: 6,
      desc: '有芒之谷可稼种，螳螂始生',
      pentads: ['螳螂生', '鵙始鸣', '反舌无声'] },
    { name: '夏至', lon: 90,  approxM: 6, approxD: 21,
      desc: '日北至，日长之至，一阴始生',
      pentads: ['鹿角解', '蜩始鸣', '半夏生'] },
    { name: '小暑', lon: 105, approxM: 7, approxD: 7,
      desc: '暑为炎热，小者未极，温风至',
      pentads: ['温风至', '蟋蟀居宇', '鹰始鸷'] },
    { name: '大暑', lon: 120, approxM: 7, approxD: 23,
      desc: '炎热至极，腐草为萤，大雨时行',
      pentads: ['腐草为萤', '土润溽暑', '大雨时行'] },
    { name: '立秋', lon: 135, approxM: 8, approxD: 7,
      desc: '秋之始也，凉风至，一叶知秋',
      pentads: ['凉风至', '白露降', '寒蝉鸣'] },
    { name: '处暑', lon: 150, approxM: 8, approxD: 23,
      desc: '暑气至此而止，天地始肃',
      pentads: ['鹰乃祭鸟', '天地始肃', '禾乃登'] },
    { name: '白露', lon: 165, approxM: 9, approxD: 8,
      desc: '阴气渐重，露凝而白，鸿雁来',
      pentads: ['鸿雁来', '玄鸟归', '群鸟养羞'] },
    { name: '秋分', lon: 180, approxM: 9, approxD: 23,
      desc: '昼夜等分，雷始收声，水始涸',
      pentads: ['雷始收声', '蛰虫坯户', '水始涸'] },
    { name: '寒露', lon: 195, approxM: 10, approxD: 8,
      desc: '露气寒冷，将凝结也，菊有黄华',
      pentads: ['鸿雁来宾', '雀入大水为蛤', '菊有黄华'] },
    { name: '霜降', lon: 210, approxM: 10, approxD: 23,
      desc: '气肃而凝，露结为霜，草木黄落',
      pentads: ['豺乃祭兽', '草木黄落', '蛰虫咸俯'] },
    { name: '立冬', lon: 225, approxM: 11, approxD: 7,
      desc: '冬之始也，水始冰，地始冻',
      pentads: ['水始冰', '地始冻', '雉入大水为蜃'] },
    { name: '小雪', lon: 240, approxM: 11, approxD: 22,
      desc: '雨下而为寒气所薄，凝而为雪',
      pentads: ['虹藏不见', '天气上升', '闭塞而成冬'] },
    { name: '大雪', lon: 255, approxM: 12, approxD: 7,
      desc: '大者盛也，至此而雪盛矣',
      pentads: ['鹖鴠不鸣', '虎始交', '荔挺出'] },
    { name: '冬至', lon: 270, approxM: 12, approxD: 22,
      desc: '日南至，日短之至，一阳始生',
      pentads: ['蚯蚓结', '麋角解', '水泉动'] },
    { name: '小寒', lon: 285, approxM: 1, approxD: 5,
      desc: '冷气积久而为寒，小者未极',
      pentads: ['雁北乡', '鹊始巢', '雉始鸲'] },
    { name: '大寒', lon: 300, approxM: 1, approxD: 20,
      desc: '寒气之逆极，水泽腹坚',
      pentads: ['鸡始乳', '征鸟厉疾', '水泽腹坚'] }
];

function getSeason(lon) {
    if (lon >= 315 || lon < 45)  return 'spring';
    if (lon >= 45  && lon < 135) return 'summer';
    if (lon >= 135 && lon < 225) return 'autumn';
    return 'winter';
}

// ============================
//  第二部分：天文计算
// ============================

/**
 * 计算儒略日 (Julian Day)
 */
function getJD(year, month, day, hour, minute, second) {
    hour   = hour   || 12;
    minute = minute || 0;
    second = second || 0;
    if (month <= 2) { year -= 1; month += 12; }
    const A = Math.floor(year / 100);
    const B = 2 - A + Math.floor(A / 4);
    const dayFrac = (hour + minute / 60 + second / 3600) / 24;
    return Math.floor(365.25 * (year + 4716))
         + Math.floor(30.6001 * (month + 1))
         + day + dayFrac + B - 1524.5;
}

/**
 * 儒略日转公历
 */
function jdToCalendar(jd) {
    const Z = Math.floor(jd + 0.5);
    const F = jd + 0.5 - Z;
    let A = Z;
    if (Z >= 2299161) {
        const alpha = Math.floor((Z - 1867216.25) / 36524.25);
        A = Z + 1 + alpha - Math.floor(alpha / 4);
    }
    const B = A + 1524;
    const C = Math.floor((B - 122.1) / 365.25);
    const D = Math.floor(365.25 * C);
    const E = Math.floor((B - D) / 30.6001);
    const day = B - D - Math.floor(30.6001 * E) + F;
    let month = E - 1;
    if (month > 12) month -= 12;
    let year = C - 4716;
    if (month <= 2) year -= 1;
    const d = Math.floor(day);
    const frac = day - d;
    const totalMin = Math.round(frac * 24 * 60);
    return { year, month, day: d, hour: Math.floor(totalMin / 60), minute: totalMin % 60 };
}

/**
 * 太阳视黄经 (Meeus 简化算法, 精度 < 0.01°)
 */
function getSunLongitude(jd) {
    const T = (jd - 2451545.0) / 36525.0;
    let L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
    let M  = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
    L0 = ((L0 % 360) + 360) % 360;
    M  = ((M  % 360) + 360) % 360;
    const Mrad = M * Math.PI / 180;
    const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mrad)
            + (0.019993 - 0.000101 * T) * Math.sin(2 * Mrad)
            + 0.000289 * Math.sin(3 * Mrad);
    const trueLon = L0 + C;
    const omega = 125.04 - 1934.136 * T;
    const lambda = trueLon - 0.00569 - 0.00478 * Math.sin(omega * Math.PI / 180);
    return ((lambda % 360) + 360) % 360;
}

/**
 * 判断黄经是否穿越目标值（处理 0°/360° 环绕）
 */
function crossed(lon1, lon2, target) {
    if (lon1 <= lon2) return lon1 <= target && target <= lon2;
    return target >= lon1 || target <= lon2;
}

/**
 * 二分法求解太阳到达指定黄经的精确时刻
 */
function findSolarTermJD(year, targetLon, approxM, approxD) {
    const startJD = getJD(year, approxM, approxD) - 4;
    let jdLow = null, jdHigh = null, lonLow = null;
    for (let d = 0; d <= 8; d++) {
        const jd = startJD + d;
        const lon = getSunLongitude(jd);
        if (jdLow !== null && crossed(lonLow, lon, targetLon)) { jdHigh = jd; break; }
        jdLow = jd; lonLow = lon;
    }
    if (jdHigh === null) return startJD + 4;
    for (let i = 0; i < 30; i++) {
        const jdMid = (jdLow + jdHigh) / 2;
        const lonMid = getSunLongitude(jdMid);
        if (crossed(lonLow, lonMid, targetLon)) { jdHigh = jdMid; }
        else { jdLow = jdMid; lonLow = lonMid; }
    }
    return (jdLow + jdHigh) / 2;
}

/**
 * 计算某年全部 24 节气的精确时间
 */
function computeAllSolarTerms(year) {
    return SOLAR_TERMS.map(term => {
        const jd = findSolarTermJD(year, term.lon, term.approxM, term.approxD);
        const cal = jdToCalendar(jd);
        return {
            ...term, jd,
            calYear: cal.year, calMonth: cal.month, calDay: cal.day,
            calHour: cal.hour, calMinute: cal.minute,
            dateStr: cal.month + '月' + cal.day + '日 ' +
                     String(cal.hour).padStart(2, '0') + ':' + String(cal.minute).padStart(2, '0')
        };
    }).sort((a, b) => a.jd - b.jd);
}

// ============================
//  第三部分：当前节气状态
// ============================

function getCurrentState(terms) {
    const now = new Date();
    const nowJD = getJD(now.getFullYear(), now.getMonth() + 1, now.getDate(),
                         now.getHours(), now.getMinutes(), now.getSeconds());
    const nowLon = getSunLongitude(nowJD);
    let idx = -1;
    for (let i = 0; i < terms.length; i++) {
        if (terms[i].jd <= nowJD) idx = i; else break;
    }
    if (idx === -1) idx = terms.length - 1;
    const current = terms[idx];
    const next = terms[(idx + 1) % terms.length];
    const elapsed = nowJD - current.jd;
    const total = next.jd - current.jd;
    const progress = Math.min(1, Math.max(0, elapsed / total));
    const pentadIdx = Math.min(2, Math.floor(progress * 3));
    const remJD = next.jd - nowJD;
    const remDays = Math.floor(remJD);
    const remHours = Math.floor((remJD - remDays) * 24);
    const remMins = Math.floor(((remJD - remDays) * 24 - remHours) * 60);
    return {
        current, next, nowJD, nowLon, progress,
        pentadIndex: pentadIdx,
        remainingDays: remDays, remainingHours: remHours, remainingMinutes: remMins
    };
}

// ============================
//  第四部分：SVG 渲染
// ============================

const SVG_NS = 'http://www.w3.org/2000/svg';

function createSVGEl(tag, attrs) {
    const e = document.createElementNS(SVG_NS, tag);
    for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
    return e;
}

/**
 * 绘制黄经环可视化
 */
function renderEclipticRing(svg, terms, state, selectedYear) {
    const CX = 260, CY = 260, R = 200, LABEL_R = R + 22, TICK_OUT = R + 6, TICK_IN = R - 6;
    svg.innerHTML = '';

    // 四季弧线
    [
        { name: 'spring', start: 315, end: 45 },
        { name: 'summer', start: 45,  end: 135 },
        { name: 'autumn', start: 135, end: 225 },
        { name: 'winter', start: 225, end: 315 }
    ].forEach(se => {
        const sr = se.start * Math.PI / 180;
        const er = se.end   * Math.PI / 180;
        const largeArc = ((se.end - se.start + 360) % 360) > 180 ? 1 : 0;
        svg.appendChild(createSVGEl('path', {
            d: 'M ' + (CX + R * Math.cos(sr)) + ' ' + (CY + R * Math.sin(sr))
             + ' A ' + R + ' ' + R + ' 0 ' + largeArc + ' 1 '
             + (CX + R * Math.cos(er)) + ' ' + (CY + R * Math.sin(er)),
            class: 'season-arc ' + se.name
        }));
    });

    // 主环
    svg.appendChild(createSVGEl('circle', { cx: CX, cy: CY, r: R, class: 'main-ring' }));

    const now = new Date();
    const isCurrentYear = (selectedYear === now.getFullYear());
    const currentName = (isCurrentYear && state) ? state.current.name : null;

    // 24 个标记点 + 标签
    terms.forEach(term => {
        const rad = term.lon * Math.PI / 180;

        // 刻度线
        svg.appendChild(createSVGEl('line', {
            x1: CX + TICK_IN * Math.cos(rad), y1: CY + TICK_IN * Math.sin(rad),
            x2: CX + TICK_OUT * Math.cos(rad), y2: CY + TICK_OUT * Math.sin(rad),
            class: 'tick-line'
        }));

        // 状态 css 类
        let dotClass = 'marker-dot', labelClass = 'term-label';
        if (isCurrentYear && state) {
            if (term.name === currentName) {
                dotClass += ' current'; labelClass += ' current';
            } else if (term.jd < state.nowJD) {
                dotClass += ' past'; labelClass += ' past';
            }
        }

        // 圆点
        svg.appendChild(createSVGEl('circle', {
            cx: CX + R * Math.cos(rad), cy: CY + R * Math.sin(rad),
            r: 3.5, class: dotClass
        }));

        // 文字标签
        const label = createSVGEl('text', {
            x: CX + LABEL_R * Math.cos(rad),
            y: CY + LABEL_R * Math.sin(rad),
            class: labelClass
        });
        label.textContent = term.name;
        svg.appendChild(label);
    });

    // 太阳实时位置（仅今年显示）
    if (isCurrentYear && state) {
        const sr = state.nowLon * Math.PI / 180;
        const sx = CX + R * Math.cos(sr);
        const sy = CY + R * Math.sin(sr);

        // 呼吸光晕
        const glow = createSVGEl('circle', {
            cx: sx, cy: sy, r: 10,
            fill: 'none', stroke: 'var(--sun-glow)', 'stroke-width': 2, opacity: 0.6
        });
        glow.innerHTML =
            '<animate attributeName="r" values="10;14;10" dur="3s" repeatCount="indefinite"/>'
          + '<animate attributeName="opacity" values="0.6;0.2;0.6" dur="3s" repeatCount="indefinite"/>';
        svg.appendChild(glow);

        // 太阳圆点
        svg.appendChild(createSVGEl('circle', { cx: sx, cy: sy, r: 5, class: 'sun-marker' }));
    }
}

// ============================
//  第五部分：信息面板
// ============================

function updateInfoPanel(state, isCurrentYear) {
    const elTermName   = document.getElementById('termName');
    const elTermDate   = document.getElementById('termDate');
    const elCountdown  = document.getElementById('countdown');
    const elTermDesc   = document.getElementById('termDesc');
    const elPentads    = document.getElementById('pentads');
    const elProgress   = document.getElementById('progressFill');

    if (!isCurrentYear || !state) {
        elTermName.textContent   = '—';
        elTermDate.textContent   = '请切换到今年查看实时节气';
        elCountdown.textContent  = '';
        elTermDesc.textContent   = '';
        elPentads.innerHTML      = '';
        elProgress.style.width   = '0%';
        return;
    }

    const { current, next, progress, pentadIndex, remainingDays, remainingHours, remainingMinutes } = state;

    elTermName.textContent = current.name;
    elTermDate.textContent = current.calYear + '年' + current.dateStr + '  —  ' + next.dateStr;

    elProgress.style.width = (progress * 100).toFixed(1) + '%';
    const seasonColors = {
        spring: 'var(--spring)', summer: 'var(--summer)',
        autumn: 'var(--autumn)', winter: 'var(--winter)'
    };
    elProgress.style.background = seasonColors[getSeason(current.lon)];

    if (remainingDays > 0) {
        elCountdown.innerHTML = '距下一节气 <strong>「' + next.name + '」</strong> 还有 <strong>' + remainingDays + '</strong> 天 <strong>' + remainingHours + '</strong> 时';
    } else if (remainingHours > 0) {
        elCountdown.innerHTML = '距下一节气 <strong>「' + next.name + '」</strong> 还有 <strong>' + remainingHours + '</strong> 时 <strong>' + remainingMinutes + '</strong> 分';
    } else {
        elCountdown.innerHTML = '距下一节气 <strong>「' + next.name + '」</strong> 还有 <strong>' + remainingMinutes + '</strong> 分';
    }

    elTermDesc.textContent = current.desc;

    elPentads.innerHTML = current.pentads.map((p, i) =>
        '<span class="pentad' + (i === pentadIndex ? ' active' : '') + '">' + p + '</span>'
    ).join('');
}

function updateBackground(season) {
    const colors = {
        spring: 'var(--spring-light)', summer: 'var(--summer-light)',
        autumn: 'var(--autumn-light)', winter: 'var(--winter-light)'
    };
    document.body.style.backgroundColor = colors[season] || 'var(--bg)';
}

// ============================
//  第六部分：主控逻辑
// ============================

let currentYear  = new Date().getFullYear();
let allTerms     = [];
let currentState = null;

function refreshAll() {
    const now = new Date();
    const isCurrentYear = (currentYear === now.getFullYear());

    allTerms     = computeAllSolarTerms(currentYear);
    currentState = isCurrentYear ? getCurrentState(allTerms) : null;

    renderEclipticRing(document.getElementById('eclipticSvg'), allTerms, currentState, currentYear);
    updateInfoPanel(currentState, isCurrentYear);

    document.getElementById('yearDisplay').textContent = currentYear;

    if (isCurrentYear && currentState) {
        updateBackground(getSeason(currentState.current.lon));
    } else {
        document.body.style.backgroundColor = 'var(--bg)';
    }

    document.getElementById('btnToday').style.display = isCurrentYear ? 'none' : 'inline';
}

// ============================
//  第七部分：事件绑定
// ============================

document.getElementById('btnPrev').addEventListener('click', () => {
    currentYear--;
    refreshAll();
});

document.getElementById('btnNext').addEventListener('click', () => {
    currentYear++;
    refreshAll();
});

document.getElementById('btnToday').addEventListener('click', () => {
    currentYear = new Date().getFullYear();
    refreshAll();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft')  { currentYear--; refreshAll(); }
    if (e.key === 'ArrowRight') { currentYear++; refreshAll(); }
});

// 每分钟自动刷新倒计时
setInterval(() => {
    if (currentYear === new Date().getFullYear()) refreshAll();
}, 60000);

// ============================
//  启动
// ============================

refreshAll();
