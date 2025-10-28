let eventsDates = {};

fetch("data.json")
  .then((response) => response.json())
  .then((data) => {
    const events = data.data || [];

    events.forEach((event) => {
      if (!event.dateVenue) return;

      const key = event.dateVenue;
      if (!eventsDates[key]) eventsDates[key] = [];
      eventsDates[key].push(event);
    });
    const params = new URLSearchParams(window.location.search);
    const dateParam = params.get("date");
    const homeParam = params.get("home");
    const awayParam = params.get("away");

    if (dateParam && homeParam && awayParam) {
      showEventDetails({
        dateVenue: dateParam,
        homeTeam: { slug: homeParam, name: homeParam },
        awayTeam: { slug: awayParam, name: awayParam },
        originCompetitionName: "AFC Champions League",
        timeVenueUTC: "16:00:00",
      });
    } else {
      generateCalendar(2025, 11);
    }
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });

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
      const event = events[0];
      showEventDetails(event);
    });
  });
}
