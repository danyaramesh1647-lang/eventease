// events data
// "days" means how many days from today the event happens,
// so the events are always upcoming whenever you open the page
const events = [
  {
    id: 1, title: "Sunset Live Concert", category: "Music", image: "images/concert.jpg",
    days: 5, time: "06:30 PM", venue: "Open Air Arena, Mumbai",
    regular: 499, vip: 999, seats: 120,
    desc: "An open air evening of live music with a full band, big lights and a great crowd."
  },
  {
    id: 2, title: "Electro DJ Night", category: "Music", image: "images/dj-night.jpg",
    days: 12, time: "08:00 PM", venue: "Skyline Club, Bengaluru",
    regular: 699, vip: 1499, seats: 80,
    desc: "Dance the night away with top DJs, electronic beats and a stunning light show."
  },
  {
    id: 3, title: "Premier Cricket Cup Final", category: "Sports", image: "images/cricket.jpg",
    days: 8, time: "02:00 PM", venue: "City Stadium, Chennai",
    regular: 399, vip: 899, seats: 200,
    desc: "Watch the final match of the season live from the stadium with thousands of fans."
  },
  {
    id: 4, title: "City Marathon 10K", category: "Sports", image: "images/marathon.jpg",
    days: 15, time: "06:00 AM", venue: "Lake View Park, Hyderabad",
    regular: 299, vip: 599, seats: 150,
    desc: "A friendly 10K run for beginners and regular runners. VIP includes a race kit and breakfast."
  },
  {
    id: 5, title: "Future Tech Summit", category: "Technology", image: "images/tech.jpg",
    days: 10, time: "09:30 AM", venue: "Convention Centre, Pune",
    regular: 799, vip: 1999, seats: 150,
    desc: "A full day of talks and demos on web, cloud and AI by industry speakers."
  },
  {
    id: 6, title: "24-Hour Hackathon", category: "Technology", image: "images/hackathon.jpg",
    days: 18, time: "10:00 AM", venue: "Innovation Hub, Bengaluru",
    regular: 199, vip: 499, seats: 60,
    desc: "Form a team, build a project in 24 hours and present it to a panel of judges."
  },
  {
    id: 7, title: "Pottery Workshop", category: "Workshops", image: "images/workshop.jpg",
    days: 7, time: "11:00 AM", venue: "Art Studio, Jaipur",
    regular: 599, vip: 1199, seats: 25,
    desc: "Learn to shape clay on the wheel and take your own pot home. VIP includes extra materials."
  },
  {
    id: 8, title: "Photography Masterclass", category: "Workshops", image: "images/photography.jpg",
    days: 21, time: "10:30 AM", venue: "Creative Hub, Kochi",
    regular: 899, vip: 1799, seats: 30,
    desc: "Learn camera basics, lighting and editing from a working photographer."
  },
  {
    id: 9, title: "Classical Dance Evening", category: "Cultural", image: "images/cultural.jpg",
    days: 9, time: "07:00 PM", venue: "Heritage Hall, Chennai",
    regular: 349, vip: 799, seats: 100,
    desc: "An evening of classical dance performances by celebrated artists."
  },
  {
    id: 10, title: "Folk Music and Food Fest", category: "Cultural", image: "images/folk-fest.jpg",
    days: 25, time: "05:00 PM", venue: "Cultural Grounds, Kolkata",
    regular: 249, vip: 649, seats: 180,
    desc: "Folk music, traditional dance and street food stalls from across the country."
  }
];

const MAX_TICKETS = 6;
const FEE_PERCENT = 5;

// helpers
function toDateString(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return y + "-" + m + "-" + d;
}

