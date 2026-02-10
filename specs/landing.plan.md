# Landing page spec

## Application Overview

Focal Point Editor is a web app for cropping images in responsive layouts using a focal point. The root path (/) shows a landing view where the user can read the project description and start by using an upload button.

## Test Scenarios

### 1. Landing page

**File:** `e2e/landing.spec.ts`

**Steps:**
  1. Visit the root path '/'
    - expect: The project description section is visible (target by structure or test id, not by exact copy, so the wording can change).
    - expect: An upload button is visible.
