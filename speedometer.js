const speedElement = document.querySelector("#speed")
const startbtn = document.querySelector("#start")
const stopbtn = document.querySelector("#stop")

let watchID = null

startbtn.addEventListener("click", () => {

    if(watchID){
        return
    }

    function handleSuccess(position){
        speedElement.innerText= position.coords.speed ? (position.coords.speed * 3.6).toFixed(1) :0
    }
    function handleError(error){
        console.log(error.msg)
    }
    const options = { enableHighAccuracy: true}
    watchID = navigator.geolocation.watchPosition(handleSuccess, handleError, options)

    startbtn.classList.add("d-none")
    stopbtn.classList.remove("d-none")
})

stopbtn.addEventListener("click", () => {
    if(!watchID){
        return
    }
    navigator.geolocation.clearWatch(watchID)
    watchID = null
    startbtn.classList.remove("d-none")
    stopbtn.classList.add("d-none")
})

