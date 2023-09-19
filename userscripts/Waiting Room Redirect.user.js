// ==UserScript==
// @name         Waiting Room Redirect
// @namespace    https://www.fryingpain.com
// @homepage     https://www.fryingpain.com/userscripts/
// @version      1.0
// @description  Redirects from the waiting room to a 2b2t style waiting room.
// @author       FryingPain (ChatGPT)
// @match        https://beta.character.ai/*
// @grant        none
// @downloadURL  https://www.fryingpain.com/userscripts/Waiting Room Redirect.user.js
// @updateURL  https://www.fryingpain.com/userscripts/Waiting Room Redirect.user.js
// ==/UserScript==

(function() {
    // Check if the page contains the <h2> element with the specified text
    const waitTimeHeader = document.querySelector("h2");
    if (waitTimeHeader && waitTimeHeader.textContent.includes("Your estimated wait time is")) {
        // Extract the remaining minutes from the text
        const remainingTime = extractRemainingTime(waitTimeHeader.textContent);

        // Redirect to the personalized HTML page with the time parameter
        window.location.href = `https://www.fryingpain.com/waiting.html?time=${remainingTime}`;
    }

    function extractRemainingTime(text) {
        // Extract the remaining time from the text using regular expressions
        const regex = /Your estimated wait time is (\d+) minute/;
        const match = text.match(regex);

        if (match && match[1]) {
            return match[1];
        }

        // If no match is found, return a default value
        return "unknown";
    }
})();
