"use strict";

const songUl = document
  .querySelector(".song-list")
  .getElementsByTagName("ul")[0];

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
  console.log(songs);

  for (const song of songs) {
    songUl.innerHTML =
      songUl.innerHTML +
      `<li>${song
        .replaceAll("%20", " ")
        .replaceAll(".mp3", "")
        .replaceAll("11234", "")
        .replaceAll(/\d+/g, "")
        .replaceAll("()", "")
        .replaceAll(/\b\w/g, (first) => first.toUpperCase())}</li>`;
    console.log(song);
  }

  const playSong = new Audio(songs[0]);
  // playSong.play();
};

main();
