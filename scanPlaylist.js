function getCurrentTimeAsString() {
    return document.getElementsByClassName("ytp-time-current")[0].innerHTML;
}

function convertToSeconds(secondsAsString) {
    const [min, secs] = secondsAsString.split(":").map(str => Number.parseInt(str));
    return min * 60 + secs;
}

function getCurrentTimeInSeconds() {
    return convertToSeconds(getCurrentTimeAsString());
}

function getIdForPlaylistLinks(children) {
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
        if (index == times.length - 1) {
            return;
        }

        const currentTime = getCurrentTimeInSeconds();
        const startTimeOfNextTrack = times[index + 1];

        if (currentTime >= startTimeOfNextTrack) {
            const startOfCurrent = times[index];
            const highlighted = document.getElementById(startOfCurrent + "");
            highlighted.style.backgroundColor = "red";

            const currElement = document.getElementById(startTimeOfNextTrack + "");
            currElement.style.backgroundColor = "yellow";
            index++;
        }
        listen(index, times);
    }, 1000);
}

function startListeningFromTime(times, currentTime) {    
    let index = times.findIndex((time) => {
        return time > currentTime;
    });

    index = index !== -1 ? index - 1 : -1;
    
    listen(index, times);
}

function markAllPlaylistLinksUntil(times, currentTime) {
    let index = 0;

    while(times[index] < currentTime) {
        markPlaylistLinkAt(times[index]);
        index++;
    }
}

function startPlaylistHighliting() {
    const description = document.getElementById("eow-description");
    const children = description.childNodes;

    if (!children) {
        return;
    }
    
    const times = getIdForPlaylistLinks(children);
    const currentTime = getCurrentTimeInSeconds();

    markAllPlaylistLinksUntil(times, currentTime);

    startListeningFromTime(times, currentTime);
}

startPlaylistHighliting();