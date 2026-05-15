// Responsive Menu Toggle with Hamburger Animation
// This script adds interactivity to toggle the navigation menu and animate the hamburger icon
document.addEventListener('DOMContentLoaded', () => {
    // Select the hamburger menu toggle and navigation menu
    const menuToggle = document.getElementById('menu-toggle');
    const navigation = document.getElementById('navigation');

    // Add a click event listener to toggle visibility and animation
    menuToggle.addEventListener('click', () => {
        navigation.classList.toggle('active'); // Show/Hide the navigation menu
        menuToggle.classList.toggle('open'); // Toggle hamburger animation
    });
});

/**
 * Load editions from data.js and display them on the home page.
 * Dynamically generates content for the current and previous editions.
 */
function loadEditions() {
    // Get the latest edition (first item in editionsData array)
    const currentEdition = editionsData[0];
    const currentContainer = document.querySelector(".edition");

    // Create the HTML for the current edition
    currentContainer.innerHTML = `
        <div class="card">
            <img src="${currentEdition.cover}" alt="Cover ${currentEdition.year}">
            <h3>${currentEdition.edition}</h3>
            <p>Issue Date: ${currentEdition.date}</p>
            <button onclick="window.open('${currentEdition.link}', '_blank')">Read Now</button>
        </div>
    `;

    // Process previous editions (skipping the first item)
    const previousEditions = editionsData.slice(1);

    // Group editions by year using a reducer
    const groupedEditions = previousEditions.reduce((acc, edition) => {
        acc[edition.year] = acc[edition.year] || [];
        acc[edition.year].push(edition);
        return acc;
    }, {});

    // Get the container for previous editions
    const previousContainer = document.getElementById("previous-editions");

    // Sort years in descending order and create HTML for each group
    Object.keys(groupedEditions)
        .sort((a, b) => b - a) // Sort by year in descending order
        .forEach(year => {
            // Create a year group container
            const yearGroup = document.createElement("div");
            yearGroup.classList.add("year-group");
            yearGroup.innerHTML = `<h3>${year}</h3><div class="year-scroll"></div>`;

            // Add each edition in the year group
            const scrollContainer = yearGroup.querySelector(".year-scroll");
            groupedEditions[year].forEach(edition => {
                const card = document.createElement("div");
                card.classList.add("card");
                card.innerHTML = `
                    <img src="${edition.cover}" alt="Cover ${edition.year}">
                    <h3>${edition.edition}</h3>
                    <p>Issue Date: ${edition.date}</p>
                    <button onclick="window.open('${edition.link}', '_blank')">Read Now</button>
                `;
                scrollContainer.appendChild(card);
            });

            // Append the year group to the previous editions container
            previousContainer.appendChild(yearGroup);
        });
}

/**
 * Load trustees from data.js and display them on the trustee page.
 * Groups trustees by designation and dynamically generates content.
 */
function loadTrustees() {
    // Group trustees by their designation using a reducer
    const groupedTrustees = trusteesData.reduce((acc, trustee) => {
        if (!acc[trustee.designation]) {
            acc[trustee.designation] = [];
        }
        acc[trustee.designation].push(trustee);
        return acc;
    }, {});

    // Get the container for the trustees
    const container = document.getElementById("trustee-container");

    // Iterate through each designation and create content
    Object.keys(groupedTrustees).forEach(designation => {
        // Create a section for each designation
        const section = document.createElement("div");
        section.classList.add("trustee-group");
        section.innerHTML = `<h3 class="designation-title">${designation}</h3>`;

        // Add each trustee under the current designation
        groupedTrustees[designation].forEach(trustee => {
            const card = document.createElement("div");
            card.classList.add("trustee-card");
            card.innerHTML = `
                <img src="${trustee.image}" alt="${trustee.name}" class="trustee-image">
                <h4>${trustee.name}</h4>
                <p class="bio">${trustee.info}</p>
                <div class="trustee-actions">
                    <a href="${trustee.phone}" title="Call"><i class="fas fa-phone"></i></a>
                    <a href="${trustee.whatsapp}" title="WhatsApp"><i class="fab fa-whatsapp"></i></a>
                    <a href="${trustee.email}" title="Email"><i class="fas fa-envelope"></i></a>
                </div>
                <div class="trustee-social">
                    <a href="${trustee.social.facebook}" target="_blank" title="Facebook"><i class="fab fa-facebook"></i></a>
                    <a href="${trustee.social.twitter}" target="_blank" title="Twitter"><i class="fab fa-twitter"></i></a>
                    <a href="${trustee.social.instagram}" target="_blank" title="Instagram"><i class="fab fa-instagram"></i></a>
                    <a href="${trustee.social.linkedin}" target="_blank" title="LinkedIn"><i class="fab fa-linkedin"></i></a>
                </div>
            </div>
            `;
            section.appendChild(card);
        });

        // Append the designation section to the container
        container.appendChild(section);
    });
}
