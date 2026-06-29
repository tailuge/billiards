# Plan of Work: Three-Cushion Exam Page

This plan outlines the steps to create a new exam page for three-cushion billiards, featuring interactive SVG diagrams and the ability to play shots in an integrated game environment.

## 1. Directory and File Setup
- Create a new directory `dist/exam/`.
- Create a new file `dist/exam/threecushion.html`.

## 2. HTML Structure of `threecushion.html`
- **Header Section**: Title and brief instructions.
- **Question List Section**: A summary list of questions with their current status (Pass/Fail/Unknown).
- **Questions Container**: A main section containing individual question blocks.
- **Question Block**:
    - A div containing a description (HTML) and an SVG simulation.
    - Responsive layout: Side-by-side on wide screens (desktop), stacked on narrow screens (mobile).
    - A "Play" button to launch the game.
- **Game Overlay**: A hidden div containing an `iframe` and a close button, used to show the game at 75% screen size.

## 3. Styling (CSS)
- Incorporate base styles from `dist/diagrams/svg.html` for the billiards table and trajectories.
- Add responsive grid/flexbox styles for the question blocks.
- Style the question list and status indicators.
- Style the game overlay to be centered and modal-like.

## 4. SVG Integration
- Link to `../diagrams/svg.js` as a module.
- Use the `.billiards-table` class and `data-json-shots` or `data-shots` attributes.
- Initialize diagrams using `initDiagrams()`.

## 5. "Play" Button Logic (JavaScript)
- Implement a click handler for the "Play" buttons.
- The handler will:
    - Identify the associated SVG element.
    - Extract its shot configuration.
    - Construct a game state URL: `../../index.html?ruletype=threecushion&state=...`.
    - Set the `iframe` source to this URL and display the overlay.
- Implement an overlay close button logic.

## 6. Content Implementation
- **Question 1**: Use the first SVG from `dist/diagrams/svg.html`.
- Add a descriptive text for Question 1.
- Add placeholder questions to demonstrate the list and status UI.

## 7. Verification
- Verify SVG rendering in the new page.
- Verify responsive layout.
- Verify that clicking "Play" launches the game correctly.
- Verify the overlay 75% sizing and close functionality.
