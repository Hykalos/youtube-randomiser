class Video {
    constructor(id) {
        this.Id = id;
    }
}
class ListReader {
    readList() {
        const anchors = document.querySelectorAll("ytd-playlist-video-list-renderer a.ytd-playlist-video-renderer");
        let videos = new Array(anchors.length);
        for (let i = 0; i < anchors.length; ++i) {
            const href = anchors[i].getAttribute("href");
            const idIndex = href.indexOf("?v=");
            const id = href.substr(idIndex + 3, 11);
            let video = new Video(id);
            videos[i] = video;
        }
        return videos;
    }
}
class Randomizer {
    initialize() {
        this.checkIfFinished();
    }
    changeSong() {
        const index = Number(localStorage.getItem("customrandomiserindex"));
        const videos = JSON.parse(localStorage.getItem("customrandomiservideos"));
        localStorage.setItem("customrandomiserindex", String(index + 1));
        if (index < videos.length)
            window.location.assign("https://youtube.com/watch?v=" + videos[index].Id);
        else
            localStorage.setItem("customrandomiseractive", String(false));
    }
    checkIfFinished() {
        const videoPlayer = document.querySelector("ytd-player #movie_player");
        if (videoPlayer && videoPlayer.className.includes("ended-mode"))
            this.changeSong();
        else
            setTimeout(() => { this.checkIfFinished(); }, 1000);
    }
}
class Shuffler {
    constructor(randomizer) {
        this.randomizer = randomizer;
    }
    shuffle(array) {
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
    onShuffleClick(e) {
        const listReader = new ListReader();
        const videos = listReader.readList();
        localStorage.setItem("customrandomiservideos", JSON.stringify(this.shuffle(videos)));
        localStorage.setItem("customrandomiserindex", String(0));
        localStorage.setItem("customrandomiseractive", String(true));
        this.randomizer.changeSong();
        e.preventDefault();
    }
    addShuffleButton(randomizer) {
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
    const randomizer = new Randomizer();
    if (window.location.pathname == "/playlist") {
        const shuffler = new Shuffler(randomizer);
        shuffler.addShuffleButton(randomizer);
    }
    if (window.location.pathname == "/watch" && Boolean(localStorage.getItem("customrandomiseractive")) === true) {
        randomizer.initialize();
    }
}
initialize();
//# sourceMappingURL=index.js.map