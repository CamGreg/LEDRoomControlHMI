
const url = "ws://192.168.0.255:1337/";
var button;
var canvas;
var context;
const toggleButton = document.querySelector("#toggleButton");
toggleButton.addEventListener("click", toggle, false);

const Sliders = document.querySelectorAll(".slider")
for (let index = 0; index < Sliders.length; index++) {
    Sliders[index].oninput = SliderChange
}

function SliderChange() {
    doSend(this.id + "," + ScaleToRGB(Number(this.value)));
}

// toggleButton.addEventListener("click", changeColor, false);
function toggle(evt) {
    doSend(evt.currentTarget.id);
}

// This is called when the page finishes loading
function init() {
    // Assign page elements to variables
    button = document.querySelector("#toggleButton");
    canvas = document.querySelector("#led");

    // Draw circle in canvas
    context = canvas.getContext("2d");
    context.arc(25, 25, 15, 0, Math.PI * 2, false);
    context.lineWidth = 3;
    context.strokeStyle = "black";
    context.stroke();
    context.fillStyle = "black";
    context.fill();

    // Connect to WebSocket server
    // TODO enable this once uC with websockets is configured
    // wsConnect(url);
}

// Call this to connect to the WebSocket server
function wsConnect(url) {
    // Connect to WebSocket server
    websocket = new WebSocket(url);

    // Assign callbacks
    websocket.onopen = function (evt) { onOpen(evt) };
    websocket.onclose = function (evt) { onClose(evt) };
    websocket.onmessage = function (evt) { onMessage(evt) };
    websocket.onerror = function (evt) { onError(evt) };
}

// Called when a WebSocket connection is established with the server
function onOpen(evt) {

    // Log connection state
    console.log("Connected");

    // Enable button
    button.disabled = false;

    // Get the current state of the LED
    doSend("getLEDState");
}

// Called when the WebSocket connection is closed
function onClose(evt) {

    // Log disconnection state
    console.log("Disconnected");

    // Disable button
    button.disabled = true;

    // Try to reconnect after a few seconds
    setTimeout(function () { wsConnect(url) }, 2000);
}

// Called when a message is received from the server
function onMessage(evt) {

    // Print out our received message
    console.log("Received: " + evt.data);

    // Update circle graphic with LED state
    switch (evt.data) {
        case "0":
            console.log("LED is off");
            context.fillStyle = "black";
            context.fill();
            break;
        case "1":
            console.log("LED is on");
            context.fillStyle = "red";
            context.fill();
            break;
        default:
            break;
    }
}

// Called when a WebSocket error occurs
function onError(evt) {
    console.log("ERROR: " + evt.data);
}

// Sends a message to the server (and prints it to the console)
function doSend(message) {
    // console.log("Sending: " + message);
    window.alert(message);
    websocket.send(message);
}

// Called whenever the HTML button is pressed
function onPress() {
    doSend("toggleLED");
    doSend("getLEDState");
}

// Call the init function as soon as the page loads
window.addEventListener("load", init, false);



function ScaleToRGB(Wavelength) {
    let Red, Green, Blue;

    if ((Wavelength >= 350) && (Wavelength < 380)) {
        Red = 255;
        Green = 0;
        Blue = Math.round(-255 * (Wavelength - 380) / (380 - 350));
    }
    else if ((Wavelength >= 380) && (Wavelength < 440)) {
        Red = Math.round(-255 * (Wavelength - 440) / (440 - 380));
        Green = 0;
        Blue = 255;
    } else if ((Wavelength >= 440) && (Wavelength < 490)) {
        Red = 0;
        Green = Math.round(255 * (Wavelength - 440) / (490 - 440));
        Blue = 255;
    } else if ((Wavelength >= 490) && (Wavelength < 510)) {
        Red = 0;
        Green = 255;
        Blue = Math.round(-255 * (Wavelength - 510) / (510 - 490));
    } else if ((Wavelength >= 510) && (Wavelength < 580)) {
        Red = Math.round(255 * (Wavelength - 510) / (580 - 510));
        Green = 255;
        Blue = 0;
    } else if ((Wavelength >= 580) && (Wavelength < 645)) {
        Red = 255;
        Green = Math.round(-255 * (Wavelength - 645) / (645 - 580));
        Blue = 0;
    } else if ((Wavelength >= 645) && (Wavelength < 781)) {
        Red = 255;
        Green = 0;
        Blue = 0;
    } else {
        Red = 0;
        Green = 0;
        Blue = 0;
    }

    let section = Math.floor(Wavelength / 255)
    let distance = Wavelength % 255

    switch (section) {
        case 0:
            Red = 255;
            Green = Wavelength;
            Blue = 0;
            break;
        case 1:
            Red = (255 - distance);
            Green = 255;
            Blue = 0;
            break;
        case 2:
            Red = 0;
            Green = 255;
            Blue = distance;
            break;
        case 3:
            Red = 0;
            Green = (255 - distance);
            Blue = 255;
            break;
        case 4:
            Red = distance;
            Green = 0;
            Blue = 255;
            break;
        case 5:
            Red = 255;
            Green = 0;
            Blue = (255 - distance);
            break;
        case 6:
            Red = 255;
            Green = 0;
            Blue = 0;
            break;
        default:
            Red = 0;
            Green = 0;
            Blue = 0;
            break;
    }

    let rgb = [];
    rgb.push(Red, Green, Blue);
    return rgb;
}