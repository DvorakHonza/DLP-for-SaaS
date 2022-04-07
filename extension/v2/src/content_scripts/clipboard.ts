document.addEventListener('copy', function(){
    chrome.runtime.sendMessage({
        type: "clipboardCopy"
    })
})