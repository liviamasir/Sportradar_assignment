"# Sportradar_assignment"

SPORT EVENT CALENDAR OVERVIEW

Sport Events Calendar is a lightweight web app that lets you browse upcoming sports matches in a simple interactive calendar.
Each date shows if there’s a match scheduled, and you can hover to preview details or click to open a full event view.

The app is built with HTML, CSS, and vanilla JavaScript — no frameworks or libraries needed. It loads match data from a local data.json file and dynamically updates the page based on user interactions.

Main features - Interactive calendar with highlighted event days - Tooltip with quick event info on hover - Click on a day to open detailed event info (teams, time, competition) - Option to choose between multiple events on the same day - One-page layout — everything handled through JavaScript - Simple and clean UI with responsive design

HOW TO RUN IT

1. Clone or download this repo:

   git clone https://github.com/liviamasir/Sportradar_assignment.git

2. Open the folder in your code editor.

3. Make sure these files are in the same directory:

   - index.html
   - script.js
   - eventDetail.js
   - data.json
   - styles.css

4. Just open index.html in your browser — no setup or server required.

5. You’ll see the November 2025 calendar with events loaded from data.json.

   That’s it — everything runs right in your browser

ASSUMPTIONS & DECISIONS

    - The app assumes that data.json has the same structure as in the given dataset (with keys like dateVenue, homeTeam, awayTeam, originCompetitionName, timeVenueUTC).
    - I used only one HTML file (index.html) — all content (including event details) is handled dynamically with JavaScript.
    - Dates are displayed in the DD.MM.YYYY format for better readability.
    - When there’s more than one event on the same day, the user can choose which one to view.
    - No external libraries or frameworks — just plain JS, HTML, and CSS.
    - The UI is intentionally minimal and easy to navigate.
