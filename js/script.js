"use strict";

let audio = new Audio();
let songIndex = 0;
let lastPlayedLi = null;
let currfolder;

const songUl = document.querySelector(".song-list ul");
const previousBtn = document.querySelector(".preBtn");
const nxtBtn = document.querySelector(".nxtBtn");
const extra = document.querySelector(".extra");
const songInfo = document.querySelector(".song-info");
const songTime = document.querySelector(".song-time");
const right = document.querySelector(".right");
const left = document.querySelector(".left");
const playBtn = document.querySelector(".play-btn");
const playbar = document.querySelector(".playbar");
const loader = document.querySelector(".loader");
const logo = document.querySelectorAll(".icon");
const hamIcon = document.querySelector(".hambar-wrapper");
const remove = document.querySelector(".remove");
const move = document.querySelector(".left-container");
const rangeBar = document.querySelector(".range");
const soundRange = document.querySelector(".input-sound input");
const downloadBtn = document.querySelector(".download");
let songs = [];

const getSongs = async function (folder) {
  currfolder = folder;
  const a = await fetch(`http://127.0.0.1:5500/${currfolder}/`);
  const response = await a.text();
  const div = document.createElement("div");
  div.innerHTML = response;
  const as = div.getElementsByTagName("a");
  for (let i = 0; i < as.length; i++) {
    const element = as[i];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${currfolder}/`)[1]);
    }
  }
};

document.querySelectorAll(".card-container").forEach((card) => {
  card.addEventListener("click", async () => {
    console.log("clicked");
    songUl.innerHTML = "";
    songs = [];
    await getSongs(`song/${card.dataset.folder}`);

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
        songIndex = index;
        playbar.style.bottom = "0%";
        playBtn.focus();

        const currentImg = li.querySelector(".play-now img");
        const currentText = li.querySelector(".play-now span");

        if (currentImg && currentText) {
          currentImg.src = "images/audio.svg";
          currentText.textContent = "Playing...";
        }

        if (lastPlayedLi && lastPlayedLi !== li) {
          const prevImg = lastPlayedLi.querySelector(".play-now img");
          const prevText = lastPlayedLi.querySelector(".play-now span");

          if (prevImg && prevText) {
            prevImg.src = "images/play.svg";
            prevText.textContent = "Play Now";
          }
        }

        lastPlayedLi = li;
        audio.src = `${currfolder}/${songs[index]}`;
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
            let minutes = "00";
            let seconds = "00";

            if (!isNaN(audio.duration)) {
              minutes = Math.floor(audio.duration / 60)
                .toString()
                .padStart(2, "0");
              seconds = Math.floor(audio.duration % 60)
                .toString()
                .padStart(2, "0");
            }
            const minutesCur = Math.floor(audio.currentTime / 60)
              .toString()
              .padStart(2, "0");
            const secondsCur = Math.floor(audio.currentTime % 60)
              .toString()
              .padStart(2, "0");

            songTime.innerHTML = `<span>${minutes} : ${seconds}</span> <span> / <span>
            <span>${minutesCur} : ${secondsCur}</span>`;
          });
        });
      });
    });

    // Buttons
    previousBtn.addEventListener("click", () => {
      songIndex--;
      if (songIndex < 0) songIndex = 0;
      songLi[songIndex].click();
    });

    nxtBtn.addEventListener("click", () => {
      songIndex++;
      if (songIndex >= songs.length) songIndex = songs.length - 1;
      songLi[songIndex].click();
    });
  });
});

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
  loader.style.zIndex = "-1";
  loader.style.opacity = "0";
};

logo.forEach((icon) => {
  icon.addEventListener("click", () => {
    location.reload();
  });
});

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
      setTimeout(() => (right.style.opacity = "0"), 500);
    } else if (e.key === "ArrowLeft") {
      audio.currentTime -= 5;
      left.style.opacity = "1";
      setTimeout(() => (left.style.opacity = "0"), 500);
      if (audio.currentTime <= 0) audio.currentTime = 0;
    }
  }
});

const show = () => {
  move.style.transform = "translateX(0)";
  extra.style.zIndex = "9";
  extra.style.opacity = "1";
};

const removeNav = () => {
  move.style.transform = "translateX(-200%)";
  extra.style.zIndex = "-99";
  extra.style.opacity = "0";
};

const soundTracker = () => {
  audio.volume = soundRange.value;
};

const downloadSong = () => {
  if (audio.src) {
    const a = document.createElement("a");
    a.href = audio.src;
    a.download = audio.src.split("/").pop();
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } else {
    alert("No song is playing to download!");
  }
};

downloadBtn.addEventListener("click", downloadSong);
remove.addEventListener("click", removeNav);
soundRange.addEventListener("input", soundTracker);
extra.addEventListener("click", removeNav);
hamIcon.addEventListener("click", show);
window.addEventListener("load", loading);
