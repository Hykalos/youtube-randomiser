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
            let video = new Video(anchors[i].getAttribute("href"));

            videos[i] = video;
        }

        return videos;
    }
}

function Initialize() : void {
    if(window.location.pathname != "/playlist" || (!window.location.search.includes("&list=") && !window.location.search.includes("?list=")))
        return;

    const reader = new ListReader();

    let videos = reader.readList();

    console.log(videos);
}

Initialize();