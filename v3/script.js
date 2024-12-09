// Function to add a magazine dynamically
function addMagazine(year, month, coverUrl, readUrl, editionName, publishDate) {
    const archive = document.getElementById('archive');
    let yearGroup = document.getElementById(`year-${year}`);
  
    // If the year group doesn't exist, create it with scroll buttons
    if (!yearGroup) {
      yearGroup = document.createElement('div');
      yearGroup.id = `year-${year}`;
      yearGroup.className = 'year-group';
  
      // Add year heading
      const yearHeading = document.createElement('h3');
      yearHeading.textContent = year;
      yearHeading.setAttribute('onclick', `toggleYear('year-${year}')`);
      yearGroup.appendChild(yearHeading);
  
      // Create magazine grid container with scroll buttons
      const gridContainer = document.createElement('div');
      gridContainer.className = 'magazine-grid-container';
  
      const leftButton = document.createElement('button');
      leftButton.className = 'scroll-btn left';
      leftButton.setAttribute('onclick', `scrollLeft('year-${year}')`);
      leftButton.innerHTML = `<i class="fas fa-chevron-left"></i>`;
  
      const rightButton = document.createElement('button');
      rightButton.className = 'scroll-btn right';
      rightButton.setAttribute('onclick', `scrollRight('year-${year}')`);
      rightButton.innerHTML = `<i class="fas fa-chevron-right"></i>`;
  
      const magazineGrid = document.createElement('div');
      magazineGrid.className = 'magazine-grid';
  
      // Append buttons and grid to the container
      gridContainer.appendChild(leftButton);
      gridContainer.appendChild(magazineGrid);
      gridContainer.appendChild(rightButton);
  
      // Add container to the year group
      yearGroup.appendChild(gridContainer);
  
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
addMagazine(2023, 'January', 'cover-jan-2023.jpg', 'https://example.com/jan-2023', 'New Year Special Edition', 'January 1, 2023');