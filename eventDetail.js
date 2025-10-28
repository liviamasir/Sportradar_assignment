function showEventDetails(event) {
  const calendarDiv = document.getElementById("calendar");
  calendarDiv.style.display = "none";
  const formattedDate = event.dateVenue
    ? event.dateVenue.split("-").reverse().join(".")
    : "?";

  const container = document.getElementById("event-day");
  container.innerHTML = `
    <h2>${event.homeTeam?.name || "?"} vs ${event.awayTeam?.name || "?"}</h2>
    <p>Date: ${formattedDate}</p>
    <p>Time: ${event.timeVenueUTC}</p>
    <p>Sport: ${event.sport || "?"}</p>
    
    <button id="back-btn">Back to calendar</button>
  `;
  container.style.display = "block";

  document.getElementById("back-btn").addEventListener("click", () => {
    container.style.display = "none";
    calendarDiv.style.display = "block";
  });
}
