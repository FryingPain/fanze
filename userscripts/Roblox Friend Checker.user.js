// ==UserScript==
// @name         Roblox Friend Checker
// @namespace    https://www.fryingpain.com
// @homepage     https://www.fryingpain.com/userscripts/
// @version      1.0
// @description  Checks if someone unfriended you just now and prompts you to take a look at it.
// @author       FryingPain & ChatGPT
// @match        https://www.roblox.com/home
// @match        https://web.roblox.com/home
// @grant        GM.setValue
// @grant        GM.getValue
// @downloadURL  https://www.fryingpain.com/userscripts/Roblox Friend Checker.user.js
// @updateURL  https://www.fryingpain.com/userscripts/Roblox Friend Checker.user.js
// ==/UserScript==
(function() {
    'use strict';

    // Declare a flag to track whether the script has already executed
    let scriptExecuted = false;

    // Declare currentFriendsData in a higher scope
    let currentFriendsData;

    // Function to make a GET request to a URL
    async function fetchJson(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }
            return response.json();
        } catch (error) {
            console.error(error);
            return null; // Return a default value or handle the error as needed
        }
    }

    // Function to check for changes in friends count
    async function checkFriendsCount() {
        if (scriptExecuted) {
            return; // Script already executed, exit
        }

        scriptExecuted = true; // Set the flag to true to prevent further execution

        const currentFriendsCount = await fetchJson('https://friends.roblox.com/v1/users/254334857/friends/count');
        const savedFriendsCount = (await GM.getValue('savedFriendsCount')) || 0;
        const currentFriendsData = await fetchJson('https://friends.roblox.com/v1/users/254334857/friends');
        const savedFriendsData = (await GM.getValue('savedFriendsData')) || []; // Use [] as the default value

        console.log(currentFriendsCount.count + "|" + savedFriendsCount);

        if (currentFriendsCount.count < savedFriendsCount) {
            console.log("Detected unfriend...");

            // Fetch the current friends data

            console.log("CURRENT ------------");
            console.log(currentFriendsData);
            console.log("OLD ------------");
            console.log(savedFriendsData);


            if (currentFriendsData && savedFriendsData) {
                const currentFriendsArray = currentFriendsData.data.map(user => user.name);
                const savedFriendsArray = savedFriendsData.data.map(user => user.name);

                const unfriendedUsers = savedFriendsArray.filter(userName => !currentFriendsArray.includes(userName));

                if (unfriendedUsers.length > 0) {
                    // If there are unfriended users, you can access their properties here
                    for (const unfriendedUser of unfriendedUsers) {
                        console.log(`Unfriended User: ${unfriendedUser}`);
                    }
                    alert(`It seems like an stupid idiot unfriended you.\nUnfriended: ${unfriendedUsers}.\nTotal friend count: ${currentFriendsCount.count}.`);
                }
            } else {
                console.error("Failed to fetch or process friends data");
            }
        }

        // Update the saved friends count and data
        GM.setValue('savedFriendsCount', currentFriendsCount.count);
        console.log("SAVING TO GM ------------");
        console.log(currentFriendsData);
        await GM.setValue('savedFriendsData', currentFriendsData);

    }

    // Execute the checkFriendsCount function when the page loads
    window.addEventListener('load', checkFriendsCount);
})();