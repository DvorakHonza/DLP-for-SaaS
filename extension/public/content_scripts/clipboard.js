document.addEventListener(
    'copy',
    function(){
        chrome.runtime.sendMessage(
            { script: "clipboard.js" },
        );
    },
    true
    );