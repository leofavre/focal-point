# Bottom bar keyboard navigation (Tab order)

## Scope

When the user has uploaded an image and the editor is shown, the bottom bar is visible. It contains:

1. **Focal point** – toggle button
2. **Overflow** – toggle button
3. **Aspect ratio** – slider (range input)
4. **Code** – toggle button
5. **Upload** – button

## Requirement

Using the **Tab** key, the user must be able to move focus between these controls in the same order as they appear on screen (left to right). No control in the bottom bar may be skipped, and the order must match the visual order.

## Acceptance criteria

- After an image is uploaded and the bottom bar is visible, Tab key navigation moves focus through: Focal point → Overflow → Aspect ratio slider → Code → Upload.
- Each of the five controls is focusable and receives focus exactly once per full Tab cycle through the bar (assuming no other focusable elements between them in the same tab sequence).
