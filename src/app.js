// import required libraries
const yargs = require('yargs')
const axios = require('axios')

const key = require('./config')

// get command from user
const argv = yargs.options({
    address: {
        describe: "Your current address",
        demandOption: true,
        type: "string",
        alias: 'a'
    }
})
.help()
.argv

const encodedLocation = encodeURIComponent(argv.address)

// initialize variables
const geoDataURL = 'https://maps.googleapis.com/maps/api/geocode/json'
const tempURL = 'https://api.darksky.net/forecast/'
const geoData = {}
const tempData = {}

// get lat, long from input weather
axios.get(`${geoDataURL}?key=${key.geo}&address=${encodedLocation}`)
.then(data => {
    if(data.data.status === "OK"){
        geoData.address = data.data.results[0].formatted_address
        geoData.lat = data.data.results[0].geometry.location.lat
        geoData.lng = data.data.results[0].geometry.location.lng
    
        return axios.get(`${tempURL}${key.temp}/${geoData.lat},${geoData.lng}`)
    }else if(data.status === "ZERO_RESULTS"){
        console.log('Unable to find place.')
    }
})
.then(data => {
    tempData.temp = data.data.currently.temperature
    tempData.apparentTemp = data.data.currently.apparentTemperature
    viewResult()
})
.catch(error => {
    console.log('Unable to connect to server.')
})

const viewResult = () => {
    console.log(`Weather information of ${geoData.address}`)
    console.log('-----------------------------------------')
    console.log(`Current temperature is ${tempData.temp}F`)
    console.log(`It feels like: ${tempData.apparentTemp}F`)
}