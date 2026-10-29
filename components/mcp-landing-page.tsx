"use client";

import { useState } from "react";
import { ArrowDown, ArrowRight, Bot, CheckCircle2, CircleHelp, Code2, Container, FileCode2, LockKeyhole, PlugZap, ShieldCheck, Workflow } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LocaleLink } from "@/components/locale-link";
import { useI18n } from "@/components/i18n-provider";

const content = {
  en: {
    eyebrow: "MCP & INTEGRATIONS",
    title: "Bring GaGet.dev tools into your AI workflows",
    intro: "Connect a compatible MCP client to supported server operations. Explore how operations can be composed, then use Batch Workbench for full pipeline authoring.",
    demoCta: "Explore the guided demo",
    setupCta: "Client setup & security",
    workbenchCta: "Open Batch Workbench",
    status: "Guided example · not executed",
    demoTitle: "One pipeline, clearly explained",
    demoIntro: "This example illustrates the pipeline shape and sample result. It does not send a request to the MCP server or execute operations.",
    task: "Example task",
    taskText: "Decode Base64, validate the JSON, then format it.",
    sampleInput: "Sample input",
    sampleOutput: "Illustrative output",
    outputHidden: "Show sample output",
    outputShown: "Hide sample output",
    steps: ["Decode Base64", "Validate JSON", "Format JSON"],
    outputNote: "This is a precomputed illustration, not runtime evidence.",
    fullEditor: "Build and run your own pipeline in Batch Workbench",
    capabilitiesTitle: "Supported server operation families",
    capabilitiesIntro: "The MCP endpoint publishes an allowlisted subset. Actual availability depends on the server build and configuration; a browser route alone does not imply remote support.",
    capabilityGroups: [
      ["Encoding & charset", "encoding.transform · encoding.charset"],
      ["Text & JSON", "text.transform · json.validate · json.format · json.diff · json.minify · json.sort-keys · json.escape · json.unescape · json.find"],
      ["Developer utilities", "developer.format · data.inspect · generator.sample"],
      ["Security & time", "security.hash · security.jwt.decode · datetime.convert · datetime.arithmetic · datetime.compare"],
      ["Raster image operations", "image.inspect · image.transform (explicit Base64 input; bounded)"],
      ["Workflow orchestration", "execute_workflow (sequential, allowlisted, bounded)"],
    ],
    howTitle: "How the integration works",
    howSteps: [
      ["Connect", "Configure a compatible MCP client to use the endpoint provided by your deployment administrator."],
      ["Discover", "The client lists the server-exposed operations and their schemas."],
      ["Invoke", "The server validates inputs, applies allowlists and resource budgets, then returns bounded structured results."],
    ],
    privacyTitle: "Data flow and security",
    privacyBody: "An MCP request sends its supplied input to the server configured by your client. Browser-selected files are not automatically accessible to a remote server. Send file content only when you explicitly choose to transfer it. The endpoint in this repository requires MCP_AUTH_TOKEN configured on the server with at least 32 bytes of secret material; never place that token in browser code.",
    hostedTitle: "Hosted GaGet.dev",
    hostedBody: "A public MCP connection is available only if the hosted deployment explicitly enables and documents it. This page does not imply anonymous access or a public token. Use the connection details published for the actual hosted service.",
    selfHostedTitle: "Self-hosted / on-premises",
    selfHostedBody: "Run GaGet.dev in infrastructure you control and configure the server-side MCP token and deployment limits. Self-hosting alone does not guarantee air-gapped operation, regulatory compliance, or zero external network traffic; review your own proxy, logging, and network configuration.",
    dockerLink: "Read deployment specification",
    helpTitle: "Build once in the workbench; integrate through MCP",
    helpBody: "Batch Workbench is the single general-purpose pipeline editor. This MCP page demonstrates the same pipeline concept; it is intentionally not a second workflow editor.",
    privacyLabel: "Remote transfer is explicit",
    authLabel: "Server-side authentication",
    limitsLabel: "Allowlisted, bounded operations",
  },
  fa: {
    eyebrow: "اتصال MCP و یکپارچه‌سازی‌ها",
    title: "ابزارهای GaGet.dev را وارد گردش‌کار هوش مصنوعی کنید",
    intro: "یک کارخواه سازگار با MCP را به عملیات پشتیبانی‌شده سرور متصل کنید. نمونه گردش‌کار را ببینید و برای ساخت کامل خط لوله از محیط Batch Workbench استفاده کنید.",
    demoCta: "مشاهده نمونه راهنما",
    setupCta: "راه‌اندازی و امنیت",
    workbenchCta: "باز کردن Batch Workbench",
    status: "نمونه راهنما · اجرا نشده",
    demoTitle: "یک خط لوله با توضیح روشن",
    demoIntro: "این نمونه ساختار خط لوله و نتیجه نمایشی را نشان می‌دهد؛ درخواستی به سرور MCP نمی‌فرستد و عملیاتی اجرا نمی‌کند.",
    task: "نمونه کار",
    taskText: "رمزگشایی Base64، اعتبارسنجی JSON و سپس قالب‌بندی آن.",
    sampleInput: "ورودی نمونه",
    sampleOutput: "خروجی نمایشی",
    outputHidden: "نمایش خروجی نمونه",
    outputShown: "پنهان کردن خروجی نمونه",
    steps: ["رمزگشایی Base64", "اعتبارسنجی JSON", "قالب‌بندی JSON"],
    outputNote: "این خروجی از پیش آماده شده و شاهد اجرای واقعی نیست.",
    fullEditor: "ساخت و اجرای خط لوله در Batch Workbench",
    capabilitiesTitle: "گروه‌های عملیات سرور",
    capabilitiesIntro: "نقطه پایانی MCP فقط زیرمجموعه مجاز را منتشر می‌کند. دسترسی واقعی به ساخت و پیکربندی سرور بستگی دارد؛ وجود مسیر مرورگر به‌تنهایی پشتیبانی راه دور را ثابت نمی‌کند.",
    capabilityGroups: [
      ["کدگذاری و نویسه‌ها", "encoding.transform · encoding.charset"],
      ["متن و JSON", "text.transform · json.validate · json.format · json.diff · json.minify · json.sort-keys · json.escape · json.unescape · json.find"],
      ["ابزارهای توسعه", "developer.format · data.inspect · generator.sample"],
      ["امنیت و زمان", "security.hash · security.jwt.decode · datetime.convert · datetime.arithmetic · datetime.compare"],
      ["عملیات تصویر شطرنجی", "image.inspect · image.transform (ورودی Base64 صریح و محدود)"],
      ["اجرای گردش‌کار", "execute_workflow (ترتیبی، مجاز و محدود)"],
    ],
    howTitle: "نحوه کار یکپارچه‌سازی",
    howSteps: [
      ["اتصال", "کارخواه سازگار با MCP را با نشانی ارائه‌شده توسط مدیر استقرار تنظیم کنید."],
      ["کشف", "کارخواه عملیات منتشرشده توسط سرور و طرح‌واره‌های آن‌ها را دریافت می‌کند."],
      ["اجرا", "سرور ورودی را اعتبارسنجی می‌کند، محدودیت‌ها را اعمال می‌کند و نتیجه ساختاریافته و محدود برمی‌گرداند."],
    ],
    privacyTitle: "جریان داده و امنیت",
    privacyBody: "درخواست MCP ورودی را به سروری می‌فرستد که کارخواه شما تنظیم کرده است. سرور راه دور به فایل‌های انتخاب‌شده در مرورگر دسترسی خودکار ندارد. فقط وقتی انتقال را صریحاً انتخاب کردید محتوای فایل را بفرستید. این نقطه پایانی به متغیر سروری MCP_AUTH_TOKEN با حداقل ۳۲ بایت داده محرمانه نیاز دارد؛ توکن را در کد مرورگر قرار ندهید.",
    hostedTitle: "GaGet.dev میزبانی‌شده",
    hostedBody: "اتصال عمومی MCP فقط زمانی در دسترس است که استقرار میزبانی‌شده آن را صریحاً فعال و مستند کرده باشد. این صفحه دسترسی ناشناس یا توکن عمومی را تضمین نمی‌کند.",
    selfHostedTitle: "میزبانی شخصی یا درون‌سازمانی",
    selfHostedBody: "GaGet.dev را در زیرساخت خود اجرا و توکن MCP و محدودیت‌های سرور را پیکربندی کنید. میزبانی شخصی به‌تنهایی جداسازی کامل شبکه، انطباق قانونی یا نبود ترافیک خارجی را تضمین نمی‌کند.",
    dockerLink: "مشاهده مشخصات استقرار",
    helpTitle: "ساخت در یک محیط و اتصال از طریق MCP",
    helpBody: "Batch Workbench تنها ویرایشگر عمومی خط لوله است. این صفحه فقط نمونه‌ای از همان مفهوم را نمایش می‌دهد و ویرایشگر دومی ایجاد نمی‌کند.",
    privacyLabel: "انتقال راه دور با انتخاب صریح",
    authLabel: "احراز هویت سمت سرور",
    limitsLabel: "عملیات مجاز و محدود",
  },
  ar: {
    eyebrow: "MCP والتكاملات",
    title: "أدخل أدوات GaGet.dev في سير عمل الذكاء الاصطناعي",
    intro: "اربط عميلاً متوافقاً مع MCP بعمليات الخادم المدعومة. استكشف مثالاً لسير العمل واستخدم Batch Workbench لإنشاء خطوط الأنابيب الكاملة.",
    demoCta: "استكشاف العرض الإرشادي",
    setupCta: "إعداد العميل والأمان",
    workbenchCta: "فتح Batch Workbench",
    status: "مثال إرشادي · لم يُنفّذ",
    demoTitle: "خط أنابيب واحد مع شرح واضح",
    demoIntro: "يوضح المثال شكل خط الأنابيب ونتيجة توضيحية؛ لا يرسل طلباً إلى خادم MCP ولا ينفّذ العمليات.",
    task: "مهمة نموذجية",
    taskText: "فك ترميز Base64 والتحقق من JSON ثم تنسيقه.",
    sampleInput: "إدخال نموذجي",
    sampleOutput: "نتيجة توضيحية",
    outputHidden: "عرض النتيجة النموذجية",
    outputShown: "إخفاء النتيجة النموذجية",
    steps: ["فك ترميز Base64", "التحقق من JSON", "تنسيق JSON"],
    outputNote: "هذه نتيجة توضيحية مُعدّة مسبقاً وليست دليلاً على تنفيذ فعلي.",
    fullEditor: "أنشئ خط أنابيبك وشغّله في Batch Workbench",
    capabilitiesTitle: "مجموعات عمليات الخادم المدعومة",
    capabilitiesIntro: "تنشر نقطة MCP مجموعة فرعية مسموحاً بها فقط. يعتمد التوفر الفعلي على إصدار الخادم وإعداده؛ وجود صفحة في المتصفح لا يثبت دعم التنفيذ عن بُعد.",
    capabilityGroups: [
      ["الترميز ومجموعات المحارف", "encoding.transform · encoding.charset"],
      ["النص وJSON", "text.transform · json.validate · json.format · json.diff · json.minify · json.sort-keys · json.escape · json.unescape · json.find"],
      ["أدوات المطور", "developer.format · data.inspect · generator.sample"],
      ["الأمان والوقت", "security.hash · security.jwt.decode · datetime.convert · datetime.arithmetic · datetime.compare"],
      ["عمليات الصور النقطية", "image.inspect · image.transform (إدخال Base64 صريح ومحدود)"],
      ["تنسيق سير العمل", "execute_workflow (تسلسلي ومسموح ومحدود)"],
    ],
    howTitle: "كيف يعمل التكامل",
    howSteps: [
      ["الاتصال", "اضبط عميل MCP المتوافق باستخدام عنوان نقطة النهاية الذي يقدمه مسؤول النشر."],
      ["الاكتشاف", "يسرد العميل العمليات التي يتيحها الخادم ومخططاتها."],
      ["الاستدعاء", "يتحقق الخادم من الإدخال ويطبق قوائم السماح وحدود الموارد ثم يعيد نتائج منظمة ومحدودة."],
    ],
    privacyTitle: "تدفق البيانات والأمان",
    privacyBody: "يرسل طلب MCP مدخلاته إلى الخادم الذي يحدده العميل. لا يستطيع الخادم البعيد الوصول تلقائياً إلى الملفات المحددة في المتصفح. لا ترسل محتوى الملفات إلا باختيار صريح. تتطلب نقطة النهاية في هذا المستودع ضبط MCP_AUTH_TOKEN على الخادم بقيمة سرية لا تقل عن 32 بايت؛ لا تضع الرمز في كود المتصفح.",
    hostedTitle: "GaGet.dev المستضاف",
    hostedBody: "لا يتاح اتصال MCP عام إلا إذا فعّله النشر المستضاف ووثّقه صراحةً. لا تعني هذه الصفحة وجود وصول مجهول أو رمز عام.",
    selfHostedTitle: "الاستضافة الذاتية / داخل المؤسسة",
    selfHostedBody: "شغّل GaGet.dev في البنية التحتية التي تتحكم بها واضبط رمز MCP وحدود الخادم. لا تضمن الاستضافة الذاتية وحدها العزل الشبكي أو الامتثال أو انعدام حركة الشبكة الخارجية.",
    dockerLink: "عرض مواصفات النشر",
    helpTitle: "أنشئ مرة واحدة في مساحة العمل وتكامل عبر MCP",
    helpBody: "Batch Workbench هو محرر خطوط الأنابيب العام الوحيد. تعرض هذه الصفحة مثالاً على المفهوم نفسه وليست محرراً ثانياً.",
    privacyLabel: "النقل البعيد باختيار صريح",
    authLabel: "مصادقة على الخادم",
    limitsLabel: "عمليات مسموح بها ومحدودة",
  },
} as const;