function formatDate(dateString) {
  const d = new Date(dateString + "T00:00:00");
  return d.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

function money(amount) {
  return "₹" + amount.toLocaleString("en-IN");
}

function safe(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// set the real date of every event
events.forEach(function (e) {
  const d = new Date();
  d.setDate(d.getDate() + e.days);
  e.date = toDateString(d);
});

// get elements
const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");
const searchInput = document.getElementById("search");
const dateFilter = document.getElementById("date-filter");
const clearDateBtn = document.getElementById("clear-date");
const categoryButtons = document.querySelectorAll(".cat-btn");
const resultCount = document.getElementById("result-count");
const eventGrid = document.getElementById("event-grid");
const resetBtn = document.getElementById("reset-btn");

const modal = document.getElementById("modal");
const modalClose = document.getElementById("modal-close");
const stepDetails = document.getElementById("step-details");
const stepForm = document.getElementById("step-form");
const stepConfirm = document.getElementById("step-confirm");
const ticketBox = document.getElementById("ticket-box");
const ticketError = document.getElementById("ticket-error");
const toFormBtn = document.getElementById("to-form");
const bookingForm = document.getElementById("booking-form");
const backBtn = document.getElementById("back-btn");
const formSummary = document.getElementById("form-summary");
const confirmDetails = document.getElementById("confirm-details");
const printBtn = document.getElementById("print-btn");
const doneBtn = document.getElementById("done-btn");

// state
let currentCategory = "all";
let currentEvent = null;
let regularQty = 0;
let vipQty = 0;
let maxTickets = MAX_TICKETS;
let bookings = JSON.parse(localStorage.getItem("eventease-bookings")) || [];

function saveBookings() {
  localStorage.setItem("eventease-bookings", JSON.stringify(bookings));
}

// seats left = total seats - tickets already booked
function seatsLeft(event) {
  let booked = 0;
  bookings.forEach(function (b) {
    if (b.eventId === event.id) {
      booked += b.regular + b.vip;
    }
  });
  return event.seats - booked;
}

// show event cards
function showEvents() {
  const text = searchInput.value.trim().toLowerCase();
  const fromDate = dateFilter.value;

  const list = events.filter(function (e) {
    const matchCategory = currentCategory === "all" || e.category === currentCategory;
    const matchSearch =
      e.title.toLowerCase().includes(text) || e.venue.toLowerCase().includes(text);
    const matchDate = !fromDate || e.date >= fromDate;
    return matchCategory && matchSearch && matchDate;
  });

  eventGrid.innerHTML = "";
  resultCount.textContent = list.length + (list.length === 1 ? " event found" : " events found");

  if (list.length === 0) {
    eventGrid.innerHTML = '<p class="no-result">No events found. Try a different search or filter.</p>';
    return;
  }

  list.forEach(function (e) {
    const left = seatsLeft(e);
    let seatText = left + " seats left";
    let seatClass = "seats";

    if (left <= 0) {
      seatText = "Sold out";
      seatClass = "seats out";
    } else if (left <= 10) {
      seatClass = "seats low";
    }

    const card = document.createElement("div");
    card.className = "event-card";
    card.innerHTML =
      '<div class="card-img">' +
        '<img src="' + e.image + '" alt="' + e.title + '">' +
        '<span class="tag">' + e.category + "</span>" +
      "</div>" +
      '<div class="card-body">' +
        "<h3>" + e.title + "</h3>" +
        "<p>" + formatDate(e.date) + " | " + e.time + "</p>" +
        "<p>" + e.venue + "</p>" +
        '<div class="card-bottom">' +
          '<div><span class="from">From</span><strong>' + money(e.regular) + "</strong></div>" +
          '<span class="' + seatClass + '">' + seatText + "</span>" +
        "</div>" +
        '<button class="view-btn" data-id="' + e.id + '">View Details</button>' +
      "</div>";
    eventGrid.appendChild(card);
  });
}

// popup steps
function showStep(name) {
  stepDetails.classList.add("hidden");
  stepForm.classList.add("hidden");
  stepConfirm.classList.add("hidden");

  if (name === "details") stepDetails.classList.remove("hidden");
  if (name === "form") stepForm.classList.remove("hidden");
  if (name === "confirm") stepConfirm.classList.remove("hidden");

  modal.querySelector(".modal-box").scrollTop = 0;
}

function openEvent(id) {
  currentEvent = events.find(function (e) {
    return e.id === id;
  });
  regularQty = 0;
  vipQty = 0;

  const left = seatsLeft(currentEvent);
  maxTickets = Math.min(MAX_TICKETS, Math.max(left, 0));

  document.getElementById("d-image").src = currentEvent.image;
  document.getElementById("d-image").alt = currentEvent.title;
  document.getElementById("d-category").textContent = currentEvent.category;
  document.getElementById("d-title").textContent = currentEvent.title;
  document.getElementById("d-desc").textContent = currentEvent.desc;
  document.getElementById("d-date").textContent = formatDate(currentEvent.date);
  document.getElementById("d-time").textContent = currentEvent.time;
  document.getElementById("d-venue").textContent = currentEvent.venue;
  document.getElementById("d-seats").textContent = left > 0 ? left : "Sold out";
  document.getElementById("regular-price").textContent = money(currentEvent.regular) + " per ticket";
  document.getElementById("vip-price").textContent = money(currentEvent.vip) + " per ticket";

  ticketError.textContent = left > 0 ? "" : "Sorry, this event is sold out.";
  toFormBtn.disabled = left <= 0;

  updateSummary();
  showStep("details");
  modal.classList.remove("hidden");
  document.body.classList.add("no-scroll");
}

function closeModal() {
  modal.classList.add("hidden");
  document.body.classList.remove("no-scroll");
}

// price calculation
function calculate() {
  const regularTotal = regularQty * currentEvent.regular;
  const vipTotal = vipQty * currentEvent.vip;
  const subtotal = regularTotal + vipTotal;
  const fee = Math.round((subtotal * FEE_PERCENT) / 100);

  return {
    regularTotal: regularTotal,
    vipTotal: vipTotal,
    subtotal: subtotal,
    fee: fee,
    total: subtotal + fee
  };
}

function updateSummary() {
  const c = calculate();

  document.getElementById("regular-qty").textContent = regularQty;
  document.getElementById("vip-qty").textContent = vipQty;

  const lineRegular = document.getElementById("line-regular");
  const lineVip = document.getElementById("line-vip");

  if (regularQty > 0) {
    lineRegular.classList.remove("hidden");
    document.getElementById("line-regular-label").textContent =
      "Regular x " + regularQty + " (" + money(currentEvent.regular) + " each)";
    document.getElementById("line-regular-amt").textContent = money(c.regularTotal);
  } else {
    lineRegular.classList.add("hidden");
  }

  if (vipQty > 0) {
    lineVip.classList.remove("hidden");
    document.getElementById("line-vip-label").textContent =
      "VIP x " + vipQty + " (" + money(currentEvent.vip) + " each)";
    document.getElementById("line-vip-amt").textContent = money(c.vipTotal);
  } else {
    lineVip.classList.add("hidden");
  }

  document.getElementById("subtotal").textContent = money(c.subtotal);
  document.getElementById("fee").textContent = money(c.fee);
  document.getElementById("total").textContent = money(c.total);
}

function ticketsText() {
  const parts = [];
  if (regularQty > 0) parts.push("Regular x " + regularQty);
  if (vipQty > 0) parts.push("VIP x " + vipQty);
  return parts.join(", ");
}

// form errors
function setError(id, message) {
  document.getElementById(id).classList.add("invalid");
  document.getElementById(id + "-error").textContent = message;
}

function clearErrors() {
  bookingForm.querySelectorAll(".error").forEach(function (e) {
    e.textContent = "";
  });
  bookingForm.querySelectorAll(".invalid").forEach(function (i) {
    i.classList.remove("invalid");
  });
}

// events
menuBtn.addEventListener("click", function () {
  navLinks.classList.toggle("open");
});

navLinks.addEventListener("click", function () {
  navLinks.classList.remove("open");
});

searchInput.addEventListener("input", showEvents);
dateFilter.addEventListener("change", showEvents);

clearDateBtn.addEventListener("click", function () {
  dateFilter.value = "";
  showEvents();
});

categoryButtons.forEach(function (btn) {
  btn.addEventListener("click", function () {
    categoryButtons.forEach(function (b) {
      b.classList.remove("active");
    });
    btn.classList.add("active");
    currentCategory = btn.dataset.category;
    showEvents();
  });
});

eventGrid.addEventListener("click", function (e) {
  if (e.target.classList.contains("view-btn")) {
    openEvent(Number(e.target.dataset.id));
  }
});

// ticket quantity buttons
ticketBox.addEventListener("click", function (e) {
  const btn = e.target.closest("button");
  if (!btn || !currentEvent) return;

  const type = btn.dataset.type;
  const action = btn.dataset.action;
  ticketError.textContent = "";

  if (action === "plus") {
    if (maxTickets === 0) {
      ticketError.textContent = "Sorry, this event is sold out.";
      return;
    }
    if (regularQty + vipQty >= maxTickets) {
      ticketError.textContent = "You can book a maximum of " + maxTickets + " tickets.";
      return;
    }
    if (type === "regular") regularQty++;
    if (type === "vip") vipQty++;
  }

  if (action === "minus") {
    if (type === "regular" && regularQty > 0) regularQty--;
    if (type === "vip" && vipQty > 0) vipQty--;
  }

  updateSummary();
});

toFormBtn.addEventListener("click", function () {
  if (regularQty + vipQty === 0) {
    ticketError.textContent = "Please select at least one ticket.";
    return;
  }

  clearErrors();
  formSummary.textContent =
    currentEvent.title + " | " + ticketsText() + " | Total " + money(calculate().total);
  showStep("form");
});

backBtn.addEventListener("click", function () {
  showStep("details");
});

bookingForm.addEventListener("submit", function (e) {
  e.preventDefault();
  clearErrors();
  let ok = true;

  const name = document.getElementById("bname").value.trim();
  const email = document.getElementById("bemail").value.trim();
  const phone = document.getElementById("bphone").value.trim();

  if (!/^[A-Za-z ]{3,}$/.test(name)) {
    setError("bname", "Enter a valid name (letters only, minimum 3 characters).");
    ok = false;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setError("bemail", "Enter a valid email address.");
    ok = false;
  }

  if (!/^[6-9][0-9]{9}$/.test(phone)) {
    setError("bphone", "Enter a valid 10 digit mobile number.");
    ok = false;
  }

  if (!ok) return;

  // check seats again before booking
  if (regularQty + vipQty > seatsLeft(currentEvent)) {
    alert("Sorry, not enough seats are left. Please select fewer tickets.");
    openEvent(currentEvent.id);
    showEvents();
    return;
  }

  const c = calculate();
  const booking = {
    id: "EE" + (2001 + bookings.length),
    eventId: currentEvent.id,
    eventTitle: currentEvent.title,
    date: currentEvent.date,
    time: currentEvent.time,
    venue: currentEvent.venue,
    name: name,
    email: email,
    phone: phone,
    regular: regularQty,
    vip: vipQty,
    subtotal: c.subtotal,
    fee: c.fee,
    total: c.total
  };

  bookings.push(booking);
  saveBookings();

  confirmDetails.innerHTML =
    "<p><span>Booking ID</span><span>" + booking.id + "</span></p>" +
    "<p><span>Name</span><span>" + safe(booking.name) + "</span></p>" +
    "<p><span>Event</span><span>" + booking.eventTitle + "</span></p>" +
    "<p><span>Date</span><span>" + formatDate(booking.date) + "</span></p>" +
    "<p><span>Time</span><span>" + booking.time + "</span></p>" +
    "<p><span>Venue</span><span>" + booking.venue + "</span></p>" +
    "<p><span>Tickets</span><span>" + ticketsText() + "</span></p>" +
    "<p><span>Amount Paid</span><span>" + money(booking.total) + "</span></p>";

  bookingForm.reset();
  showStep("confirm");
  showEvents();
});

modalClose.addEventListener("click", closeModal);
doneBtn.addEventListener("click", closeModal);

modal.addEventListener("click", function (e) {
  if (e.target === modal) closeModal();
});

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") closeModal();
});

printBtn.addEventListener("click", function () {
  window.print();
});

resetBtn.addEventListener("click", function () {
  if (confirm("Delete all demo bookings?")) {
    bookings = [];
    saveBookings();
    showEvents();
  }
});

// start
showEvents();