/* {
    timestamp
    operation
    url
    user
    actionTaken?

} */

const nativeHostName = "com.dlp_for_saas.native_host";

export function extensionMessageHandler(message, sender, sendResponse) {
    console.log("Message received");
    console.dir(message);
    return true;
}

var port = null;

function onMessage(msg) {
    console.log("Received:");
    console.dir(msg);
}

function onDisconnect() {
    port = null;
    console.log("Port disconnected");
}

function connect() {
    if (port == null) {
        console.log("Connecting to port");
        port = chrome.runtime.connectNative(nativeHostName);
        port.onMessage.addListener(onMessage);
        port.onDisconnect.addListener(onDisconnect);
    }
}

export function sendMessage(msg) {
    if (port == null){
        connect();
    }
    console.log("Sending message");
    port.postMessage(msg);
}