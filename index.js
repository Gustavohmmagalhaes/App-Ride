const rideListElement = document.querySelector("#rideList")
const allRides = getAllRides()

allRides.forEach(async([id, value]) => {
    const ride = JSON.parse(value)
    ride.id = id

    const firstPosition = ride.data[0]
    const firstLocationData = await getLocationData(firstPosition.latitude, firstPosition.longitude)
    const itemElement = document.createElement("li")
    itemElement.id = ride.id
    itemElement.innerText = `${firstLocationData.city} - ${firstLocationData.countryCode}`
    rideListElement.appendChild(itemElement)

    const cityDiv = document.createElement("div")
    cityDiv.innerText = `${firstLocationData.city} - ${firstLocationData.countryCode}`

    const maxSpeedDiv = document.createElement("div")
    maxSpeedDiv.innerText = `MaxSpeed: ${getMaxSpeed(ride.data)} Km/h`

    const distanceDiv = document.createElement("div")
    distanceDiv.innerText = `Distance: ${getDistance(ride.data)} Km`

    const durationDiv = document.createElement("div")
    durationDiv.innerText = getDuration(ride)

    const dateDiv = document.createElement("div")
    dateDiv.innerText = getStartDate(ride)

    itemElement.appendChild(cityDiv)
    itemElement.appendChild(maxSpeedDiv)
    itemElement.appendChild(distanceDiv)
    itemElement.appendChild(durationDiv)
    itemElement.appendChild(dateDiv)
    rideListElement.appendChild(itemElement)
    
    
})

async function getLocationData(latitude, longitude) {
    
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    const response = await fetch(url)
    return await response.json()
}

function getMaxSpeed(position) {

    let maxSpeed = 0
    position.forEach(position => {
        if (position.speed !== null && position.speed > maxSpeed)
            maxSpeed = position.speed
    }) 
    return (maxSpeed * 3.6).toFixed(1)
}

function getDistance(position) {
    const earthRadiuskm = 6371
    let TotalDistance = 0
    for (let i = 0; i < position.length - 1; i++) {
        const p1 = {
            latitude: position[i].latitude,
            longitude: position[i].longitude
        }
        const p2 = {
            latitude: position[i + 1].latitude,
            longitude: position[i + 1].longitude
        }

        const dLat = (p2.latitude - p1.latitude) * Math.PI / 180
        const dLon = (p2.longitude - p1.longitude) * Math.PI / 180

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(p1.latitude * Math.PI / 180) * Math.cos(p2.latitude * Math.PI / 180)

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

        const distance = earthRadiuskm * c

        TotalDistance += distance
  
    }
    return (TotalDistance).toFixed(2)
}

function getDuration(ride) {
    
    function format(number,digits) {
        return String(number.toFixed(0)).padStart(2,'0')
    }

    const interval = (ride.stopTime - ride.startTime)/1000
    const minutes = Math.trunc(interval / 60)
    const seconds = interval % 60
    return `${format(minutes,2)}:${format(seconds,2)}`

}

function getStartDate(ride) {

    const d= new Date(ride.startTime)
    const day = d.toLocaleString("en-US", {day: "numeric"})
    const month = d.toLocaleString("en-US", {month: "numeric"})
    const year = d.toLocaleString("en-US", {year: "numeric"})

    const hour = d.toLocaleString("en-US", {hour: "2-digit", hour12: false})
    const minute = d.toLocaleString("en-US", {minute: "2-digit"})

    return `${hour}:${minute} - ${month} ${day}, ${year}`
}