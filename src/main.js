import * as THREE from "three"
import axios from "axios"
import '../style.css'
import config from "../src/config.js"

let options = {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("ACCESS_TOKEN")
    }
}

async function init() {
    // Setup radar
    drawQuadrants()

    // Get current player information
    await getStatus()

    // Get current systems
    await getSystems()

    // Get contracts
    await getContracts()
}
init()

async function getStatus() {

    // Get status from localStorage
    let myAgentLocal = localStorage.getItem("my_agent")

    let status = null

    // if its not in localStorage get it from the api
    if(myAgentLocal == null) {
        let response = await fetch("https://api.spacetraders.io/v2/my/agent", options)
        let json = await response.json()
        myAgentLocal = json.data
        status = myAgentLocal
        localStorage.setItem("my_agent", JSON.stringify(json.data))
    } else {
        status = JSON.parse(myAgentLocal)
    }

    // Do something with the data
    let accountId = document.querySelector("#account-id")
    let credits = document.querySelector("#credits")
    let headquarters = document.querySelector("#headquarters")
    let symbol = document.querySelector("#symbol")

    accountId.textContent = status.accountId
    credits.textContent = status.credits
    headquarters.textContent = status.headquarters
    symbol.textContent = status.symbol
}

document.querySelector("#get-universe-button").addEventListener("click", getSystems)
document.querySelector("#access-token-save-button").addEventListener("click", saveAccessToken)

async function getSystems() {

    // Get status from localStorage
    let systemsLocal = localStorage.getItem("systems")

    let status = null

    // if its not in localStorage get it from the api
    if(systemsLocal == null) {
        let response = await fetch('https://api.spacetraders.io/v2/systems', options)
        let json = await response.json()
        systemsLocal = json.data
        localStorage.setItem("systems", JSON.stringify(systemsLocal))
        status = systemsLocal
    } else {
        status = JSON.parse(systemsLocal)
    }

    drawSystems(status)
}

async function getContracts() {

    // Get status from localStorage
    let contractsLocal = localStorage.getItem("contracts")

    let status = null

    // if its not in localStorage get it from the api
    if(contractsLocal == null) {
        let response = await fetch(config.endpointContracts, options)
        let json = await response.json()
        contractsLocal = json.data
        localStorage.setItem("contracts", JSON.stringify(contractsLocal))
        status = contractsLocal
    } else {
        status = JSON.parse(contractsLocal)
    }

    console.log(status)
}

function saveAccessToken() {
    let token = document.querySelector("#input-token").value
    localStorage.setItem("ACCESS_TOKEN", token)
}

function drawQuadrants() {
    let canvas = document.querySelector("#canvas")
    let ctx = canvas.getContext("2d")
    let center = { x: canvas.width / 2, y: canvas.height / 2}

    ctx.fillStyle = "#059142"
    ctx.moveTo(center.x, 0)
    ctx.lineTo(center.x, canvas.height)
    ctx.stroke()

    ctx.fillStyle = "#059142"
    ctx.moveTo(0, center.y)
    ctx.lineTo(canvas.width, center.y)
    ctx.stroke()
}


function drawSystems(response) {
    let systems = response

    let canvas = document.querySelector("#canvas")
    var ctx = canvas.getContext("2d")
    let center = { x: canvas.width / 2, y: canvas.height / 2}

    for(let i = 0; i < systems.length; i++) {
        let coordinates = { x: systems[i].x, y: systems[i].y }
        
        ctx.beginPath()
        ctx.fillStyle = "#059142"
        // x, y, radius, start angle, end angle
        ctx.arc(center.x + coordinates.x, center.y + coordinates.y, 3, 0, 2 * Math.PI)
        ctx.fill()
    }

    // draw the quadrants again, over the systems
    drawQuadrants()
}