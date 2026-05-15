/**
 * Opens a file in a new browser tab.
 * @param {string} path - The file path to open.
 */
function openFile(path) {
    if (path) {
        window.open(path, '_blank'); // Open the file in a new tab
    } else {
        alert('File not found!'); // Show an alert if the path is invalid
    }
}
