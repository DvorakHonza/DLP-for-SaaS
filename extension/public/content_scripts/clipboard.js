document.addEventListener(
    'copy',
    function(event){
        chrome.runtime.sendMessage(
            { script: "clipboard.js" },
        );
    },
    true
    );