chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if(request.active){
            start()
        } else if (!request.active){
            stop()
        }
    }
);

function start() {
    var tags = document.querySelectorAll("*")
    tags.forEach(tag => {
        tag.addEventListener("click", handleTag)
    })

}

function stop() {
    var tags = document.querySelectorAll("*")
    tags.forEach(tag => {
        tag.removeEventListener("click", handleTag)
    })
}

function handleTag(e) {
    e.preventDefault()
    e.stopPropagation()

    switch (e.path[0].tagName.toLowerCase()) {
        case "img":
            window.open(e.toElement.src)
            break;
        case "image":
            window.open(e.toElement.href.baseVal)
        default:
            var img = e.toElement.parentElement.querySelector("img")
            var image = e.toElement.parentElement.querySelector("image")
            if(img){
                window.open(img.src)
            }
            else if(image){
                window.open(image.href.baseVal)
            }
            
            break;
    }
}