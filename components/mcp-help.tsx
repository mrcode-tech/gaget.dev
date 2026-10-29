"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, Copy, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/i18n-provider";
import { localeDirections } from "@/lib/i18n/messages";

type HelpContract = { operations: string[]; prompt: string; note: string };
const contracts: Record<string, HelpContract> = {
  "Image Editor": { operations: ["image.inspect"], prompt: "Inspect these supported image bytes and return format, dimensions, and byte length.", note: "Only metadata inspection is supported. The MCP client explicitly transfers Base64 image bytes to the server; image editing and artifact output are not implemented." },
  "Encoding & Decoding": {
    operations: ["encoding.transform"],
    prompt: "Decode this Base64 text, validate it as JSON, then format the result.",
    note: "Encoding transforms bounded text only. Encoding is not encryption."
  },
  "Text & Regex Workbench": {
    operations: ["text.transform"],
    prompt: "Trim this text, remove duplicate lines, and return basic statistics.",
    note: "Regex and text work are bounded. Avoid treating input as executable code."
  },
  "Image Editor": {
    operations: ["image.inspect", "image.transform"],
    prompt: "Inspect this image's dimensions, then resize it to fit within 1024 by 1024 pixels. Return the transformed image only if its output is within the server limits.",
    note: "You must explicitly provide image bytes as base64. The MCP server receives that data; inputs and outputs are capped at 600,000 bytes and are not persisted by this operation."
  },
  "JSON Formatter & Validator": {
    operations: ["json.validate", "json.format", "json.minify", "json.diff", "json.sort-keys", "json.escape", "json.unescape", "json.find"],
    prompt: "Validate this JSON document, format it with two-space indentation, and report any syntax errors.",
    note: "The JSON operations accept text documents up to 200,000 characters each."
  },
  "XML Formatter": {
    operations: ["developer.format (xml)"],
    prompt: "Format this XML source as text and report malformed markup without resolving external entities.",
    note: "Formatting is not full XML schema validation. XML is handled as text, not executed."
  },
  "SQL Formatter": {
    operations: ["developer.format (sql)"],
    prompt: "Format this SQL statement for readability without executing it.",
    note: "Formatting is heuristic and does not validate a database dialect or execute SQL."
  },
  "CSV ↔ JSON": {
    operations: ["developer.format (csv-json)"],
    prompt: "Convert this CSV table to a JSON array of objects and preserve cell values as strings.",
    note: "Conversion is bounded; CSV export applies spreadsheet-formula safeguards."
  },
  "HTML Formatter": {
    operations: ["developer.format (html)"],
    prompt: "Format this HTML source as text without rendering it as active markup.",
    note: "Markup is never rendered or executed by this operation."
  },
  "cURL Converter": {
    operations: ["developer.format (curl)"],
    prompt: "Parse this cURL command into a redacted request preview. Do not send the request.",
    note: "Commands are parsed only. Network requests are never made, and supported flags are limited."
  },
  "Hash & Checksum Generator": {
    operations: ["security.hash"],
    prompt: "Compute a SHA-256 digest for this text. Do not treat the digest as encryption or proof of authenticity.",
    note: "HMAC requires a secret key that should not be shared. Digests and checksums are not encryption."
  },
  "JWT Decoder & Claims Inspector": {
    operations: ["security.jwt.decode"],
    prompt: "Decode this JWT and summarize its header and claims. Do not claim that the signature or issuer is verified.",
    note: "This operation decodes the token only. It does not verify signature, issuer, audience, expiration policy, or trust."
  },
  "Data Generator": {
    operations: ["generator.sample"],
    prompt: "Generate five UUIDs for test fixtures.",
    note: "Outputs are bounded synthetic test data. Generated timestamps depend on the server clock and are not a trusted time source."
  },
  "Data, Binary & Math Workbench": {
    operations: ["data.inspect"],
    prompt: "Parse this URL and summarize its components and query parameters without making a network request.",
    note: "URL, network, DNS, and HTTP content is inspected as text. No DNS lookup or network request is performed."
  },
  "Network & File Inspector": {
    operations: ["data.inspect"],
    prompt: "Inspect this HTTP message and summarize its headers without sending it.",
    note: "Offline parsing only. File signatures are not malware scanning or a safety verdict."
  },
  "Date & Time": {
    operations: ["datetime.convert", "datetime.arithmetic", "datetime.compare"],
    prompt: "Convert this ISO timestamp to Unix milliseconds, add two hours, and compare it with another timestamp.",
    note: "Timestamps require an explicit UTC offset. Arithmetic uses elapsed UTC time, not calendar-day rules across daylight-saving changes."
  },
  "Workflow & Batch Workbench": {
    operations: ["execute_workflow"],
    prompt: "Decode this Base64 value, validate the decoded JSON, and format valid JSON as a final step.",
    note: "Workflows run sequentially, use only approved operations, and have finite step, output, and time budgets."
  }
};

