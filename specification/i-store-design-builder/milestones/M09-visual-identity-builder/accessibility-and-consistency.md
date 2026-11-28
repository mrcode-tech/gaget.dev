# M09 — Accessibility and Consistency Review

## Accessibility baseline

Use WCAG 2.2 Level AA contrast criteria as the identity builder's baseline.

### Contrast thresholds

| Content or visual element | Minimum contrast ratio |
|---|---:|
| Normal text | 4.5:1 |
| Large text | 3:1 |
| Meaningful non-text UI components and graphical information | 3:1 where the applicable WCAG criterion requires it |

Use the WCAG definitions for large text and applicable exceptions. Do not apply the large-text threshold to text that does not qualify.

## What is evaluated

The evaluator considers authored semantic palette combinations and the actual combinations used in representative compatible sample previews, including:
- Text against background and surface roles.
- Muted text against its actual background.
- Interactive labels and button text against button surfaces.
- Meaningful control boundaries/states where non-text contrast applies.
- Meaningful graphical information where the criterion applies.
- Focus/interaction states as part of broader accessibility review, without treating contrast ratio as the only accessibility requirement.

The evaluator should report the foreground/background roles, calculated ratio, applicable target, and result. It must not imply that every theoretically possible color combination is in use.

## User-facing behavior

- Preview relevant combinations while a user explores or adjusts a palette.
- Clearly identify failing combinations and their roles.
- Explain the target in plain language.
- Offer optional authored palette alternatives or supported adjustments.
- Let the user decide whether to change a selected value.
- Never silently rewrite user-selected colors.
- Do not block exploration or confirmation solely because a contrast finding exists.
- Distinguish contrast findings from structural validation errors.

## Scope of the claim

Passing the identity-level checks does not certify every eventual page state as WCAG conformant. User-supplied imagery, arbitrary future content, sample-specific states, and later implementation details require their own applicable checks. M09 defines a baseline identity review, not a universal accessibility certification.

## Consistency review dimensions

### Color
- Semantic roles are used consistently by compatible samples.
- Primary, secondary, and accent emphasis is understandable.
- Background, surface, text, muted text, and border roles remain distinguishable.
- Feedback roles remain semantically recognizable.
- Applicable contrast combinations are reported.

### Typography
- Heading and body hierarchy is consistent.
- Font pairing is used according to its authored role mapping.
- Labels, captions, and supporting text remain legible.
- Long and short synthetic content is previewed.
- Fallback behavior is understandable where the selected font is unavailable.

### Shared styles
- Compatible buttons/forms consume the declared shared style.
- Sample-specific supported variants remain intentional.
- Unsupported samples are not silently restyled.
- Focus, disabled, and feedback states remain understandable.

### Responsive presentation
- Identity tokens remain coherent across desktop, tablet, and mobile.
- Responsive sample layouts preserve their intended hierarchy and function.
- No identity mapping causes clipping, overlap, or unintended overflow in reviewed examples.
- M06 ordering, visibility, and presentation invariants remain intact.

## Review output

The review is a list of findings with category, affected role/sample/view, explanation, and suggested user-controlled next action. It is not an aesthetic score, ranking, badge, reward, or automatic correction mechanism.

## Related requirements

- M03 defines Builder Interface accessibility and theme requirements; these remain separate from website identity.
- M07 owns sample publication quality and accessibility review.
- M09 evaluates project identity and its representative application.
- Later milestones must continue accessibility review for actual content and complete page experiences.
