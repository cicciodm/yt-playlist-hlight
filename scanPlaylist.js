function convertToSeconds(secondsAsString) {
    const [min, secs] = secondsAsString.split(":").map(str => Number.parseInt(str));
    return min * 60 + secs;
}

function setIdForPlaylistLinks(children) {
    let times = [];
    for (let i = 0; i < children.length; i++) {
        const elem = children[i];
        if (elem.nodeName === "A" && elem.outerHTML.includes("yt.www.watch.player.seekTo")) {
            const time = convertToSeconds(elem.textContent);
            elem.id = time;
            times.push(time);
        }
    }
    return times;
}

function markPlaylistLinkAt(time) {
    const asString = time + "";
    const anchor = document.getElementById(asString);

    if (anchor) {
        anchor.style.backgroundColor = "red";
    } else {
        console.log("not found");
    }
}

function listen(index, times) {
    setTimeout(function() {
        if (index == times.length) {
            return;
        }

        const currentTime = convertToSeconds(document.getElementsByClassName("ytp-time-current")[0].innerHTML);
        const prev = times[index - 1];
        
        if (currentTime >= prev) {
            const highlighted = document.getElementById(prev + "");
            highlighted.style.backgroundColor = "none";

            const curr = times[index];
            const currElement = document.getElementById(curr + "");
            currElement.style.backgroundColor = "red";
            index++;
        }
        listen(index, times);
    }, 1000);
}

function startListening(times) {    
    const index = 1;

    listen(index, times);
}

function startPlaylistHighliting() {
    console.log("executing");
    const description = document.getElementById("eow-description");
    const children = description.childNodes;

    if (!children) {
        return;
    }
    
    const times = setIdForPlaylistLinks(children);
    markPlaylistLinkAt(0);

    startListening(times);
}


startPlaylistHighliting();

