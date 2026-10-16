import type { Metadata } from "next";
import { headers } from "next/headers";
import { HomeContent } from "@/components/home-content";
import { isLocale } from "@/lib/i18n/messages";

export async function generateMetadata(): Promise<Metadata> {
  const h = await headers();
  const raw = h.get("x-gaget-locale") || "en";
  const locale = isLocale(raw) ? raw : "en";
  const copy = {
    en: {
      title: "Useful Online Tools for Everyday Tasks",
      description: "Discover simple, free online tools for editing images, working with text, converting dates, and more.",
    },
    fa: {
      title: "ابزارهای آنلاین کاربردی برای کارهای روزمره",
      description: "ابزارهای آنلاین رایگان و ساده برای ویرایش تصویر، کار با متن، تبدیل تاریخ و کارهای روزمره دیگر.",
    },
    ar: {
      title: "أدوات مفيدة عبر الإنترنت للمهام اليومية",
      description: "اكتشف أدوات مجانية وبسيطة لتحرير الصور والعمل مع النصوص وتحويل التواريخ والمزيد.",
    },
  }[locale === "fa" || locale === "ar" ? locale : "en"];

  return {
    title: copy.title,
    description: copy.description,
    alternates: { canonical: "/", languages: { en: "/", fa: "/fa", ar: "/ar" } },
    openGraph: { title: copy.title, description: copy.description, url: "/", type: "website" },
  };
}

export default function HomePage() {
  return <HomeContent />;
}
