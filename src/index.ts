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
            const id = href.substr(idIndex + 3, 11);
            let video = new Video(id);

            videos[i] = video;
        }

        return videos;
    }
}

class Randomizer {
    initialize(): void {
        this.checkIfFinished();
    }

    changeSong() : void {
        const index : number = Number(localStorage.getItem("customrandomiserindex"));
    
        const videos : Video[] = JSON.parse(localStorage.getItem("customrandomiservideos"));
    
        localStorage.setItem("customrandomiserindex", String(index + 1));
    
        if(index < videos.length)
            window.location.assign("https://youtube.com/watch?v=" + videos[index].Id);
        else
            localStorage.setItem("customrandomiseractive", String(false));
    }

    checkIfFinished(): void {
        const videoPlayer = document.querySelector("ytd-player #movie_player") as HTMLElement;

        if(videoPlayer && videoPlayer.className.includes("ended-mode"))
            this.changeSong();
        else
            setTimeout(() => { this.checkIfFinished(); }, 1000);
    }
}

class Shuffler {
    private randomizer : Randomizer

    constructor(randomizer : Randomizer) {
        this.randomizer = randomizer;
    }

    shuffle(array : Video[]) : Video[] {
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
    
    onShuffleClick(e : Event) : void {
        const listReader = new ListReader();
    
        const videos = listReader.readList();
    
        localStorage.setItem("customrandomiservideos", JSON.stringify(this.shuffle(videos)));
        localStorage.setItem("customrandomiserindex", String(0));
        localStorage.setItem("customrandomiseractive", String(true));
    
        this.randomizer.changeSong();
    
        e.preventDefault();
    }
    
    addShuffleButton(randomizer : Randomizer) : void {
        let element = document.createElement("button");
        element.textContent = "Shuffle";
    
        element.addEventListener("click", this.onShuffleClick);
    
        // Test if this works for when you own the playlist
        let title = document.querySelector("h1#title");
    
        title.append(element);
    }
}

function initialize() : void {
    const randomizer = new Randomizer();

    if(window.location.pathname == "/playlist")
    {
        const shuffler = new Shuffler(randomizer);
        shuffler.addShuffleButton(randomizer);
    }

    if(window.location.pathname == "/watch" && Boolean(localStorage.getItem("customrandomiseractive")) === true)
    {
        randomizer.initialize();
    }
}

initialize();