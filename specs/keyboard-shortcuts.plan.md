# Keyboard shortcuts

> **Memo:** Always use Playwright dedicated models (Planner, Generator, Healer) when planning, adding, and reviewing e2e / integration tests.

## Application Overview

Editor keyboard shortcuts: u (upload), a/f (focal point), s/o (overflow), d/c (code snippet). Shortcuts are case-insensitive. Control+key or Command+key must not trigger (default browser behavior). Shift+key must trigger the shortcut. Control+C must copy selected text and must not trigger the code-snippet shortcut.

## Test Scenarios

### 1. Keyboard shortcuts

**Seed:** `e2e/seed.spec.ts`

#### 1.1. u opens file chooser for upload

**File:** `e2e/keyboard-shortcuts.spec.ts`

**Steps:**
  1. Go to / and upload sample image to reach editor
    - expect: Editor with bottom bar visible
  2. Press key 'u'
    - expect: File chooser opens (upload triggered)

#### 1.2. a and f toggle focal point (aria-pressed changes)

**File:** `e2e/keyboard-shortcuts.spec.ts`

**Steps:**
  1. Reach editor with image
    - expect: Focal point button visible
  2. Press 'a' then 'f' and check focal point button aria-pressed
    - expect: aria-pressed toggles

#### 1.3. s and o toggle image overflow (aria-pressed changes)

**File:** `e2e/keyboard-shortcuts.spec.ts`

**Steps:**
  1. Reach editor
    - expect: Overflow button visible
  2. Press 's' then 'o' and assert Overflow button aria-pressed toggles
    - expect: aria-pressed toggles

#### 1.4. d and c toggle code snippet (aria-pressed changes)

**File:** `e2e/keyboard-shortcuts.spec.ts`

**Steps:**
  1. Reach editor
    - expect: Code button visible
  2. Press 'd' then 'c'
    - expect: Code button aria-pressed toggles

#### 1.5. Control+key does not trigger shortcut (e.g. Control+u no file chooser)

**File:** `e2e/keyboard-shortcuts.spec.ts`

**Steps:**
  1. Reach editor
    - expect: Ready
  2. Press Control+u and wait short time
    - expect: File chooser does NOT open

#### 1.6. Shift+key triggers shortcut (e.g. Shift+U opens file chooser)

**File:** `e2e/keyboard-shortcuts.spec.ts`

**Steps:**
  1. Reach editor
    - expect: Ready
  2. Press Shift+U
    - expect: File chooser opens

#### 1.7. Shift+key triggers shortcut for toggle (e.g. Shift+A toggles focal point)

**File:** `e2e/keyboard-shortcuts.spec.ts`

**Steps:**
  1. Reach editor
    - expect: Focal point button visible
  2. Press Shift+A
    - expect: Focal point button aria-pressed toggles

#### 1.8. Control+C copies selected text and does not trigger shortcut

**File:** `e2e/keyboard-shortcuts.spec.ts`

**Steps:**
  1. Reach editor, open code snippet
    - expect: Code snippet visible
  2. Select code snippet text (Selection API)
    - expect: Text selected
  3. Press Control+C
    - expect: Code snippet stays open (shortcut did not fire)
    - expect: Selected text is copied to clipboard (contains object-fit)
