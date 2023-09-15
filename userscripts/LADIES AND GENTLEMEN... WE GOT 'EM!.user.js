// ==UserScript==
// @name         LADIES AND GENTLEMEN... WE GOT 'EM!
// @namespace    https://www.fryingpain.com
// @homepage     https://www.fryingpain.com/userscripts/
// @version      1.0
// @description  Converts the "We couldn't generate a reply" into a dead meme & takes a screenshot when that happens...
// @author       FryingPain & ChatGPT :troll:
// @match        https://*.character.ai/*
// @grant        GM_download
// @grant        none
// @require      https://html2canvas.hertzen.com/dist/html2canvas.min.js
// @downloadURL  https://www.fryingpain.com/userscripts/LADIES AND GENTLEMEN... WE GOT 'EM!.user.js
// @updateURL  https://www.fryingpain.com/userscripts/LADIES AND GENTLEMEN... WE GOT 'EM!.user.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to replace the text inside all <p> elements
    function customizeToastifyMessages() {
        const toastContainer = document.querySelector('.Toastify__toast-container');

        if (toastContainer) {
            const pElements = toastContainer.querySelectorAll('p');

            pElements.forEach((pElement, index) => {
                switch (index) {
                    case 0:
                        pElement.innerHTML = '<b>LADIES AND GENTLEMEN...</b>';
                        break;
                    case 1:
                        pElement.textContent = "WE GOT 'EM!";
                        break;
                    case 2:
                        pElement.textContent = 'The FBI has been called.. stay still...';
                        break;
                    // Add more cases for additional paragraphs as needed
                }
            });

            function downloadScreenshot(imageBase64) {
                console.log(imageBase64);
    const link = document.createElement('a');
    link.href = imageBase64;
    link.download = 'proof_to_fbi.png';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

            // Capture a screenshot
            html2canvas(document.body, {
    useCORS: true, // Enable CORS for cross-origin content
}).then(canvas => {
    const imageBase64 = canvas.toDataURL('image/png');
    // Trigger the download of the screenshot
    downloadScreenshot(imageBase64);
});
        }
    }

    // Function to play a sound
    function playSound(soundURL) {
        const audio = new Audio(soundURL);
        audio.play();
    }

    // Mutation Observer to watch for changes in the DOM
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                // Check if the added node matches the specific structure
                const addedNode = mutation.addedNodes[0];

                if (addedNode.classList.contains('Toastify__toast-container')) {
                    // Customize the messages and capture a screenshot
                    customizeToastifyMessages();

                    // Play a sound (replace 'soundURL' with the actual URL of your sound)
                    playSound('https://www.fryingpain.com/assets/ladies.mp3');
                }
            }
        });
    });

    // Start observing changes in the DOM
    observer.observe(document.body, { childList: true, subtree: true });
})();
