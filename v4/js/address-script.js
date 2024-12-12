document.addEventListener("DOMContentLoaded", () => {
    const directory = document.getElementById("directory");
    const stateFilter = document.getElementById("stateFilter");
    const searchInput = document.getElementById("searchInput");
  
    // Remove duplicate entries from trustData
    const uniqueTrustData = [];
    const seen = new Set();
  
    trustData.forEach(item => {
      const uniqueKey = `${item.contactPerson}-${item.address}-${item.city}-${item.state}-${item.mobile}-${item.whatsapp}`;
      if (!seen.has(uniqueKey)) {
        seen.add(uniqueKey);
        uniqueTrustData.push(item);
      }
    });
  
    // Populate the state filter dropdown
    const states = [...new Set(uniqueTrustData.map(item => item.state))];
    states.forEach(state => {
      const option = document.createElement("option");
      option.value = state;
      option.textContent = state;
      stateFilter.appendChild(option);
    });
  
    // Render directory cards
    const renderDirectory = (data) => {
      directory.innerHTML = "";
      data.forEach(item => {
        const networkcard = document.createElement("div");
        networkcard.className = "networkcard";
        networkcard.innerHTML = `
          <h3>${item.contactPerson}</h3>
          <div class="info"><i class="fas fa-address-card"></i> ${item.address}</div>
          <div class="info"><i class="fas fa-map-marker-alt"></i> ${item.city}, ${item.state}</div>
          <div class="info"><i class="fas fa-phone"></i> ${item.mobile}</div>
          <div class="info"><i class="fab fa-whatsapp"></i> ${item.whatsapp}</div>
        `;
        directory.appendChild(networkcard);
      });
    };
  
    // Filter and search function
    const filterAndSearch = () => {
      const selectedState = stateFilter.value.toLowerCase();
      const searchTerm = searchInput.value.toLowerCase();
  
      const filteredData = uniqueTrustData.filter(item => {
        const matchesState = selectedState ? item.state.toLowerCase() === selectedState : true;
        const matchesSearch = searchTerm
          ? (
            item.contactPerson.toLowerCase().includes(searchTerm) ||
            item.city.toLowerCase().includes(searchTerm) ||
            item.mobile.includes(searchTerm)
          )
          : true;
        return matchesState && matchesSearch;
      });
  
      renderDirectory(filteredData);
    };
  
    // Event listeners
    stateFilter.addEventListener("change", filterAndSearch);
    searchInput.addEventListener("input", filterAndSearch);
  
    // Initial render
    renderDirectory(uniqueTrustData);
  });
  