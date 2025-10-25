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
    const currentDate = new Date();
    const isToday =
      day === currentDate.getDate() &&
      month - 1 === currentDate.getMonth() &&
      year === currentDate.getFullYear();

    table += `<td class="${isToday ? "today" : ""}">${day}</td>`;

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
}

generateCalendar(2025, 10);
