"use strict";

let audio = new Audio();
const songUl = document
  .querySelector(".song-list")
  .getElementsByTagName("ul")[0];

const playBtn = document.querySelector(".play-btn");
const playbar = document.querySelector(".playbar");
const loader = document.querySelector(".loader");
const logo = document.querySelector(".icon");

const rangeBar = document.querySelector(".range");

const songLi = document.querySelector(".song-list").getElementsByTagName("li");
const getSongs = async function () {
  const a = await fetch("http://127.0.0.1:5500/song");
  const response = await a.text();
  const div = document.createElement("div");
  div.innerHTML = response;
  const songs = [];
  const as = div.getElementsByTagName("a");
  for (let i = 0; i < as.length; i++) {
    const element = as[i];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split("/song/")[1]);
    }
  }
  return songs;
};

const main = async function () {
  const songs = await getSongs();

  for (const song of songs) {
    songUl.innerHTML += `
      <li>
        <img src="images/music.svg" class="img" alt="music-icon" />
        <div class="info">
          <div class="song-name">${song
            .replaceAll("%20", " ")
            .replaceAll(".mp3", "")
            .replaceAll(/\d+/g, "")
            .replaceAll("()", "")
            .replace(/-$/, "")
            .replaceAll(/\b\w/g, (first) => first.toUpperCase())}</div>
          <div class="artist">- Yo Yo Honey Singh</div>
        </div>
        <div class="play-now">
          <span>Play Now</span>
          <img class="img" src="images/play.svg" alt="play now" />
        </div>
      </li>`;
  }

  const songLi = document.querySelectorAll(".song-list li");
  songLi.forEach((li, index) => {
    li.addEventListener("click", () => {
      playbar.style.bottom = "0";
      audio.src = `song/${songs[index]}`;
      audio.play();
      if (audio.played) {
        playBtn.src = "images/pause.svg";
      }
      setInterval(() => {
        rangeBar.value = audio.currentTime;
        if (audio.ended) {
          rangeBar.value = 0;
        }
      }, 100);
      rangeBar.addEventListener("input", () => {
        audio.currentTime = rangeBar.value;
      });
    });
  });

  playBtn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play();
      playBtn.src = "images/pause.svg";
    } else {
      audio.pause();
      playBtn.src = "images/play.svg";
    }
  });
};

window.addEventListener("load", () => {
  setTimeout(() => {
    loader.style.display = "none";
  }, 1500);
});

logo.addEventListener("click", () => {
  location.reload();
});

main();
