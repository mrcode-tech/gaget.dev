import test from "node:test";
import assert from "node:assert/strict";
import { locales, localeNames, localeDirections, indexableLocales, isLocaleIndexable, translate } from "../lib/i18n/messages.ts";

test("locale metadata is complete and internally consistent", () => {
  assert.ok(locales.includes("en"), "English must be supported");
  assert.equal(new Set(locales).size, locales.length, "locale identifiers must be unique");
  for (const locale of locales) {
    assert.ok(localeNames[locale], `missing display name for ${locale}`);
    assert.ok(["ltr", "rtl"].includes(localeDirections[locale]), `invalid text direction for ${locale}`);
  }
});

test("only explicitly approved locales are indexable", () => {
  for (const locale of indexableLocales) {
    assert.ok(locales.includes(locale), `indexable locale ${locale} must be supported`);
    assert.equal(isLocaleIndexable(locale), true);
  }
  assert.equal(isLocaleIndexable("en"), true);
  assert.equal(isLocaleIndexable("fa"), false);
  assert.equal(isLocaleIndexable("ar"), false);
});


test("home footer copy matches the selected locale", () => {
  const footerTranslations = {
    en: ["Useful tools for everyday life.", "Made for clarity, convenience, and privacy."],
    fa: ["ابزارهای کاربردی برای زندگی روزمره.", "برای شفافیت، راحتی و حفظ حریم خصوصی طراحی شده‌اند."],
    ar: ["أدوات مفيدة للحياة اليومية.", "مصممة لتوفير الوضوح والسهولة والخصوصية."],
    es: ["Herramientas útiles para el día a día.", "Diseñadas para ofrecer claridad, comodidad y privacidad."],
    "zh-CN": ["日常生活的实用工具。", "注重清晰、便捷与隐私。"],
    "pt-BR": ["Ferramentas úteis para o dia a dia.", "Feitas para oferecer clareza, praticidade e privacidade."],
    fr: ["Des outils utiles au quotidien.", "Pensés pour la clarté, la simplicité et la confidentialité."],
    de: ["Nützliche Tools für den Alltag.", "Für Übersichtlichkeit, Komfort und Datenschutz entwickelt."],
    ja: ["毎日の暮らしに役立つツール。", "わかりやすさ、使いやすさ、プライバシーを大切に。"],
    hi: ["रोज़मर्रा के लिए उपयोगी टूल।", "स्पष्टता, सुविधा और गोपनीयता के लिए बनाए गए।"],
    ru: ["Полезные инструменты на каждый день.", "С акцентом на ясность, удобство и конфиденциальность."],
    id: ["Alat berguna untuk keseharian.", "Dirancang untuk kejelasan, kemudahan, dan privasi."],
    ko: ["일상에 유용한 도구.", "명확함, 편리함, 개인정보 보호를 생각합니다."],
    "zh-TW": ["日常生活的實用工具。", "重視清晰、便利與隱私。"],
    it: ["Strumenti utili ogni giorno.", "Pensati per chiarezza, praticità e privacy."],
  };

  assert.deepEqual(Object.keys(footerTranslations).sort(), [...locales].sort());
  for (const locale of locales) {
    assert.equal(translate(locale, "home.footer"), footerTranslations[locale][0], `footer mismatch for ${locale}`);
    assert.equal(translate(locale, "home.footerDetail"), footerTranslations[locale][1], `footer detail mismatch for ${locale}`);
  }
});
