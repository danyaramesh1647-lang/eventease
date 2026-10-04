# EventEase - Event Booking Portal

A frontend-only event booking website built using HTML, CSS and JavaScript. No backend or database is used. Bookings are stored in the browser using localStorage.

Live demo: https://danyaramesh1647-lang.github.io/eventease/

## Features
- Navbar with mobile menu and hero section
- 10 events across 5 categories: Music, Sports, Technology, Workshops, Cultural
- Search events by name or venue
- Category filter and date filter ("events from this date")
- Event cards with date, time, venue, starting price and seats left
- Event details popup
- Regular and VIP ticket selection with + and - controls (maximum 6 tickets per booking)
- Automatic price calculation: subtotal, 5% convenience fee and total
- Booking form with validation (name, email, phone)
- Booking confirmation with a dynamically generated booking ID
- Seats left reduce after every booking, and sold out events cannot be booked
- Print confirmation
- Responsive design for mobile and desktop

## Booking Flow
```
Search
   |
Category / Date filter
   |
Select event
   |
View details
   |
Select tickets
   |
Calculate total
   |
Enter details
   |
Validate form
   |
Booking confirmation
```

## Folder Structure
```
Project 10 - EventEase/
├── index.html
├── style.css
├── script.js
├── images/
│   ├── concert.jpg
│   ├── dj-night.jpg
│   ├── cricket.jpg
│   └── ...
└── README.md
```

## How to Run
1. Download or clone the project folder.
2. Open `index.html` in any web browser.

## Concepts Used
- DOM manipulation
- Event handling and event delegation
- Array filter and find
- Dynamic price calculation
- Form validation with regular expressions
- localStorage
- Responsive layout with CSS Grid and Flexbox

## Technologies Used
- HTML5
- CSS3
- JavaScript (Vanilla)