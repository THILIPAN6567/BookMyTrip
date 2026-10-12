// Get the HTML elements.

const bookingForm = document.getElementById("bookingForm");

const bookingMessage = document.getElementById("bookingMessage");

const bookingTableBody = document.getElementById("bookingTableBody");

const bookingList = document.getElementById("bookingList");

const menuButton = document.getElementById("menuButton");

const navbar = document.getElementById("navbar");

const accountDialog = document.getElementById("accountDialog");


// Create today's date in local time.

const currentDate = new Date();

const today = new Date(
    currentDate.getTime() -
    currentDate.getTimezoneOffset() * 60000
).toISOString().split("T")[0];

document.getElementById("travelDate").min = today;

document.getElementById("travelDate").value = today;


// Storage key for booking details.

const STORAGE_KEY = "bookmytripBookings";


// Get the booking data from browser storage.

function getBookings() {

    try {

        const savedBookings = localStorage.getItem(STORAGE_KEY);

        return savedBookings ? JSON.parse(savedBookings) : [];

    } catch (error) {

        return [];

    }

}


// Save booking data to browser storage.

function saveBookings(bookings) {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(bookings)
    );

}


// Display all bookings in the table.

function displayBookings() {

    const bookings = getBookings();

    bookingTableBody.innerHTML = "";


    // Show a message when there are no bookings.

    if (bookings.length === 0) {

        const row = document.createElement("tr");

        const cell = document.createElement("td");

        cell.colSpan = 8;

        cell.className = "empty-message";

        cell.textContent =
            "No bookings available. Submit your trip details above.";

        row.appendChild(cell);

        bookingTableBody.appendChild(row);

        return;

    }


    // Create one table row for each booking.

    bookings.forEach(function (booking, index) {

        const row = document.createElement("tr");


        const values = [

            index + 1,

            booking.tripType,

            booking.destination,

            booking.travelDate,

            booking.rooms,

            booking.adults,

            booking.children

        ];


        values.forEach(function (value) {

            const cell = document.createElement("td");

            cell.textContent = value;

            row.appendChild(cell);

        });


        // Create the delete button.

        const actionCell = document.createElement("td");

        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";

        deleteButton.className = "delete-button";

        deleteButton.type = "button";


        deleteButton.addEventListener("click", function () {

            deleteBooking(booking.id);

        });


        actionCell.appendChild(deleteButton);

        row.appendChild(actionCell);

        bookingTableBody.appendChild(row);

    });

}


// Handle the booking form submission.

bookingForm.addEventListener("submit", function (event) {

    event.preventDefault();


    // Read the form values.

    const tripType = document.getElementById("tripType").value;

    const destination = document.getElementById("destination").value;

    const travelDate = document.getElementById("travelDate").value;

    const rooms = document.getElementById("rooms").value;

    const adults = document.getElementById("adults").value;

    const children = document.getElementById("children").value;


    // Validate the destination.

    if (destination === "") {

        bookingMessage.style.color = "red";

        bookingMessage.textContent =
            "Please select your destination.";

        document.getElementById("destination").focus();

        return;

    }


    // Validate the travel date.

    if (!travelDate || travelDate < today) {

        bookingMessage.style.color = "red";

        bookingMessage.textContent =
            "Please select today or a future travel date.";

        return;

    }


    // Create the booking object.

    const booking = {

        id: Date.now().toString() +
            Math.random().toString(16).slice(2),

        tripType: tripType,

        destination: destination,

        travelDate: travelDate,

        rooms: rooms,

        adults: adults,

        children: children

    };


    // Retrieve existing bookings.

    const bookings = getBookings();


    // Add the new booking.

    bookings.push(booking);


    // Save all bookings.

    saveBookings(bookings);


    // Update the table.

    displayBookings();


    // Show the success message.

    bookingMessage.style.color = "green";

    bookingMessage.textContent =
        "Booking details added successfully to your booking list.";


    // Scroll to the booking table.

    bookingList.scrollIntoView({

        behavior: "smooth",

        block: "start"

    });

});