export function McpLandingPage() {
  const { locale } = useI18n();
  const t = content[locale as keyof typeof content] ?? content.en;
  const [showOutput, setShowOutput] = useState(false);

  return (
    <main className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
      <section className="grid gap-8 border-b border-border pb-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-12 lg:pb-14">
        <div className="space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold tracking-wide text-muted-foreground"><PlugZap className="h-4 w-4 text-primary" />{t.eyebrow}</div>
          <h1 className="max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">{t.title}</h1>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">{t.intro}</p>
          <div className="flex flex-wrap gap-3">
            <Button asChild><a href="#demo">{t.demoCta}<ArrowRight className="ms-2 h-4 w-4" /></a></Button>
            <Button asChild variant="outline"><a href="#setup">{t.setupCta}</a></Button>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 pt-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4" />{t.limitsLabel}</span>
            <span className="inline-flex items-center gap-2"><LockKeyhole className="h-4 w-4" />{t.authLabel}</span>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7">
          <div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><Bot className="h-5 w-5" /></div><div><h2 className="font-semibold">{t.howTitle}</h2><p className="text-sm text-muted-foreground">MCP · tools · structured results</p></div></div>
          <div className="mt-6 space-y-3">
            {t.howSteps.map(([title, description], index) => <div key={title} className="flex gap-3 rounded-xl border border-border p-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold">{index + 1}</span><div className="min-w-0"><h3 className="font-medium">{title}</h3><p className="mt-1 text-sm leading-5 text-muted-foreground">{description}</p></div></div>)}
          </div>
        </div>
      </section>

      <section id="demo" className="scroll-mt-6 border-b border-border py-10 lg:py-14">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-4"><div className="max-w-3xl"><p className="text-sm font-semibold text-primary">{t.eyebrow}</p><h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">{t.demoTitle}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base">{t.demoIntro}</p></div><span className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs font-semibold text-foreground"><CircleHelp className="h-4 w-4" />{t.status}</span></div>
        <div className="grid overflow-hidden rounded-2xl border border-border bg-card lg:grid-cols-2">
          <div className="space-y-5 border-b border-border p-4 sm:p-6 lg:border-b-0 lg:border-e"><div><p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t.task}</p><p className="mt-2 font-medium">{t.taskText}</p></div><div><p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t.sampleInput}</p><pre dir="ltr" className="overflow-x-auto rounded-xl bg-muted p-4 text-sm"><code>eyJvayI6dHJ1ZX0=</code></pre></div><div className="space-y-3">{t.steps.map((step, index) => <div key={step} className="flex items-center gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border text-sm font-semibold">{index + 1}</span><span className="min-w-0 flex-1 text-sm font-medium">{step}</span>{index < t.steps.length - 1 && <ArrowDown className="h-4 w-4 text-muted-foreground" />}{index === t.steps.length - 1 && <CheckCircle2 className="h-4 w-4 text-muted-foreground" />}</div>)}</div><Button variant="outline" onClick={() => setShowOutput((value) => !value)} aria-expanded={showOutput}>{showOutput ? t.outputShown : t.outputHidden}</Button></div>
          <div className="min-w-0 p-4 sm:p-6"><div className="flex items-center gap-2"><FileCode2 className="h-4 w-4 text-primary" /><h3 className="font-semibold">{t.sampleOutput}</h3></div>{showOutput ? <pre dir="ltr" className="mt-4 overflow-x-auto rounded-xl border border-border bg-muted p-4 text-sm"><code>{'{\n  "ok": true\n}'}</code></pre> : <div className="mt-4 flex min-h-36 items-center justify-center rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">{t.outputHidden}</div>}<p className="mt-3 text-xs leading-5 text-muted-foreground">{t.outputNote}</p></div>
        </div>
        <div className="mt-5 flex flex-col gap-3 rounded-xl border border-primary/25 bg-primary/5 p-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-start gap-3"><Workflow className="mt-0.5 h-5 w-5 shrink-0 text-primary" /><div><h3 className="font-semibold">{t.helpTitle}</h3><p className="mt-1 text-sm text-muted-foreground">{t.helpBody}</p></div></div><Button asChild className="shrink-0"><LocaleLink href="/workflow/pipeline">{t.workbenchCta}<ArrowRight className="ms-2 h-4 w-4" /></LocaleLink></Button></div>
      </section>

      <section className="border-b border-border py-10 lg:py-14"><h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{t.capabilitiesTitle}</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">{t.capabilitiesIntro}</p><div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{t.capabilityGroups.map(([title, operations]) => <article key={title} className="min-w-0 rounded-xl border border-border bg-card p-4"><h3 className="font-semibold">{title}</h3><p dir="ltr" className="mt-2 break-words font-mono text-xs leading-5 text-muted-foreground">{operations}</p></article>)}</div></section>

      <section id="setup" className="scroll-mt-6 py-10 lg:py-14"><div className="mb-6"><h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{t.setupCta}</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{t.privacyBody}</p></div><div className="grid gap-4 lg:grid-cols-2"><article className="rounded-2xl border border-border bg-card p-5 sm:p-6"><div className="flex items-center gap-3"><PlugZap className="h-5 w-5 text-primary" /><h3 className="text-lg font-semibold">{t.hostedTitle}</h3></div><p className="mt-3 text-sm leading-6 text-muted-foreground">{t.hostedBody}</p><div className="mt-4 rounded-lg bg-muted p-3"><p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Endpoint path</p><code dir="ltr" className="mt-1 block break-all text-sm">/api/mcp</code></div></article><article className="rounded-2xl border border-border bg-card p-5 sm:p-6"><div className="flex items-center gap-3"><Container className="h-5 w-5 text-primary" /><h3 className="text-lg font-semibold">{t.selfHostedTitle}</h3></div><p className="mt-3 text-sm leading-6 text-muted-foreground">{t.selfHostedBody}</p><div className="mt-4 flex flex-wrap gap-3"><Button asChild variant="outline"><LocaleLink href="/specification/mcp/deployment-docker.md" target="_blank" rel="noreferrer">{t.dockerLink}</LocaleLink></Button><Button asChild variant="ghost"><LocaleLink href="/workflow/pipeline">{t.workbenchCta}</LocaleLink></Button></div></article></div><div className="mt-5 rounded-xl border border-border p-4"><div className="flex items-center gap-3"><Code2 className="h-5 w-5 text-muted-foreground" /><div><h3 className="font-semibold">{t.privacyTitle}</h3><p className="mt-1 text-sm leading-6 text-muted-foreground">{t.privacyBody}</p></div></div></div></section>
    </main>
  );
}
