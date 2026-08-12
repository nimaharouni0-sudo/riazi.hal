/**
 * سامانه حل مسائل ریاضی - اسکریپت تعاملی
 */

// متغیر حالت محاسبه (حالت پیش‌فرض: ساده‌سازی و ارزیابی)
let currentMode = 'eval';

// متون راهنما و نمونه ورودی برای هر حالت
const placeholders = {
    'eval': 'مثال: (5 + 3) * 2 یا sin(pi/2) + cos(0)',
    'diff': 'مثال: x^3 + 4*x^2 - 2*x + 7',
    'integrate': 'مثال: 3*x^2 + 2*x + 1',
    'coord': 'فرمت: (x1, y1), (x2, y2) مثال: (2, 3), (5, 7)'
};

// ۱. تغییر حالت محاسباتی (ساده‌سازی، مشتق، انتگرال، مختصات)
function switchMode(mode) {
    currentMode = mode;
    
    // بروزرسانی ظاهر تب‌ها
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // بروزرسانی متن راهنما
    const inputField = document.getElementById('math-input');
    inputField.placeholder = placeholders[mode];

    // پنهان کردن کیبورد میانبر در حالت مختصات
    const symbolsBar = document.getElementById('symbols-bar');
    symbolsBar.style.display = (mode === 'coord') ? 'none' : 'flex';

    hideError();
}

// ۲. درج سریع نمادها در کادر ورودی
function insertSymbol(symbol) {
    const input = document.getElementById('math-input');
    input.value += symbol;
    input.focus();
}

// ۳. پاک‌سازی ورودی و خروجی
function clearAll() {
    document.getElementById('math-input').value = '';
    document.getElementById('math-output').textContent = 'پاسخ پس از محاسبه در اینجا نمایش داده می‌شود...';
    hideError();
}

// ۴. نمایش پیام خطا
function showError(message) {
    const errorBanner = document.getElementById('error-banner');
    errorBanner.textContent = message;
    errorBanner.style.display = 'block';
    document.getElementById('math-output').textContent = '---';
}

// ۵. پنهان‌سازی خطا
function hideError() {
    document.getElementById('error-banner').style.display = 'none';
}

// ۶. تابع اصلی حل مسئله
function solveMath() {
    hideError();
    const inputVal = document.getElementById('math-input').value.trim();
    const outputBox = document.getElementById('math-output');

    if (!inputVal) {
        showError('لطفاً عبارت یا مسئله ریاضی خود را وارد کنید.');
        return;
    }

    try {
        let result = '';

        switch (currentMode) {
            case 'eval':
                // چهار عمل اصلی، محاسبات جبری و مثلثاتی
                result = nerdamer(inputVal).evaluate().text();
                break;

            case 'diff':
                // محاسبه مشتق نسبت به متغیر x
                result = nerdamer.diff(inputVal, 'x').text();
                break;

            case 'integrate':
                // محاسبه انتگرال نسبت به متغیر x
                result = nerdamer.integrate(inputVal, 'x').text();
                break;

            case 'coord':
                // محاسبه فاصله بین دو نقطه مختصاتی
                result = calculateCoordinateDistance(inputVal);
                break;
        }

        // نمایش پاسخ نهایی در باکس طلایی
        outputBox.textContent = result;

    } catch (err) {
        console.error("Math Engine Error:", err);
        showError('فرمول وارد شده معتبر نیست! لطفاً از علائم استاندارد مانند * برای ضرب و ^ برای توان استفاده کنید.');
    }
}

// ۷. تابع اختصاصی محاسبه فاصله مختصاتی
function calculateCoordinateDistance(input) {
    // استخراج تمام اعداد (شامل اعداد منفی و اعشاری)
    const numbers = input.match(/-?\d+(\.\d+)?/g);

    if (!numbers || numbers.length < 4) {
        throw new Error("فرمت مختصات نادرست است.");
    }

    const x1 = parseFloat(numbers[0]);
    const y1 = parseFloat(numbers[1]);
    const x2 = parseFloat(numbers[2]);
    const y2 = parseFloat(numbers[3]);

    // فرمول فاصله: d = √((x2 - x1)² + (y2 - y1)²)
    const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    
    return `فاصله d = ${distance.toFixed(4)} (مقدار دقیق: √${Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)})`;
}

// ۸. اجرا با فشردن کلید Enter
document.getElementById('math-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        solveMath();
    }
});