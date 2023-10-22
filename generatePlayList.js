const fs = require('fs');
const path = require('path');

// Define the music folder path
const musicFolderPath = path.join(__dirname, 'songs');


// Initialize an empty playlist array
const playlist = [];

// Function to traverse the music folder and generate the playlist
function generatePlaylist(folderPath) {
    const files = fs.readdirSync(folderPath);

    files.forEach((file) => {
        const filePath = path.join(folderPath, file);
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
            // If it's a directory, recursively scan it
            generatePlaylist(filePath);
        } else if (path.extname(file).toLowerCase() === '.mp3') {
            // If it's an MP3 file, add it to the playlist
            const relativePath = path.relative(musicFolderPath, filePath);
            playlist.push({
                title: path.basename(file, path.extname(file)),
                source: relativePath,
            });
        }
    });
}

// Generate the playlist
generatePlaylist(musicFolderPath);

// Save the playlist to a JSON file
const playlistJSON = JSON.stringify(playlist, null, 2);
fs.writeFileSync('playlist.json', playlistJSON);

console.log('Playlist generated and saved as playlist.json');
