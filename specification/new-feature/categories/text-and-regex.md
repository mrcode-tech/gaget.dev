# Text & Regular Expressions

| ID | Operation | Acceptance criteria |
|---|---|---|
| text.regex-test | Pattern, flags, matches, captures | Syntax errors inline; supported engine/flags explicit; zero-width global matches terminate |
| text.regex-replace | Replacement preview | Match count/preview; source changes only after explicit action |
| text.find-replace | Literal or regex find/replace | Modes distinct; invalid regex prevents transform |
| text.split-join | Split/join by delimiter or regex | Empty delimiter/trailing segment policy explicit |
| text.trim | Trim selected whitespace | Unicode whitespace policy explicit |
| text.sort-dedupe | Sort lines/dedupe | Case, locale, stability and blank-line behavior explicit |
| text.case | Case conversion | Supported transformations and locale/Unicode behavior documented |
| text.unicode-normalize | NFC/NFD/NFKC/NFKD | Combining marks tested; explain code-point changes |
| text.escape | Escape/unescape supported formats | Format explicit; malformed sequences fail; never render untrusted HTML |
| text.statistics | Character/code point/word/line/UTF-8 byte counts | Counting model labelled; UTF-16 units and code points not conflated |
| text.diff | Text comparison | Additions/removals clear; line-ending/whitespace policy explicit |

## Regex Tester planned-tool contract
Registry ID regex-tester; route candidate /text/regex; status planned. Separate pattern, flags and sample text. Show match count, ranges, captures and navigation. Replacement is a separate mode/panel. Invalid patterns preserve source. Test empty/malformed patterns, Unicode, zero-width matches, large input and pathological patterns. Apply bounded behavior where possible; do not claim reliable interruption of browser regex execution unless implemented.

See [wireframes](../wireframes/workspace-layouts.md#text--regular-expressions). Desktop may place settings beside sample/results; mobile stacks them and keeps match navigation reachable. Long outputs need explicit scroll ownership.

## Acceptance
Known fixtures cover every transform. Unicode counts are labelled by model. Errors are actionable. Keyboard users navigate matches and inspect captures. Reset scope is clear.
