/**
 * Documentations That I used are :-
 * LastFm Api docs : https://www.last.fm/api
 * spotify documentation : https://developer.spotify.com/documentation/web-api
 * mdn web docs :- 1) https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
 *                 2) https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Introduction
 *                 3) https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Manipulating_documents
 * Along with that i have also used Stackoverflow to deal with my errors
 */
document.addEventListener("DOMContentLoaded", function () {
  // Get references to HTML elements
  const result = document.getElementById("result");
  const searchBtn = document.getElementById("search-btn");
  const genreSelect = document.getElementById("genre");

  // API key for Last.fm
  const apiKey = "6eabbc94590c36dfad51ec088400339f";

  // Dynamically add student info
  const studentId = "200544016";
  const studentName = "Vansh Kumar Gautam";
  const headerContent = document.querySelector(".header-content");
  const studentInfo = document.createElement("p");
  studentInfo.textContent = `Student ID: ${studentId} | Name: ${studentName}`;
  document.querySelector(".student-info").appendChild(studentInfo);

  // Event listener for the search button
  searchBtn.addEventListener("click", async () => {
    // Get the selected genre from the dropdown
    const selectedGenre = genreSelect.value;

    try {
      // Fetch top tracks based on the selected genre
      const topTracks = await fetchTopTracks(apiKey, selectedGenre);

      // Display the fetched tracks
      displayTracks(topTracks);
    } catch (error) {
      console.error("Error:", error);
      result.innerHTML = "<h3>Error fetching data</h3>";
    }
  });

  // Function to fetch top tracks from Last.fm API
  async function fetchTopTracks(apiKey, genre) {
    try {
      // Make a request to the Last.fm API to get top tracks for the selected genre
      const response = await fetch(
        `https://ws.audioscrobbler.com/2.0/?method=tag.gettoptracks&tag=${genre}&api_key=${apiKey}&format=json&limit=5&lang=en`
      );

      // Check if the response is successful
      if (!response.ok) {
        throw new Error(
          `Fetching top tracks failed with status ${response.status}`
        );
      }

      // Parse the JSON response
      const data = await response.json();

      // Extract the tracks from the response
      return data.tracks.track;
    } catch (error) {
      console.error("Fetch top tracks error:", error);
      throw error;
    }
  }

  // Function to display tracks in the HTML
  async function displayTracks(tracks) {
    // Clear the previous results
    result.innerHTML = "";

    // Loop through each track and display its information
    for (const track of tracks) {
      // Fetch additional details for each track
      const albumImage = await fetchAlbumImage(
        apiKey,
        track.artist.name,
        track.name
      );
      const trackDetails = await fetchTrackDetails(
        apiKey,
        track.artist.name,
        track.name
      );

      // Display the track information in the HTML
      result.innerHTML += `
          <div class="track">
            <img src="${albumImage}" alt="${track.name}">
            <p>${track.name} - ${track.artist.name}</p>
            <p>Album: ${trackDetails.album}</p>
            <p>Play on <a href="${trackDetails.url}" target="_blank">Last.fm</a></p>
          </div>
        `;
    }
  }

  // Function to fetch the album image for a track
  async function fetchAlbumImage(apiKey, artist, track) {
    try {
      // Make a request to the Last.fm API to get track details
      const response = await fetch(
        `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${apiKey}&artist=${encodeURIComponent(
          artist
        )}&track=${encodeURIComponent(track)}&format=json`
      );

      // Check if the response is successful
      if (!response.ok) {
        throw new Error(
          `Fetching album image failed with status ${response.status}`
        );
      }

      // Parse the JSON response
      const data = await response.json();

      // Extract the album image from the response
      const albumImage = data.track.album.image[3]["#text"]; // Use index 3 for larger images

      // Return the album image or a default image if not available
      return albumImage || "default_image_url.jpg";
    } catch (error) {
      console.error("Fetch album image error:", error);

      // Return a default image in case of errors
      return "default_image_url.jpg";
    }
  }

  // Function to fetch additional details for a track
  async function fetchTrackDetails(apiKey, artist, track) {
    try {
      // Make a request to the Last.fm API to get track details
      const response = await fetch(
        `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${apiKey}&artist=${encodeURIComponent(
          artist
        )}&track=${encodeURIComponent(track)}&format=json`
      );

      // Check if the response is successful
      if (!response.ok) {
        throw new Error(
          `Fetching track details failed with status ${response.status}`
        );
      }

      // Parse the JSON response
      const data = await response.json();

      // Extract the album title and track URL from the response
      return {
        album: data.track.album.title,
        url: data.track.url,
      };
    } catch (error) {
      console.error("Fetch track details error:", error);

      // Return default details in case of errors
      return {
        album: "Unknown",
        url: "#",
      };
    }
  }
});
