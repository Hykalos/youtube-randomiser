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

function changeSong() {
    let index : number = Number(localStorage.getItem("customrandomiserindex"));

    let videos : Video[] = JSON.parse(localStorage.getItem("customrandomiservideos"));

    localStorage.setItem("customrandomiserindex", String(index + 1));

    if(index < videos.length)
        window.location.assign("https://youtube.com/watch?v=" + videos[index].Id);
}

function shuffle(array : Video[]) {
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

function onShuffleClick(e : Event) : void {
    const listReader = new ListReader();

    const videos = listReader.readList();

    localStorage.setItem("customrandomiservideos", JSON.stringify(shuffle(videos)));
    localStorage.setItem("customrandomiserindex", String(0));
    localStorage.setItem("customrandomiseractive", String(true));

    console.log(videos.length, videos[0]);

    changeSong();

    e.preventDefault();
}

function addShuffleButton() : void {
    let element = document.createElement("button");
    element.textContent = "Shuffle";

    element.addEventListener("click", onShuffleClick);

    let title = document.getElementById("display-dialog");

    title.append(element);
}

function initialize() : void {
    if(window.location.pathname == "/playlist")
        addShuffleButton();

    if(window.location.pathname == "/watch" && Boolean(localStorage.getItem("customrandomiseractive")) === true)
        console.log("Randomiser active");
}

initialize();