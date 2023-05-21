document.addEventListener("DOMContentLoaded", function (event) {
    // Create the link element
    let link = document.createElement("a");

    // Set the href attribute
    link.setAttribute("href", "/students/create");

    // Set the link text
    link.textContent = "Create a new student";

    // Append the link to the list element
    document.body.appendChild(link);

    // Select the button using querySelector
    let button = document.querySelector("#test");

    // Add event listener for the click event
    button.addEventListener("click", function() {
        // Show an alert
        alert("You clicked!");
    });
});