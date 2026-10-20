# پروپوزال سیستم طراحی و قرارداد تحویل توکن‌ها

> وضعیت: Proposal / نیازمند بازبینی طراحی و توسعه  
> شاخه: `feature/design-system-token-handoff`  
> مبنا: `stage`

## 1. هدف و دامنه

این سند یک قرارداد مشترک میان طراحان، طراحان سیستم طراحی و توسعه‌دهندگان UI تعریف می‌کند تا توکن‌ها از مقادیر خام تا مصرف نهایی در کامپوننت‌ها قابل ردیابی، قابل نگهداری و قابل تحویل باشند. نمونه‌ها آموزشی‌اند و مقادیر رنگ/اندازه باید با هویت بصری نهایی محصول تطبیق داده شوند.

### اصول کلیدی
- **یک منبع حقیقت:** هر مقدار در پایین‌ترین لایه‌ی مجاز تعریف و در لایه‌های بالاتر ارجاع داده شود.
- **مصرف معنایی، نه مقداری:** کامپوننت نباید مستقیماً به رنگ خام یا توکن Root وابسته باشد.
- **نام‌گذاری مبتنی بر نقش:** نام توکن باید کاربرد را توصیف کند، نه ظاهر یا مقدار HEX را.
- **قابلیت تم‌پذیری:** تغییر برند، حالت روشن/تاریک یا حالت تعاملی بدون تغییر ساختار کامپوننت انجام شود.
- **ردیابی‌پذیری:** مسیر هر توکن تا مقدار پایه و مصرف‌کننده قابل فهم باشد.
- **دسترسی‌پذیری:** کنتراست متن، فوکوس قابل مشاهده و وضعیت‌های غیررنگی نیز بررسی شوند.

## 2. مدل لایه‌ای توکن‌ها

### 2.1 Root — توکن‌های پایه (Primitive/Foundation)

Root شامل مقادیر خام و مستقل از کاربرد UI است؛ مانند طیف رنگ‌ها، مقیاس عددی و مقادیر پایه. این لایه منبع حقیقت برای مقادیر است، اما **نباید مستقیماً در کامپوننت مصرف شود**.

نمونه:
- `color.blue.600 = #2563EB`
- `color.neutral.0 = #FFFFFF`
- `space.4 = 16px`

از نام‌هایی مثل `button-blue` در Root اجتناب شود؛ Root درباره‌ی مقدار است، نه کاربرد.

### 2.2 Software Identity — توکن‌های هویتی و معنایی

این لایه زبان بصری محصول و معنای رنگ‌ها را تعریف می‌کند؛ مانند `brand`, `primary`, `success`, `danger`, `surface`, `text` و `border`. توکن‌ها به Root ارجاع می‌دهند و مرجع ساخت Component Token هستند.

مثال:
- `color.brand.primary = {color.blue.600}`
- `color.text.default = {color.neutral.900}`
- `color.status.danger = {color.red.600}`

#### نام‌گذاری Base و Primary
- **Foundation/Base** برای پالت‌ها و مقادیر عمومی و خنثی: `color.base.neutral.900` یا `color.foundation.blue.600`.
- **Brand** برای هویت بصری برند، ترجیحاً با طیف: `color.brand.primary`، `color.brand.primary.hover` یا `color.brand.primary.600`.
- **Primary** یک نقش معنایی است، نه نام یک رنگ خام: `color.action.primary` یا `color.text.primary` بسته به کاربرد.
- از نام مبهم `primary-blue` پرهیز شود؛ در صورت تغییر رنگ برند، نام معنایی باید ثابت بماند.
- اگر محصول بیش از یک برند/تم دارد، مقدار `brand.primary` در هر تم به Foundation متفاوت متصل می‌شود؛ مصرف‌کننده تغییر نمی‌کند.

### 2.3 PRSES — توکن‌های کامپوننت بر اساس ارائه (Tone / Outline / Solid)

این لایه توکن نهایی کامپوننت‌هاست. هر کامپوننت باید از این لایه استفاده کند و به Root متصل نشود. برای هر سبک، نقش‌های `text`، `bg` و `border` و حالت‌های تعاملی تعریف می‌شوند.

ساختار پیشنهادی:
`component.button.{tone|outline|solid}.{role}.{state}`

حالت‌ها: `default`, `hover`, `active`, `focus`, `disabled`؛ در صورت نیاز `selected`, `loading`, `invalid`.

