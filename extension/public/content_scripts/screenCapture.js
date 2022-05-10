document.addEventListener(
    'keyup',
    function(event) {
        if (event.key === 'PrintScreen')
            chrome.runtime.sendMessage(
                { script: "screenCapture.js" },
            );
    },
    true
);