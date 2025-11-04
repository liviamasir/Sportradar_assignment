let eventsDates = {};

fetch("data.json")
  .then((response) => response.json())
  .then((data) => {
    const events = data.data || [];

    const customEvents = JSON.parse(localStorage.getItem("customEvents")) || [];
    const combinedEvents = [...events, ...customEvents];

    const allEvents = combinedEvents.filter((event, index, self) => {
      return (
        index ===
        self.findIndex(
          (e) =>
            e.dateVenue === event.dateVenue &&
            e.homeTeam?.name === event.homeTeam?.name &&
            e.awayTeam?.name === event.awayTeam?.name
        )
      );
    });

    allEvents.forEach((event) => {
      if (!event.dateVenue) return;

      const key = event.dateVenue;
      if (!eventsDates[key]) eventsDates[key] = [];
      eventsDates[key].push(event);
    });
    const params = new URLSearchParams(window.location.search);
    const dateParam = params.get("date");
    const homeParam = params.get("home");
    const awayParam = params.get("away");

    const currentYear = new Date().getFullYear();
    const defaultMonth = 11;

    if (dateParam && homeParam && awayParam) {
      showEventDetails({
        dateVenue: dateParam,
        homeTeam: { slug: homeParam, name: homeParam },
        awayTeam: { slug: awayParam, name: awayParam },
        originCompetitionName: "AFC Champions League",
        timeVenueUTC: "16:00:00",
      });
    } else {
      createMonthSelector(currentYear, defaultMonth);
      generateCalendar(currentYear, defaultMonth);
    }
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });

function createMonthSelector(year, selectedMonth) {
  const existingSelector = document.getElementById("month-selector");
  if (existingSelector) {
    existingSelector.remove();
  }
  const container = document.createElement("div");
  container.id = "month-selector";
  container.style.textAlign = "center";
  container.style.margin = "20px auto";

  const label = document.createElement("label");

  const select = document.createElement("select");
  select.id = "month";
  select.style.padding = "8px 12px";
  select.style.borderRadius = "8px";
  select.style.border = "1px solid #ccc";
  select.style.fontFamily = "inherit";

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  months.forEach((m, index) => {
    const option = document.createElement("option");
    option.value = index + 1;
    option.textContent = m;
    if (index + 1 === selectedMonth) option.selected = true;
    select.appendChild(option);
  });
  select.addEventListener("change", () => {
    const selectedMonth = parseInt(select.value);
    generateCalendar(year, selectedMonth);
  });

  container.appendChild(label);
  container.appendChild(select);

  const calendarContainer = document.getElementById("calendar");
  calendarContainer.parentNode.insertBefore(container, calendarContainer);
}

function generateCalendar(year, month) {
  const calendarDiv = document.getElementById("calendar");
  const date = new Date(year, month - 1);
  const monthName = date.toLocaleString("en", { month: "long" });
  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();

  let table = "<table><thead><tr>";
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  for (let day of days) {
    table += `<th>${day}</th>`;
  }
  table += "</tr></thead><tbody><tr>";

  let startDay = firstDay === 0 ? 6 : firstDay - 1;

  for (let i = 0; i < startDay; i++) {
    table += '<td class="empty"></td>';
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateString = `${year}-${String(month).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    const hasEvent = eventsDates[dateString];
    const currentDate = new Date();
    const isToday =
      day === currentDate.getDate() &&
      month - 1 === currentDate.getMonth() &&
      year === currentDate.getFullYear();

    table += `<td 
      class="${isToday ? "today" : ""} ${hasEvent ? "event-day" : ""}" 
      data-date="${dateString}"
    >
      ${day}${hasEvent ? "<br>•" : ""}
    </td>`;

    if ((startDay + day) % 7 === 0) {
      table += "</tr><tr>";
    }
  }

  const totalCells = startDay + daysInMonth;
  const remainingCells = 7 - (totalCells % 7);

  if (remainingCells < 7) {
    for (let i = 0; i < remainingCells; i++) {
      table += `<td class="empty"></td>`;
    }
  }

  table += "</tr>";

  table += "</tr></tbody></table>";
  calendarDiv.innerHTML = `<h2>${monthName} ${year}</h2>` + table;

  let tooltip = document.getElementById("tooltip");
  if (!tooltip) {
    tooltip = document.createElement("div");
    tooltip.id = "tooltip";
    document.body.appendChild(tooltip);
  }

  document.querySelectorAll(".event-day").forEach((cell) => {
    const date = cell.dataset.date;
    const events = eventsDates[date];

    cell.addEventListener("mouseenter", () => {
      tooltip.innerHTML = events
        .map(
          (ev) => `
          <div class="tooltip-item">
            ${ev.homeTeam?.name || "Unknown"} <small>vs</small> ${
            ev.awayTeam?.name || "Unknown"
          }<br>
          </div>
        `
        )
        .join("<br>");
      tooltip.style.display = "block";
    });

    cell.addEventListener("mousemove", (e) => {
      tooltip.style.left = e.pageX + 10 + "px";
      tooltip.style.top = e.pageY + 10 + "px";
    });

    cell.addEventListener("mouseleave", () => {
      tooltip.style.display = "none";
    });

    cell.addEventListener("click", () => {
      if (events.length === 1) {
        showEventDetails(events[0]);
      } else {
        const modal = document.createElement("div");
        modal.className = "event-modal";
        modal.innerHTML = `
      <div class="event-modal-content">
        <h3>Select a match</h3>
        <ul>
          ${events
            .map(
              (ev, index) => `
              <li>
                <button class="match-btn" data-index="${index}">
                  ${ev.homeTeam?.name || "?"} vs ${ev.awayTeam?.name || "?"}
                </button>
              </li>`
            )
            .join("")}
        </ul>
        <button id="close-modal">Cancel</button>
      </div>
    `;
        document.body.appendChild(modal);

        modal.querySelectorAll(".match-btn").forEach((btn) => {
          btn.addEventListener("click", () => {
            const event = events[btn.dataset.index];
            modal.remove();
            showEventDetails(event);
          });
        });

        modal.querySelector("#close-modal").addEventListener("click", () => {
          modal.remove();
        });
      }
    });
  });
}
