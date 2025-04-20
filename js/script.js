"use strict";

let audio = new Audio();
const songUl = document
  .querySelector(".song-list")
  .getElementsByTagName("ul")[0];

let lastPlayedLi = null;
const songInfo = document.querySelector(".song-info");
const songTime = document.querySelector(".song-time");
const right = document.querySelector(".right");
const left = document.querySelector(".left");
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
          <img src="images/play.svg" alt="play now" />
        </div>
      </li>`;
  }

  const songLi = document.querySelectorAll(".song-list li");
  songLi.forEach((li, index) => {
    li.addEventListener("click", () => {
      playbar.style.bottom = "0%";
      playBtn.focus();

      const currentImg = li.querySelector(".play-now img");
      const currentText = li.querySelector(".play-now span");

      if (currentImg && currentText) {
        currentImg.src = "images/audio.svg";
        currentText.textContent = "Playing...";
      }

      if (lastPlayedLi && lastPlayedLi !== li) {
        console.log(lastPlayedLi);

        const prevImg = lastPlayedLi.querySelector(".play-now img");
        const prevText = lastPlayedLi.querySelector(".play-now span");

        if (prevImg && prevText) {
          prevImg.src = "images/play.svg";
          prevText.textContent = "Play Now";
        }
      }

      lastPlayedLi = li;
      audio.src = `song/${songs[index]}`;
      audio.play();
      songInfo.innerHTML = `<img src="images/audio.svg" alt="playing..."/><p>${songs[
        index
      ]
        .replaceAll("%20", " ")
        .replaceAll(".mp3", "")
        .replaceAll(/\d+/g, "")
        .replaceAll("()", "")
        .replace(/-$/, "")
        .replaceAll(/\b\w/g, (first) => first.toUpperCase())}...</p>`;

      if (audio.played) {
        playBtn.src = "images/pause.svg";
      }

      setInterval(() => {
        rangeBar.value = audio.currentTime;
        if (audio.ended) {
          audio.currentTime = 0;
          playBtn.src = "images/play.svg";
        }
      }, 1000);

      rangeBar.addEventListener("input", () => {
        audio.currentTime = rangeBar.value;
      });

      audio.addEventListener("loadedmetadata", () => {
        rangeBar.max = audio.duration;

        audio.addEventListener("timeupdate", () => {
          updateTime();
        });

        function updateTime() {
          const minutes = Math.floor(audio.duration / 60)
            .toString()
            .padStart(2, "0");
          const seconds = Math.floor(audio.duration % 60)
            .toString()
            .padStart(2, "0");

          const minutesCur = Math.floor(audio.currentTime / 60)
            .toString()
            .padStart(2, "0");
          const secondsCur = Math.floor(audio.currentTime % 60)
            .toString()
            .padStart(2, "0");

          songTime.innerHTML = `<span>${minutes} : ${seconds}</span> <span> / <span>
          <span>${minutesCur} : ${secondsCur}</span>`;
        }
      });
    });
  });
};

main();

const playPause = () => {
  if (audio.paused) {
    audio.play();
    playBtn.src = "images/pause.svg";
  } else {
    audio.pause();
    playBtn.src = "images/play.svg";
  }
};

const loading = () => {
  setTimeout(() => {
    loader.style.zIndex = "-1";
    loader.style.opacity = "0";
  }, 1000);
};

const reload = () => {
  location.reload();
};

playBtn.addEventListener("click", playPause);
document.addEventListener("keypress", (e) => {
  if (e.code === "Space") {
    playPause();
  }
});

document.addEventListener("keydown", (e) => {
  if (audio) {
    if (e.key === "ArrowRight") {
      audio.currentTime += 5;
      right.style.opacity = "1";
      setTimeout(() => {
        right.style.opacity = "0";
      }, 500);
    } else if (e.key === "ArrowLeft") {
      audio.currentTime -= 5;
      left.style.opacity = "1";
      setTimeout(() => {
        left.style.opacity = "0";
      }, 500);
      if (audio.currentTime <= 0) {
        audio.currentTime = 0;
      }
    }
  }
});

window.addEventListener("load", loading);
logo.addEventListener("click", reload);
