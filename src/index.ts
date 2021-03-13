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

function onShuffleClick(e : Event) : void {
    const listReader = new ListReader();

    const videos = listReader.readList();

    console.log(videos.length, videos[0]);

    window.location.replace("https://youtube.com/watch?v=" + videos[0].Id + "&customrandomiser=true");

    e.preventDefault();
}

function addButton() : void {
    let element = document.createElement("button");
    element.textContent = "Shuffle";

    element.addEventListener("click", onShuffleClick);

    let title = document.getElementById("display-dialog");

    title.append(element);
}

function initialize() : void {
    console.log(window.location.pathname == "/playlist");
    if(window.location.pathname == "/playlist")
        addButton();

    
}

initialize();