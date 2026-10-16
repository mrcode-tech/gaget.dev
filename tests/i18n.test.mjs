import test from "node:test";
import assert from "node:assert/strict";
import { locales, localeNames, localeDirections, indexableLocales, isLocaleIndexable } from "../lib/i18n/messages.ts";

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