// Delete one booking.

function deleteBooking(id) {

    const bookings = getBookings();

    const updatedBookings = bookings.filter(function (booking) {

        return booking.id !== id;

    });


    saveBookings(updatedBookings);

    displayBookings();


    bookingMessage.style.color = "green";

    bookingMessage.textContent =
        "Selected booking deleted successfully.";

}


// Clear all bookings.

document.getElementById("clearBookings").addEventListener(
    "click",
    function () {

        const bookings = getBookings();


        if (bookings.length === 0) {

            bookingMessage.textContent =
                "There are no bookings to clear.";

            return;

        }


        const confirmation = confirm(
            "Are you sure you want to delete all bookings?"
        );


        if (confirmation) {

            saveBookings([]);

            displayBookings();

            bookingMessage.style.color = "green";

            bookingMessage.textContent =
                "All bookings have been deleted.";

        }

    }
);


// Search hotels by name or location.

document.getElementById("websiteSearch").addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const searchValue = document.getElementById("searchInput")
            .value.trim().toLowerCase();


        const hotels = document.querySelectorAll(".hotel-card");

        let visibleCount = 0;


        hotels.forEach(function (hotel) {

            const hotelText = hotel.textContent.toLowerCase();

            const keywords = hotel.dataset.search.toLowerCase();


            const matches =
                searchValue === "" ||
                hotelText.includes(searchValue) ||
                keywords.includes(searchValue);


            hotel.hidden = !matches;


            if (matches) {

                visibleCount++;

            }

        });


        document.getElementById("noHotels").hidden =
            visibleCount > 0;


        document.getElementById("popular").scrollIntoView({

            behavior: "smooth"

        });

    }
);


// Move the first hotel card to the end.

document.getElementById("nextButton").addEventListener(
    "click",
    function () {

        const hotelContainer =
            document.getElementById("hotelContainer");

        hotelContainer.appendChild(
            hotelContainer.firstElementChild
        );

    }
);


// Move the last hotel card to the beginning.

document.getElementById("previousButton").addEventListener(
    "click",
    function () {

        const hotelContainer =
            document.getElementById("hotelContainer");

        hotelContainer.insertBefore(

            hotelContainer.lastElementChild,

            hotelContainer.firstElementChild

        );

    }
);


// Open the mobile navigation menu.

menuButton.addEventListener("click", function () {

    navbar.classList.toggle("show");


    if (navbar.classList.contains("show")) {

        menuButton.textContent = "✕";

    } else {

        menuButton.textContent = "☰";

    }

});


// Open the account dialog.

function openAccountDialog(title) {

    document.getElementById("dialogTitle").textContent = title;

    document.getElementById("accountMessage").textContent = "";

    accountDialog.showModal();

}


document.getElementById("signupButton").addEventListener(
    "click",
    function () {

        openAccountDialog("Create Your Account");

    }
);


document.getElementById("accountButton").addEventListener(
    "click",
    function () {

        openAccountDialog("My Account");

    }
);


// Close the account dialog.

document.getElementById("closeDialog").addEventListener(
    "click",
    function () {

        accountDialog.close();

    }
);


// Handle the account form.

document.getElementById("accountForm").addEventListener(
    "submit",
    function (event) {

        event.preventDefault();

        document.getElementById("accountMessage").textContent =
            "Demo submitted. Real authentication requires a backend.";

    }
);


// Newsletter form.

document.getElementById("subscribeForm").addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const email = document.getElementById("emailInput").value;


        document.getElementById("subscribeMessage").textContent =
            "Thank you! Your email is " + email;


        event.target.reset();

    }
);


// Close the mobile navigation after clicking a link.

document.querySelectorAll("#navbar a").forEach(function (link) {

    link.addEventListener("click", function () {

        navbar.classList.remove("show");

        menuButton.textContent = "☰";

    });

});


// Display previously saved bookings when the page opens.

displayBookings();