نمونه:
- `component.button.solid.bg.default → color.action.primary`
- `component.button.solid.bg.hover → color.action.primary.hover`
- `component.button.outline.border.default → color.border.strong`
- `component.button.tone.text.default → color.action.primary`

تفسیر سبک‌ها:
- **Tone:** پس‌زمینه‌ی ملایم یا سطح رنگی کم‌تأکید برای اکشن‌های ثانویه.
- **Outline:** پس‌زمینه‌ی شفاف/سطح پایه با مرز مشخص.
- **Solid:** سطح پررنگ برای اکشن اصلی.

> «PRSES» در این پروپوزال نام لایه‌ی نهایی بر اساس اصطلاح پروژه است. اگر مخفف رسمی تعریف شده، در بازبینی باید بسط دقیق آن در واژه‌نامه ثبت شود.

### 2.4 Anatomy — توکن‌های ساختاری و عددی

Anatomy مقیاس‌های عددی قابل استفاده‌ی مجدد را نگه می‌دارد:
- **Blur:** `blur.sm / md / lg`
- **Opacity:** `opacity.disabled`, `opacity.overlay`
- **Border:** ضخامت خط و سبک مرز؛ رنگ در لایه معنایی/کامپوننت نگهداری شود.
- **Radius:** `radius.sm / md / lg / full`
- **Height / Width:** اندازه‌های کنترل و محدودیت‌های عرض؛ از اندازه‌های مختص کامپوننت فقط در صورت نیاز واقعی استفاده شود.
- **Spacing:** مقیاس فاصله‌ی سازگار مانند `space.1 = 4px`, `space.2 = 8px`, `space.4 = 16px`.

مثال‌ها باید به شکل alias به Root یا مقیاس اصلی وصل شوند، نه اینکه مقادیر تکراری در هر کامپوننت کپی شوند.

### 2.5 Typeface — خانواده فونت

این لایه نام خانواده‌های فونت و fallbackها را تعریف می‌کند، نه وزن یا اندازه‌ی متن را.
- `typeface.ui = "Inter", sans-serif`
- `typeface.display = "Inter", sans-serif`

فونت فارسی/عربی باید glyph coverage، اعداد، اتصال حروف و fallback مناسب داشته باشد؛ فونت نهایی پس از بررسی مجوز و رندر انتخاب شود.

### 2.6 TypeLineheight — فاصله‌ی عمودی خطوط

Line-height بر اساس نقش تایپوگرافی دسته‌بندی می‌شود:
- **Display:** تیترهای بسیار بزرگ، معمولاً نسبت فشرده‌تر.
- **Heading:** عنوان بخش‌ها.
- **Title:** عنوان کارت، فرم یا پنل.
- **Body:** متن خواندنی و توضیحی، معمولاً نسبت بازتر.

نمونه‌ی نام‌گذاری: `typography.line-height.display`, `typography.line-height.heading`, `typography.line-height.title`, `typography.line-height.body`. بهتر است نسبت بدون واحد (مثلاً 1.5) یا مقدار rem بر اساس استاندارد پروژه انتخاب و مستند شود.

### 2.7 TypeWeight — وزن فونت

برای سلسله‌مراتب بصری، وزن‌های نام‌گذاری‌شده تعریف می‌شوند:
- `typography.weight.regular = 400`
- `typography.weight.medium = 500`
- `typography.weight.semibold = 600`
- `typography.weight.bold = 700`

نام معنایی در کامپوننت استفاده شود؛ از وزن عددی مستقیم و پراکنده در CSS اجتناب شود، مگر در فایل تعریف توکن.

## 3. نمودار درختی و جریان ارجاع

نمای درختی باید مسیر «مقدار پایه ← هویت معنایی ← توکن کامپوننت ← UI» را نشان دهد. Anatomy و Typography خانواده‌های مستقل هستند که در کامپوننت نهایی مصرف می‌شوند. فایل SVG همراه سند، نسخه‌ی قابل بزرگ‌نمایی نمودار را ارائه می‌کند.

## 4. نمونه‌ی کامل: Button

### توکن‌های نمونه

