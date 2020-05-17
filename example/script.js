var imgs = document.querySelectorAll("img")

imgs.forEach(img => {
    img.addEventListener("click", () => console.log("outro handler"))
})
function start(event) {
    var tags = document.querySelectorAll("*")
    tags.forEach(tag => {
        tag.addEventListener("click", handleTag)
    })

}

function stop(event){
    var tags = document.querySelectorAll("*")
    tags.forEach(tag => {
        tag.removeEventListener("click", handleTag)
    })
}

function handleTag(e) {
    e.preventDefault()
    e.stopPropagation()

    if (e.path[0].tagName === "IMG") {
        window.open(e.toElement.src)
        
    } else {
        var img = e.toElement.parentElement.querySelector("img")
        window.open(img.src)
    }
}