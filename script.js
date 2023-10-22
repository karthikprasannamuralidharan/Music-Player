// Define references to HTML elements
const audioPlayer = document.getElementById('audio-player'); // The audio element
const playPauseButton = document.getElementById('play-pause'); // Play/Pause button
const volumeControl = document.getElementById('volume'); // Volume control input
const progressControl = document.getElementById('progress'); // Progress control input
const songTitle = document.getElementById('song-title'); // Element for displaying the song title
const artistInfo = document.getElementById('artist'); // Element for displaying artist info
const albumInfo = document.getElementById('album'); // Element for displaying album info
const songList = document.getElementById('song-list'); // Playlist container
const addSongButton = document.getElementById('add-song'); // Button to add a song to the playlist
const currentTimeDisplay = document.getElementById('current-time'); // Element for displaying the current time

// Initialize playlist and current song index
let playlist = []; // Array to store the playlist of songs
let currentSongIndex = 0; // Index of the currently playing song

// Flag to track progress control state
let isProgressBeingUpdated = false;

/* // Function to add a song to the playlist
function addSongToPlaylist(song) {
    // Check if the song is already in the playlist
    const isDuplicate = playlist.some(item => item.title === song.title);

    if (!isDuplicate) {
        // Add the song to the playlist array and create a playlist item in the UI
        playlist.push(song);
        const li = createPlaylistItem(song);
        songList.appendChild(li);
    } else {
        // Alert the user if the song is already in the playlist
        alert('Song is already in the playlist.');
    }
}
 */
// Function to create a playlist item for a song
function createPlaylistItem(song) {
    const li = document.createElement('li');
    li.textContent = `${song.title} - ${song.artist}`;
    li.addEventListener('click', () => {
        // Play the selected song when the playlist item is clicked
        playSong(playlist.indexOf(song));
    });
    return li;
}

// Function to play a song by index
function playSong(index) {
    if (index >= 0 && index < playlist.length) {
        currentSongIndex = index;
        audioPlayer.src = playlist[currentSongIndex].source;
        audioPlayer.play();
    }
}

// Event listener for play/pause button
playPauseButton.addEventListener('click', () => {
    togglePlayPause();
});

// Function to toggle play/pause
function togglePlayPause() {
    if (audioPlayer.paused) {
        audioPlayer.play();
        playPauseButton.textContent = 'Pause';
    } else {
        audioPlayer.pause();
        playPauseButton.textContent = 'Play';
    }
}

// Event listener for volume control
volumeControl.addEventListener('input', () => {
    updateVolume(volumeControl.value);
});

// Function to update volume
function updateVolume(value) {
    audioPlayer.volume = value;
}

// Event listener for progress control
progressControl.addEventListener('input', () => {
    isProgressBeingUpdated = true;
    const newTime = (audioPlayer.duration / 100) * progressControl.value;
    audioPlayer.currentTime = newTime;
    isProgressBeingUpdated = false; // Reset the variable when progress is updated
});

// Event listener for updating progress bar during playback
audioPlayer.addEventListener('timeupdate', () => {
    if (!isProgressBeingUpdated) {
        progressControl.value = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        updateCurrentTimeDisplay();
    }
});

audioPlayer.addEventListener('ended', () => {
    if (!isProgressBeingUpdated) {
        progressControl.value = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    }
    currentSongIndex = (currentSongIndex + 1) % playlist.length;
    audioPlayer.src = playlist[currentSongIndex].source;
    songTitle.textContent = playlist[currentSongIndex].title;
    artistInfo.textContent = playlist[currentSongIndex].artist;
    albumInfo.textContent = playlist[currentSongIndex].album;
    audioPlayer.play();
});

// Function to update progress
function updateProgress(value) {
    const newTime = (audioPlayer.duration / 100) * value;
    audioPlayer.currentTime = newTime;
}

// Function to update current time display
function updateCurrentTimeDisplay() {
    const currentTime = formatTime(audioPlayer.currentTime);
    currentTimeDisplay.textContent = currentTime;
}

// Function to format time in minutes and seconds
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

// Function to load the first song
function loadFirstSong() {
    if (playlist.length > 0) {
        playSong(0);
    }
}

// Load the playlist from playlist.json
fetch('playlist.json')
    .then(response => response.json())
    .then(data => {
        playlist = data;
        loadFirstSong();
    })
    .catch(error => {
        console.error('Error loading playlist:', error);
    });
