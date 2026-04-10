# Frontend Stage 0 - Testable Todo Item Card

## Overview
This project features a clean, modern, and highly testable Todo and Task Card component built completely without frameworks, using purely HTML, CSS, and Vanilla JavaScript. The design system is luxurious, taking cues from a dark-themed portfolio, utilizing a true black background with sharp inner shadows and distinct Gold, Ice Cyan, and Orange accent colors. 

The primary focus of this build is on testability (featuring strict data-testid attributes), accessibility, and responsiveness.

## Features
- Framework-less Setup: Built from scratch with only HTML, CSS, and JavaScript.
- Automated Testing Ready: Strictly implemented data-testid attributes mapped correctly across appropriate semantic HTML elements to ensure seamless DOM targeting.
- Accessible: Uses aria-labels, targeted semantic HTML (such as article, time, ul with role="list"), and visually-hidden screen reader labels (sr-only classes) to meet WCAG AA contrast and standards. Includes aria-live="polite" properties for dynamically shifting content.
- Fully Responsive: Tested actively from 320px to 1200px. Provides comfortable max-widths on desktop resolutions while collapsing to full-width vertically stacked layouts on mobile without horizontal layout shifts.
- Interactive JS Behaviours: Includes fully functional Edit (inline content-editable field conversion) and Delete (animated DOM parsing to empty state) behaviors. The card also provisions a real-time 'due date' countdown updated dynamically inside an interval loop.

## Usage
To view and interact with the component:
1. Clone or download the repository.
2. Open index.html directly in any modern web browser. No compilation or start scripts are required.

## Data-TestID Reference
The component surfaces the following data-testid bindings mapped exactly to the specification for end-to-end testing frameworks:

- test-todo-card: Appended to the root article container.
- test-todo-title: Bound to the interactive heading element. 
- test-todo-description: Bound to the main paragraph element.
- test-todo-priority: Applies to the visual badge signaling task importance.
- test-todo-status: Applies to the badge indicating current state (Pending / Done).
- test-todo-due-date: Mapped to the semantic time element holding the due date string.
- test-todo-time-remaining: Provides a frequently updating hint regarding the time left.
- test-todo-complete-toggle: An executable input checkbox indicating resolution status.
- test-todo-tags: Tied to the unordered list handling categorical chips.
- test-todo-tag-work / test-todo-tag-urgent: Direct references to child tags inside the list. 
- test-todo-edit-button: Triggers the inline edit manipulation script.
- test-todo-delete-button: Triggers the DOM removal/replacement script.

## File Architecture
- index.html: Contains the semantic foundation, document accessibility logic, and font loading parameters.
- style.css: Manages layouts, responsive shifts, CSS variable tokens, transitions, and hover interactions.
- script.js: Powers the interactive functionality, math calculations for relative time handling, and DOM manipulations.