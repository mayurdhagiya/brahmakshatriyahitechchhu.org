function openFile(path) {
    if (path) {
        window.open(path, '_blank'); // Opens in a new tab
    } else {
        alert('File not found!');
    }
}
