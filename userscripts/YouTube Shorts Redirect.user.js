// ==UserScript==
// @name         YouTube Shorts Redirect
// @namespace    https://www.fryingpain.com
// @homepage     https://www.fryingpain.com/userscripts/
// @version      1.0
// @description  Redirects from /shorts/ to /watch?v= on YouTube
// @author       FryingPain & ChatGPT
// @match        https://www.youtube.com/shorts/*
// @grant        none
// @downloadURL  https://www.fryingpain.com/userscripts/YouTube Shorts Redirect.user.js
// @updateURL  https://www.fryingpain.com/userscripts/YouTube Shorts Redirect.user.js
// ==/UserScript==

(function() {
    'use strict';

    var match = window.location.pathname.match(/\/shorts\/(\w+)/);
    if (match) {
        var videoId = match[1];

        window.location.href = 'https://www.youtube.com/watch?v=' + videoId;
    }
})();