const words = {
  en: { button: "AI / MCP help", title: "AI / MCP help", close: "Close help", status: "Available operations", prompt: "Example task prompt", privacy: "Privacy and data transfer", privacyText: "An MCP call sends its supplied input to the MCP server configured by your client. Files selected in this browser are not automatically accessible to a remote MCP server. Transfer file content only when you explicitly choose to send it.", setup: "Self-hosted setup", setupText: "Configure your self-hosted GaGet.dev endpoint and a bearer token provided by the administrator. Set MCP_AUTH_TOKEN on the server; do not place the token in public pages, shared examples, or source control.", endpoint: "Endpoint pattern", copy: "Copy endpoint", copied: "Copied", limits: "Limits and behavior", help: "Copy task prompt", copiedPrompt: "Prompt copied", operation: "Operation IDs", hint: "This panel documents the verified server subset. It is not a live connection indicator or a remote execution control." },
  fa: { button: "راهنمای هوش مصنوعی / MCP", title: "راهنمای هوش مصنوعی / MCP", close: "بستن راهنما", status: "عملیات در دسترس", prompt: "نمونه درخواست", privacy: "حریم خصوصی و انتقال داده", privacyText: "درخواست MCP داده ورودی را به سروری می‌فرستد که در کارخواه تنظیم کرده‌اید. فایل‌های انتخاب‌شده در این مرورگر به‌طور خودکار در دسترس سرور راه دور نیستند. فقط زمانی محتوای فایل را ارسال کنید که صریحاً این کار را انتخاب کرده باشید.", setup: "راه‌اندازی میزبانی‌شده توسط خودتان", setupText: "نشانی نمونه GaGet.dev خودمیزبان و توکن Bearer ارائه‌شده توسط مدیر را تنظیم کنید. متغیر MCP_AUTH_TOKEN را روی سرور تعریف کنید؛ توکن را در صفحات عمومی، نمونه‌های اشتراکی یا کنترل نسخه قرار ندهید.", endpoint: "الگوی نشانی", copy: "کپی نشانی", copied: "کپی شد", limits: "محدودیت‌ها و رفتار", help: "کپی درخواست نمونه", copiedPrompt: "درخواست کپی شد", operation: "شناسه عملیات", hint: "این پنل زیرمجموعه عملیات سرورِ تأییدشده را توضیح می‌دهد؛ نشانگر اتصال زنده یا کنترل اجرای راه دور نیست." },
  ar: { button: "مساعدة الذكاء الاصطناعي / MCP", title: "مساعدة الذكاء الاصطناعي / MCP", close: "إغلاق المساعدة", status: "العمليات المتاحة", prompt: "مثال على طلب", privacy: "الخصوصية ونقل البيانات", privacyText: "يرسل طلب MCP المدخلات إلى خادم MCP الذي يحدده العميل. لا يمكن للخادم البعيد الوصول تلقائياً إلى الملفات المحددة في هذا المتصفح. لا ترسل محتوى الملفات إلا عندما تختار ذلك صراحةً.", setup: "الإعداد للاستضافة الذاتية", setupText: "اضبط عنوان GaGet.dev المستضاف ذاتياً ورمز Bearer الذي يقدمه المسؤول. عيّن MCP_AUTH_TOKEN على الخادم؛ لا تضع الرمز في صفحات عامة أو أمثلة مشتركة أو نظام التحكم بالإصدارات.", endpoint: "نمط نقطة النهاية", copy: "نسخ نقطة النهاية", copied: "تم النسخ", limits: "الحدود والسلوك", help: "نسخ مثال الطلب", copiedPrompt: "تم نسخ الطلب", operation: "معرّفات العمليات", hint: "توضح هذه اللوحة مجموعة العمليات المتاحة على الخادم والمتحقق منها؛ وليست مؤشراً لاتصال مباشر أو أداة تنفيذ عن بُعد." }
} as const;

