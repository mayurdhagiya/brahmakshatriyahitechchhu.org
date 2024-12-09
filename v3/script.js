// Function to add a magazine dynamically
function addMagazine(year, month, coverUrl, readUrl, editionName, publishDate) {
  const archive = document.getElementById('archive');
  let yearGroup = document.getElementById(`year-${year}`);

  // If the year group doesn't exist, create it
  if (!yearGroup) {
    yearGroup = document.createElement('div');
    yearGroup.id = `year-${year}`;
    yearGroup.className = 'year-group';

    // Add year heading
    const yearHeading = document.createElement('h3');
    yearHeading.textContent = year;
    yearHeading.setAttribute('onclick', `toggleYear('year-${year}')`);
    yearGroup.appendChild(yearHeading);

    // Create magazine grid container
    const magazineGrid = document.createElement('div');
    magazineGrid.className = 'magazine-grid';

    // Add container to the year group
    yearGroup.appendChild(magazineGrid);

    // Append year group to the archive
    archive.appendChild(yearGroup);
  }

  // Add magazine card to the existing year group
  const magazineGrid = yearGroup.querySelector('.magazine-grid');
  const magazineCard = document.createElement('div');
  magazineCard.className = 'magazine-card';

  const coverImage = document.createElement('img');
  coverImage.src = coverUrl;
  coverImage.alt = `${editionName} Cover`;

  const monthLabel = document.createElement('p');
  monthLabel.textContent = editionName;

  const publishDateLabel = document.createElement('p');
  publishDateLabel.textContent = `Published: ${publishDate}`;
  publishDateLabel.style.fontSize = '0.85rem';
  publishDateLabel.style.color = '#777';

  const readNowButton = document.createElement('a');
  readNowButton.className = 'read-now';
  readNowButton.href = readUrl;
  readNowButton.target = '_blank';
  readNowButton.innerHTML = `<i class="fas fa-book-open"></i> <span>Read Now</span>`;

  // Assemble the magazine card
  magazineCard.appendChild(coverImage);
  magazineCard.appendChild(monthLabel);
  magazineCard.appendChild(publishDateLabel);
  magazineCard.appendChild(readNowButton);
  magazineGrid.appendChild(magazineCard);
}

// Example usage
addMagazine(2023, 'January', 'https://via.placeholder.com/160x210', 'https://example.com/jan-2023', 'New Year Special Edition', 'January 1, 2023');
addMagazine(2022, 'December', 'https://via.placeholder.com/160x210', 'https://example.com/dec-2022', 'Holiday Edition', 'December 15, 2022');
addMagazine(2021, 'June', 'https://via.placeholder.com/160x210', 'https://example.com/jun-2021', 'Summer Edition', 'June 5, 2021');
addMagazine(2023, 'January', 'https://via.placeholder.com/160x210', 'https://example.com/jan-2023', 'New Year Special Edition', 'January 1, 2023');
addMagazine(2022, 'December', 'https://via.placeholder.com/160x210', 'https://example.com/dec-2022', 'Holiday Edition', 'December 15, 2022');
addMagazine(2021, 'June', 'https://via.placeholder.com/160x210', 'https://example.com/jun-2021', 'Summer Edition', 'June 5, 2021');
addMagazine(2023, 'January', 'https://via.placeholder.com/160x210', 'https://example.com/jan-2023', 'New Year Special Edition', 'January 1, 2023');
addMagazine(2022, 'December', 'https://via.placeholder.com/160x210', 'https://example.com/dec-2022', 'Holiday Edition', 'December 15, 2022');
addMagazine(2021, 'June', 'https://via.placeholder.com/160x210', 'https://example.com/jun-2021', 'Summer Edition', 'June 5, 2021');
addMagazine(2023, 'January', 'https://via.placeholder.com/160x210', 'https://example.com/jan-2023', 'New Year Special Edition', 'January 1, 2023');
addMagazine(2022, 'December', 'https://via.placeholder.com/160x210', 'https://example.com/dec-2022', 'Holiday Edition', 'December 15, 2022');
addMagazine(2021, 'June', 'https://via.placeholder.com/160x210', 'https://example.com/jun-2021', 'Summer Edition', 'June 5, 2021');
addMagazine(2023, 'January', 'https://via.placeholder.com/160x210', 'https://example.com/jan-2023', 'New Year Special Edition', 'January 1, 2023');
addMagazine(2022, 'December', 'https://via.placeholder.com/160x210', 'https://example.com/dec-2022', 'Holiday Edition', 'December 15, 2022');
addMagazine(2021, 'June', 'https://via.placeholder.com/160x210', 'https://example.com/jun-2021', 'Summer Edition', 'June 5, 2021');
addMagazine(2023, 'January', 'https://via.placeholder.com/160x210', 'https://example.com/jan-2023', 'New Year Special Edition', 'January 1, 2023');
addMagazine(2022, 'December', 'https://via.placeholder.com/160x210', 'https://example.com/dec-2022', 'Holiday Edition', 'December 15, 2022');
addMagazine(2021, 'June', 'https://via.placeholder.com/160x210', 'https://example.com/jun-2021', 'Summer Edition', 'June 5, 2021');
addMagazine(2023, 'January', 'https://via.placeholder.com/160x210', 'https://example.com/jan-2023', 'New Year Special Edition', 'January 1, 2023');
addMagazine(2022, 'December', 'https://via.placeholder.com/160x210', 'https://example.com/dec-2022', 'Holiday Edition', 'December 15, 2022');
addMagazine(2021, 'June', 'https://via.placeholder.com/160x210', 'https://example.com/jun-2021', 'Summer Edition', 'June 5, 2021');
addMagazine(2023, 'January', 'https://via.placeholder.com/160x210', 'https://example.com/jan-2023', 'New Year Special Edition', 'January 1, 2023');
addMagazine(2022, 'December', 'https://via.placeholder.com/160x210', 'https://example.com/dec-2022', 'Holiday Edition', 'December 15, 2022');
addMagazine(2021, 'June', 'https://via.placeholder.com/160x210', 'https://example.com/jun-2021', 'Summer Edition', 'June 5, 2021');
addMagazine(2023, 'January', 'https://via.placeholder.com/160x210', 'https://example.com/jan-2023', 'New Year Special Edition', 'January 1, 2023');
addMagazine(2022, 'December', 'https://via.placeholder.com/160x210', 'https://example.com/dec-2022', 'Holiday Edition', 'December 15, 2022');
addMagazine(2021, 'June', 'https://via.placeholder.com/160x210', 'https://example.com/jun-2021', 'Summer Edition', 'June 5, 2021');
addMagazine(2023, 'January', 'https://via.placeholder.com/160x210', 'https://example.com/jan-2023', 'New Year Special Edition', 'January 1, 2023');
addMagazine(2022, 'December', 'https://via.placeholder.com/160x210', 'https://example.com/dec-2022', 'Holiday Edition', 'December 15, 2022');
addMagazine(2021, 'June', 'https://via.placeholder.com/160x210', 'https://example.com/jun-2021', 'Summer Edition', 'June 5, 2021');