| لایه | نام | مقدار/ارجاع نمونه |
|---|---|---|
| Root | `color.blue.600` | `#2563EB` |
| Root | `color.blue.700` | `#1D4ED8` |
| Root | `color.neutral.0` | `#FFFFFF` |
| Software Identity | `color.action.primary` | `{color.blue.600}` |
| Software Identity | `color.action.primary.hover` | `{color.blue.700}` |
| Software Identity | `color.text.on-primary` | `{color.neutral.0}` |
| PRSES | `component.button.solid.bg.default` | `{color.action.primary}` |
| PRSES | `component.button.solid.bg.hover` | `{color.action.primary.hover}` |
| PRSES | `component.button.solid.text.default` | `{color.text.on-primary}` |
| Anatomy | `radius.control` | `8px` (alias) |
| Anatomy | `space.3` | `12px` |
| Anatomy | `control.height.md` | `40px` |
| Typeface | `typeface.ui` | `Inter, sans-serif` |
| TypeLineheight | `typography.line-height.body` | `1.5` |
| TypeWeight | `typography.weight.medium` | `500` |

### ماتریس سبک و حالت

| Style | State | Text | Background | Border |
|---|---|---|---|---|
| Solid | Default | on-primary | action.primary | transparent |
| Solid | Hover | on-primary | action.primary.hover | transparent |
| Solid | Active | on-primary | action.primary.active | transparent |
| Solid | Focus | on-primary | action.primary | focus ring |
| Solid | Disabled | text.disabled | surface.disabled | border.disabled |
| Outline | Default | action.primary | surface.default | border.strong |
| Outline | Hover | action.primary.hover | surface.subtle | action.primary |
| Outline | Active | action.primary | surface.selected | action.primary |
| Outline | Focus | action.primary | surface.default | focus ring |
| Outline | Disabled | text.disabled | surface.default | border.disabled |
| Tone | Default | action.primary | action.primary.subtle | transparent |
| Tone | Hover | action.primary | action.primary.subtle-hover | transparent |
| Tone | Active | action.primary | action.primary.subtle-active | transparent |
| Tone | Focus | action.primary | action.primary.subtle | focus ring |
| Tone | Disabled | text.disabled | surface.disabled | transparent |

تمام نام‌های ارجاعی جدول باید در Software Identity تعریف شوند؛ جدول قرارداد پیشنهادی است و مقادیر نهایی به تست کنتراست نیاز دارند.

## 5. قوانین تحویل (Handoff)

1. توکن‌ها با نام، توضیح، مقدار، نوع، لایه، تم، وضعیت و رفرنس به توکن والد مستند شوند.
2. از alias/reference استفاده شود؛ مقادیر رنگی در لایه‌های بالاتر دوباره‌نویسی نشوند.
3. کامپوننت فقط به PRSES، Anatomy و توکن‌های تایپوگرافی مجاز ارجاع دهد.
4. توکن‌های نامعتبر، رفرنس شکسته، چرخه‌ی alias و نام تکراری در CI بررسی شوند.
5. تغییر توکن breaking change محسوب می‌شود اگر نام/معنا حذف شود یا قرارداد بصری مصرف‌کننده را بشکند.
6. برای تم روشن/تاریک و برندهای مختلف، نام معنایی ثابت و نگاشت مقادیر متفاوت باشد.
7. حالت Focus باید قابل مشاهده و مستقل از رنگ تنها باشد؛ کنتراست متن و اجزای UI با معیارهای دسترسی‌پذیری بررسی شود.
8. خروجی نهایی می‌تواند به JSON/CSS variables و ابزار طراحی منتقل شود؛ نام‌های source of truth بین ابزارها همگام بمانند.

## 6. معیارهای پذیرش

- [ ] تمام 7 خانواده‌ی توکن و مسئولیت هرکدام مستند شده‌اند.
- [ ] نمودار درختی و مسیر ارجاع در SVG قابل مشاهده است.
- [ ] نمونه‌ی Button برای Tone، Outline و Solid و حالت‌های تعاملی دارد.
- [ ] نام‌گذاری Base/Foundation در برابر Brand/Primary با مثال تعریف شده است.
- [ ] کامپوننت‌ها به Root وابسته نیستند.
- [ ] Wireframe دسکتاپ و نمای فشرده/موبایل وجود دارد.
- [ ] نسخه‌های SVG و PNG برای نمودار و wireframe ارائه شده‌اند.
- [ ] مقادیر نمونه به‌عنوان نمونه مشخص شده‌اند و قبل از implementation نهایی بازبینی می‌شوند.

## 7. فایل‌های همراه

- `wireframes/token-handoff-desktop.svg` — نمای صفحه‌ی مستندات و جدول توکن‌ها
- `wireframes/token-handoff-mobile.svg` — نمای فشرده/موبایل
- `wireframes/token-hierarchy.svg` — نمودار درختی لایه‌ها

PNGها باید از SVGهای همراه رندر شوند تا کیفیت و تناسب میان فرمت‌ها حفظ شود.
