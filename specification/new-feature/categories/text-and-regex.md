# Text & Regular Expressions

**Status:** Core text and regex operations implemented in the shared `/text/regex` workbench. Replacement previews, line transforms, Unicode normalization, escaping, statistics, and bounded line diff are available; regex evaluation runs in an isolated worker that is terminated after a 1-second time limit.

| ID | Operation | Acceptance criteria |
|---|---|---|
| text.regex-test | Pattern, flags, matches, captures | Syntax errors inline; supported engine/flags explicit; zero-width global matches terminate |
| text.regex-replace | Replacement preview | Implemented; match count and output preview; source changes only after explicit action |
| text.find-replace | Literal or regex find/replace | Implemented; modes distinct; invalid regex prevents transform |
| text.split-join | Split/join by delimiter or regex | Implemented for exact delimiters; empty delimiters rejected; trailing empty segments preserved |
| text.trim | Trim selected whitespace | Implemented for both ends, leading only, or trailing only using JavaScript Unicode whitespace behavior |
| text.sort-dedupe | Sort lines/dedupe | Implemented with deterministic code-unit sort and exact deduplication; blank lines are preserved as values |
| text.case | Case conversion | Implemented upper/lower/title case with JavaScript Unicode mappings |
| text.unicode-normalize | NFC/NFD/NFKC/NFKD | Implemented; combining marks tested; code-point sequences may change |
| text.escape | Escape supported formats | Implemented HTML-entity and JSON-string-content escaping; output is never rendered as active markup |
| text.statistics | Character/code point/word/line/UTF-8 byte counts | Implemented; labels distinguish code points, whitespace-delimited words, logical lines and UTF-8 bytes |
| text.diff | Text comparison | Implemented bounded line-level additions/removals; normalizes CRLF/CR to LF for line comparison |

## Text & Regex Workbench contract
Registry ID regex-tester; canonical route `/text/regex` remains stable. The operation selector includes regex matching/replacement, literal or regex find/replace, split/join, trim, line sort/deduplication, case conversion, Unicode normalization, HTML/JSON escaping, text statistics and bounded line diff. Regex results and replacement are previews; the source input is never overwritten. Regex input is limited to 50,000 characters and match output to 500 results. Browser regex execution cannot be reliably interrupted, so pathological patterns are isolated from the UI thread; the worker is terminated after 1 second and the input remains unchanged.

See [wireframes](../wireframes/workspace-layouts.md#text--regular-expressions). Desktop may place settings beside sample/results; mobile stacks them and keeps match navigation reachable. Long outputs need explicit scroll ownership.

## Acceptance
Known fixtures cover every transform. Unicode counts are labelled by model. Errors are actionable. Keyboard users navigate matches and inspect captures. Reset scope is clear.