export function McpHelp({ title, compact = false, iconOnly = false }: { title: string; compact?: boolean; iconOnly?: boolean }) {
  const contract = contracts[title];
  const { locale } = useI18n();
  const direction = localeDirections[locale];
  const t = words[locale as keyof typeof words] ?? words.en;
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<"endpoint" | "prompt" | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const endpoint = "https://YOUR-HOST/api/mcp";

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
      }
      if (event.key === "Tab" && panelRef.current) {
        const items = [...panelRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], textarea, input')];
        if (!items.length) return;
        const first = items[0], last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      triggerRef.current?.focus();
    };
  }, [open]);

  if (!contract) return null;

  async function copyValue(value: string, kind: "endpoint" | "prompt") {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(kind);
    } catch {
      setCopied(null);
    }
  }

  return (
    <>
      <div className={compact ? "inline-flex" : "flex justify-end py-2"}>
        <Button ref={triggerRef} type="button" variant="outline" size={iconOnly ? "icon" : "sm"} onClick={() => { setCopied(null); setOpen(true); }} aria-label={iconOnly ? t.button : undefined} aria-haspopup="dialog" title={iconOnly ? t.button : undefined}>
          <Bot className="h-4 w-4" aria-hidden="true" />{iconOnly ? null : <> {t.button}</>}
        </Button>
      </div>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/50 p-3 pt-[8vh] sm:p-6" onMouseDown={event => { if (event.target === event.currentTarget) setOpen(false); }}>
          <section ref={panelRef} role="dialog" aria-modal="true" aria-labelledby="mcp-help-title" dir={direction} className="w-full max-w-2xl rounded-xl border border-border bg-background p-4 text-foreground shadow-xl sm:p-6">
            <header className="flex items-start justify-between gap-4">
              <div><h2 id="mcp-help-title" className="text-lg font-semibold">{t.title}</h2><p className="mt-1 text-sm text-muted-foreground">{title}</p></div>
              <Button ref={closeRef} type="button" variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label={t.close}><X className="h-4 w-4" /></Button>
            </header>
            <div className="mt-5 space-y-5 text-sm">
              <section><h3 className="font-semibold">{t.status}</h3><ul className="mt-2 flex flex-wrap gap-2">{contract.operations.map(operation => <li key={operation} className="rounded-md border border-border bg-muted px-2 py-1 font-mono text-xs">{operation}</li>)}</ul></section>
              <section><h3 className="font-semibold">{t.prompt}</h3><p className="mt-2 rounded-lg bg-muted p-3 leading-6">{contract.prompt}</p><Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => void copyValue(contract.prompt, "prompt")}><Copy className="h-3.5 w-3.5" />{copied === "prompt" ? t.copiedPrompt : t.help}</Button></section>
              <section><h3 className="font-semibold">{t.limits}</h3><p className="mt-2 leading-6 text-muted-foreground">{contract.note}</p><p className="mt-2 text-xs leading-5 text-muted-foreground">{t.hint}</p></section>
              <section><h3 className="font-semibold">{t.privacy}</h3><p className="mt-2 leading-6 text-muted-foreground">{t.privacyText}</p></section>
              <section><h3 className="font-semibold">{t.setup}</h3><p className="mt-2 leading-6 text-muted-foreground">{t.setupText}</p><div className="mt-2 flex flex-wrap items-center gap-2"><code className="rounded-md border border-border bg-muted px-3 py-2">{endpoint}</code><Button type="button" size="sm" variant="outline" onClick={() => void copyValue(endpoint, "endpoint")}><Copy className="h-3.5 w-3.5" />{copied === "endpoint" ? t.copied : t.copy}</Button></div></section>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
