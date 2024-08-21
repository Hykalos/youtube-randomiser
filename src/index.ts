class Video {
    Id : string;

    constructor(id: string) {
        this.Id = id;
    }
}

class ListReader {
    readList() : Video[] {
        const anchors : NodeListOf<Element> = document.querySelectorAll("ytd-playlist-video-list-renderer a.ytd-playlist-video-renderer");

        let videos : Video[] = new Array(anchors.length);

        for(let i = 0; i < anchors.length; ++i) {
            const href = anchors[i].getAttribute("href");
            const idIndex = href.indexOf("?v=")
            const id = href.substring(idIndex + 3, idIndex + 14);
            let video = new Video(id);

            videos[i] = video;
        }

        return videos;
    }
}

function changeSong() : void {
    const index : number = Number(localStorage.getItem("customrandomiserindex"));

    const videos : Video[] = JSON.parse(localStorage.getItem("customrandomiservideos"));

    localStorage.setItem("customrandomiserindex", String(index + 1));

    const videoPlayer = document.querySelector("ytd-player #movie_player") as HTMLElement;
    localStorage.setItem("customrandomiserfullscreen", String(videoPlayer.className.includes("ytp-fullscreen")))

    if(index < videos.length)
        window.location.assign("https://youtube.com/watch?v=" + videos[index].Id);
    else
        localStorage.setItem("customrandomiseractive", String(false));
}

class Randomizer {
    initialize(): void {
        this.checkIfFinished();

        this.checkFullScreen();
    }

    checkIfFinished(): void {
        const videoPlayer = document.querySelector("ytd-player #movie_player") as HTMLElement;

        if(videoPlayer && videoPlayer.className.includes("ended-mode"))
            changeSong();
        else
            setTimeout(() => { this.checkIfFinished(); }, 1000);
    }

    checkFullScreen(): void {
        const videoPlayer = document.querySelector("ytd-player #movie_player") as HTMLElement;

        if(videoPlayer) {
            if(localStorage.getItem("customrandomiserfullscreen") == "true"
                && !videoPlayer.className.includes("ytp-fullscreen"))
                document.dispatchEvent(new KeyboardEvent("keydown", { keyCode: 70}));
        }
        else
            setTimeout(() => { this.checkFullScreen(); }, 1000);
    }
}

function shuffle(array : Video[]) : Video[] {
    var currentIndex : number = array.length, temporaryValue, randomIndex;

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
    onShuffleClick(e : Event) : void {
        const listReader : ListReader = new ListReader();
    
        const videos : Video[] = listReader.readList();

        var shuffledVideos : Video[] = shuffle(videos);

        localStorage.setItem("customrandomiservideos", JSON.stringify(shuffledVideos));
        localStorage.setItem("customrandomiserindex", String(0));
        localStorage.setItem("customrandomiseractive", String(true));

        changeSong();

        e.preventDefault();
    }
    
    addShuffleButton() : void {
        let element = document.createElement("button");
        element.textContent = "Shuffle";

        element.addEventListener("click", this.onShuffleClick);

        // Put the button next to the owner
        let title = document.getElementById("owner-text");

        title.append(element);
    }
}

function initialize() : void {
    if(window.location.pathname == "/playlist")
    {
        const shuffler = new Shuffler();
        shuffler.addShuffleButton();
    }

    if(window.location.pathname == "/watch" && Boolean(localStorage.getItem("customrandomiseractive")) === true)
    {
        const randomizer = new Randomizer();

        randomizer.initialize();
    }
}

initialize();