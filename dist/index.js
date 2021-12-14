class Video {
    constructor(id, name) {
        this.Id = id;
        this.Name = name;
    }
}
class ListReader {
    readList() {
        const anchors = document.querySelectorAll("ytd-playlist-video-list-renderer a.ytd-playlist-video-renderer");
        let videos = new Array(anchors.length);
        for (let i = 0; i < anchors.length; ++i) {
            const href = anchors[i].getAttribute("href");
            const name = anchors[i].textContent;
            const idIndex = href.indexOf("?v=");
            const id = href.substring(idIndex + 3, idIndex + 15);
            let video = new Video(id, name);
            videos[i] = video;
        }
        return videos;
    }
}
function changeSong() {
    const index = Number(localStorage.getItem("customrandomiserindex"));
    const videos = JSON.parse(localStorage.getItem("customrandomiservideos"));
    localStorage.setItem("customrandomiserindex", String(index + 1));
    const videoPlayer = document.querySelector("ytd-player #movie_player");
    localStorage.setItem("customrandomiserfullscreen", String(videoPlayer.className.includes("ytp-fullscreen")));
    if (index < videos.length)
        window.location.assign("https://youtube.com/watch?v=" + videos[index].Id);
    else
        localStorage.setItem("customrandomiseractive", String(false));
}
class Randomizer {
    initialize() {
        this.checkIfFinished();
        this.checkFullScreen();
    }
    checkIfFinished() {
        const videoPlayer = document.querySelector("ytd-player #movie_player");
        if (videoPlayer && videoPlayer.className.includes("ended-mode"))
            changeSong();
        else
            setTimeout(() => { this.checkIfFinished(); }, 1000);
    }
    checkFullScreen() {
        const videoPlayer = document.querySelector("ytd-player #movie_player");
        if (videoPlayer) {
            if (localStorage.getItem("customrandomiserfullscreen") == "true"
                && !videoPlayer.className.includes("ytp-fullscreen"))
                document.dispatchEvent(new KeyboardEvent("keydown", { keyCode: 70 }));
        }
        else
            setTimeout(() => { this.checkFullScreen(); }, 1000);
    }
}
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}
class Shuffler {
    onShuffleClick(e) {
        const listReader = new ListReader();
        const videos = listReader.readList();
        var shuffledVideos = shuffle(videos);
        localStorage.setItem("customrandomiservideos", JSON.stringify(shuffledVideos));
        localStorage.setItem("customrandomiserindex", String(0));
        localStorage.setItem("customrandomiseractive", String(true));
        changeSong();
        e.preventDefault();
    }
    addShuffleButton() {
        let element = document.createElement("button");
        element.textContent = "Shuffle";
        element.addEventListener("click", this.onShuffleClick);
        // Case for when you own the playlist
        let title = document.getElementById("display-dialog");
        // Case for when you don't own the playlist
        if (!title)
            title = document.querySelector("h1#title");
        title.append(element);
    }
}
function initialize() {
    if (window.location.pathname == "/playlist") {
        const shuffler = new Shuffler();
        shuffler.addShuffleButton();
    }
    if (window.location.pathname == "/watch" && Boolean(localStorage.getItem("customrandomiseractive")) === true) {
        const randomizer = new Randomizer();
        randomizer.initialize();
    }
}
initialize();
//# sourceMappingURL=index.js.map