"use strict";


chrome.printerProvider.onGetPrintersRequested.addListener( (a) => {
    console.log("printers requested");
} );

chrome.printerProvider.onGetCapabilityRequested.addListener( (printerId, callback) => {
    console.log("capabilities requested")
} );


chrome.printerProvider.onPrintRequested.addListener(
    (printJob, resultCallback) => {
        console.log("print requested");
        console.log(JSON.stringify(printJob));
});

function resultCallback(result) {
    console.log(result)
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

chrome.downloads.onCreated.addListener( downloadItem => {
    console.log('downloadItem :>> ', downloadItem);
    if (downloadItem.url.includes("sharepoint.com")) {
        console.log("Detected download from sharepoint.");
        sendMessage(downloadItem);
    }
    else
        console.log("Not a sensitive file");
})