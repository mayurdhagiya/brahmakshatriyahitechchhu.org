const csvData = `
name,position,whatsapp,phone,facebook,twitter,linkedin,image
John Doe,Chairman,1234567890,9876543210,https://facebook.com/johndoe,https://twitter.com/johndoe,https://linkedin.com/in/johndoe,https://via.placeholder.com/150
John Doe,Chairman,1234567890,9876543210,https://facebook.com/johndoe,https://twitter.com/johndoe,https://linkedin.com/in/johndoe,https://via.placeholder.com/150
John Doe,Chairman,1234567890,9876543210,https://facebook.com/johndoe,https://twitter.com/johndoe,https://linkedin.com/in/johndoe,https://via.placeholder.com/150
John Doe,Chairman,1234567890,9876543210,https://facebook.com/johndoe,https://twitter.com/johndoe,https://linkedin.com/in/johndoe,https://via.placeholder.com/150
John Doe,Chairman,1234567890,9876543210,https://facebook.com/johndoe,https://twitter.com/johndoe,https://linkedin.com/in/johndoe,https://via.placeholder.com/150
John Doe,Chairman,1234567890,9876543210,https://facebook.com/johndoe,https://twitter.com/johndoe,https://linkedin.com/in/johndoe,https://via.placeholder.com/150
John Doe,Chairman,1234567890,9876543210,https://facebook.com/johndoe,https://twitter.com/johndoe,https://linkedin.com/in/johndoe,https://via.placeholder.com/150
John Doe,Chairman,1234567890,9876543210,https://facebook.com/johndoe,https://twitter.com/johndoe,https://linkedin.com/in/johndoe,https://via.placeholder.com/150
John Doe,Chairman,1234567890,9876543210,https://facebook.com/johndoe,https://twitter.com/johndoe,https://linkedin.com/in/johndoe,https://via.placeholder.com/150
John Doe,Chairman,1234567890,9876543210,https://facebook.com/johndoe,https://twitter.com/johndoe,https://linkedin.com/in/johndoe,https://via.placeholder.com/150
Jane Smith,Secretary,2345678901,8765432109,https://facebook.com/janesmith,https://twitter.com/janesmith,https://linkedin.com/in/janesmith,https://via.placeholder.com/150
`;

function parseCSV(csv) {
  const rows = csv.trim().split("\n");
  const headers = rows[0].split(",");

  return rows.slice(1).map((row) => {
    const values = row.split(",");
    return headers.reduce((acc, header, index) => {
      acc[header.trim()] = values[index].trim();
      return acc;
    }, {});
  });
}

function displayTrustees(trustees) {
  const trusteesList = document.getElementById("trustees-list");

  trustees.forEach((trustee) => {
    const card = document.createElement("div");
    card.className = "trustee-card";

    const image = document.createElement("img");
    image.className = "trustee-image";
    image.src = trustee.image;
    image.alt = `${trustee.name}'s photo`;

    const info = document.createElement("div");
    info.className = "trustee-info";
    info.innerHTML = `
      <h3>${trustee.name}</h3>
      <p>${trustee.position}</p>
    `;

    const icons = document.createElement("div");
    icons.className = "trustee-icons";
    icons.innerHTML = `
      <a href="https://wa.me/${trustee.whatsapp}" target="_blank" title="WhatsApp"><i class="fab fa-whatsapp"></i></a>
      <a href="tel:${trustee.phone}" title="Call"><i class="fas fa-phone"></i></a>
      <a href="${trustee.facebook}" target="_blank" title="Facebook"><i class="fab fa-facebook"></i></a>
      <a href="${trustee.twitter}" target="_blank" title="Twitter"><i class="fab fa-twitter"></i></a>
      <a href="${trustee.linkedin}" target="_blank" title="LinkedIn"><i class="fab fa-linkedin"></i></a>
    `;

    card.appendChild(image);
    card.appendChild(info);
    card.appendChild(icons);

    trusteesList.appendChild(card);
  });
}

const trustees = parseCSV(csvData);
displayTrustees(trustees);
