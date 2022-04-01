/* {
    timestamp
    operation
    url
    user
    actionTaken?

} */

export function extensionMessageHandler(message, sender, sendResponse) {
    console.log("Message received");
    console.dir(message);
    return true;
}

var port = null;

function onMessage(msg) {
    console.log("Received: " + msg);
}

function onDisconnect() {
    port = null;
    console.log("Port disconnected");
}

function connect() {
    if (port == null) {
        console.log("Connecting to port");
        port = chrome.runtime.connectNative('com.deshawn.example');
        port.onMessage.addListener(onMessage);
        port.onDisconnect.addListener(onDisconnect);
    }
}

function sendMessage(msg) {
    if (port == null){
        connect();
    }
    console.log("Sending message");
    port.postMessage(msg);
}