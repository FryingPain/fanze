// ==UserScript==
// @name         Parappa Google Search
// @namespace    https://www.fryingpain.com
// @homepage     https://www.fryingpain.com/userscripts/
// @version      1.1.0
// @description  Search images. now in parappa style!
// @author       FryingPain & AI :3
// @match        *://www.google.com/search*
// @grant        none
// @downloadURL  https://www.fryingpain.com/userscripts/ParappaGoogleSearch.user.js
// @updateURL    https://www.fryingpain.com/userscripts/ParappaGoogleSearch.user.js
// ==/UserScript==

/*

 IMPORTANT: THIS MAY NOT WORK ON CHROMIUM BASED BROWSERS!

˜”*°•.˜”*°• WELCOME •°*”˜.•°*”˜

Thanks for using my shitty ass script.
This script 'Parappaifies' the Google Search.
Search something, and the script will judge the results, in 3 categories. "ALRIGHT", "BAD" and "AWFUL".
Totally open source, so you can edit it to your liking and fix the shitty code.


˜”*°•.˜”*°• HOW THIS WORKS •°*”˜.•°*”˜

The script gets all the titles & website names and checks if they're in the trigger list.
It'll then add 1 point or 2 points depending on how bad the word is.
It then adds both numbers to make a final score.
Depending on the final score, it's what the grading is.

0-4: ALRIGHT
4-14: BAD
14>: AWFUL

˜”*°•.˜”*°• HOW TO USE •°*”˜.•°*”˜

After changing all you needed to change, do a search on Google (made for Images better), and let the fun begin!
Scroll up and down, and you'll see how the grading changes judging by the website & image titles.
Or you can automate it!
Press "E" and it'll start auto-scrolling.
Press "Q"  to stop the script in general (also stops the auto scrolling.)
If you pressed Q while it was auto-scrolling, it'll prompt you to open up a chart of the overall results.


˜”*°•.˜”*°• HOW TO READ THE CHART •°*”˜.•°*”˜

Well, you opened the chart and you're like 'HOW TF DO I READ THIS?!'
I made up a picture of how to read the chart.
https://www.fryingpain.com/assets/parappa/chart.png

Enjoy my script!
Now i'm going to watch Murder Drones.

*/

(function() {
    'use strict';

    function random(max) {
        return Math.floor(Math.random() * max);
    }

    const detectedOverlay = false; // Set to TRUE to see an overlay of the detected words. (You can also see the words on the console.)

    let stat = "alright";
    let statn = 2;
    let statbef = statn;

    let totalScore = 0;
    let ms = 0;

    /* ˜”*°•.˜”*°• TRIGGER WORDS •°*”˜.•°*”˜

    Remember. Trigger1 adds 1 point to the total score.
    Trigger2 adds 2 points to the total score.
    Feel free to edit those at your liking :3

    Important: Words cannot have spaces. (sad.)
    */
    const Trigger1 = ['amor', 'genderswap', 'deviantart', 'furaffinity', 'affinity', 'wattpad', 'love', 'fat', 'goo', 'changed', 'suggestive', 'yaoi', 'yuri', 'lumity', 'rupphire'];
    const Trigger2 = ['7w7','7u7','r63','chubby','R18','fluff', 'rule', 'hentai', 'nsfw', 'cheeks', 'boozy' /*Fuck you enthuziastic. */ , 'fart', 'toot', 'feet', 'foot', 'vorarephilia', 'vore', 'inflation', 'scat', 'rule34', 'paheal', 'porn', 'dick', 'cum', 'smut', '+18', 'blushmallet', 'diarrhea', 'nightcrawler', 'dakimakura', 'bodypillow', '🔞', 'digestion', 'maid', 'bunny', 'feizao', 'notive', 'explicit', 'r34', 'diaper', 'r64'];

    // The result's are ALRIGHT thing.
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.bottom = '10px';
    overlay.style.left = '10px';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    overlay.style.color = 'white';
    overlay.style.padding = '15px';
    overlay.style.borderRadius = '5px';
    overlay.style.zIndex = '1000';
    overlay.style.fontSize = '30px';
    overlay.textContent = "The result's are ALRIGHT.";

    const topbad = document.createElement('div');
    topbad.style.position = 'fixed';
    topbad.style.bottom = '10px';
    topbad.style.right = '10px';
    topbad.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    topbad.style.color = 'white';
    topbad.style.padding = '5px';
    topbad.style.borderRadius = '5px';
    topbad.style.zIndex = '1000';
    topbad.style.fontSize = '25px';

    const topawful = document.createElement('div');
    topawful.style.position = 'fixed';
    topawful.style.bottom = '100px';
    topawful.style.right = '10px';
    topawful.style.backgroundColor = 'rgba(150, 0, 0, 0.7)';
    topawful.style.color = 'white';
    topawful.style.padding = '15px';
    topawful.style.borderRadius = '5px';
    topawful.style.zIndex = '1000';
    topawful.style.fontSize = '25px';

    /*
    Song 1: Hair Scare - Parappa 2
    Song 2: Instructor Mooselini's RAP - Parappa 1
	You can comment the code and make it force a song.
    */
    const song = 1 + random(2);

    const increase = document.createElement('audio');
    increase.src = 'https://www.fryingpain.com/assets/parappa/getting_better.wav';

    const decrease = document.createElement('audio');
    decrease.src = 'https://www.fryingpain.com/assets/parappa/getting_worse.wav';

    const dgood = document.createElement('audio');
    dgood.src = 'https://www.fryingpain.com/assets/parappa/did_good.wav';

    const dbad = document.createElement('audio');
    dbad.src = 'https://www.fryingpain.com/assets/parappa/did_bad.wav';

    const starter = document.createElement('audio');
    starter.src = 'https://www.fryingpain.com/assets/parappa/Start.mp3';
    starter.volume = 1;

    const scrolling = document.createElement('audio');
    scrolling.src = 'https://www.fryingpain.com/assets/parappa/Running.mp3';
    scrolling.volume = 0.4;
    scrolling.loop = true;

    const shutoff = document.createElement('audio');
    shutoff.src = 'https://www.fryingpain.com/assets/parappa/Shutoff.mp3';
    shutoff.volume = 1;

    const alright = document.createElement('audio');
    alright.src = 'https://www.fryingpain.com/assets/parappa/' + song + '/alright.mp3';
    alright.loop = true;

    const bad = document.createElement('audio');
    bad.src = 'https://www.fryingpain.com/assets/parappa/' + song + '/bad.mp3';
    bad.loop = true;

    const awful = document.createElement('audio');
    awful.src = 'https://www.fryingpain.com/assets/parappa/' + song + '/awful.mp3';
    awful.loop = true;

    const offset = 20;

    alright.currentTime = offset;
    bad.currentTime = offset;
    awful.currentTime = offset;

    const vars = {
        alright: alright,
        bad: bad,
        awful: awful
    };

    document.body.appendChild(overlay);

    if (detectedOverlay) {
        document.body.appendChild(topawful);
        document.body.appendChild(topbad);

    }

    function isVisible(element) {
        const rect = element.getBoundingClientRect();
        return (rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth));
    }

    function getVisibleText() {
        const visibleText = [];
        const elements = document.querySelectorAll('div.toI8Rb.OSrXXb, div.guK3rf.cHaqb');

        elements.forEach(element => {
            if (isVisible(element) && element.textContent.trim().length > 0) {
                visibleText.push(element.textContent.trim());
            }
        });

        return visibleText.join(' ');
    }

    function mus(newValue) {
        alright.play();
        bad.play();
        awful.play();
        alright.volume = 0;
        bad.volume = 0;
        awful.volume = 0;
        vars[stat].volume = 0.5;

        if (newValue === statn) {
            return;
        }

        statbef = statn;
        statn = newValue;

        if (statn > statbef) {
            increase.currentTime = 0;
            increase.play();
        } else {
            decrease.currentTime = 0;
            decrease.play();
        }
    }

    function scroll() {
        window.scrollBy(0, 2);
    }

    function detectWords() {
        alright.play();

        const visibleText = getVisibleText();
        const words = visibleText.match(/\b(\w+)\b/g) || [];
        let score1 = 0;
        let score2 = 0;
        let detect1 = [];
        let detect2 = [];
        words.forEach(word => {
            if (Trigger1.includes(word.toLowerCase())) {
                score1++;
                detect1.push(word.toLowerCase());
            }
            if (Trigger2.includes(word.toLowerCase())) {
                score2 += 2;
                detect2.push(word.toLowerCase());
            }
        });

        totalScore = score1 + score2;
        console.log(detect1);
        console.log(detect2);
        topbad.textContent = detect1;
        topawful.textContent = detect2;
        console.log(totalScore);
        if (totalScore > 14) {
            ms = -1;
            overlay.textContent = "The result's are AWFUL."
            if (stat !== "awful") {
                stat = "awful";
                mus(0);
            }
        } else if (totalScore > 10) {
            if (stat === "bad") {
                overlay.textContent = "The result's are BAD | ▼"
                if (ms !== 1) {
                    ms = 1;
                    dbad.play();
                }
            } else {
                overlay.textContent = "The result's are AWFUL | ▲"
                if (ms !== 0) {
                    ms = 0;
                    dgood.play();
                }
            }

        } else if (totalScore > 6) {
            ms = -1;
            overlay.textContent = "The result's are BAD."
            if (stat !== "bad") {
                stat = "bad";
                mus(1);
            }
        } else if (totalScore > 4) {
            if (stat === "alright") {
                overlay.textContent = "The result's are ALRIGHT | ▼"
                if (ms !== 1) {
                    ms = 1;
                    dbad.play();
                }
            } else {
                overlay.textContent = "The result's are BAD | ▲"
                if (ms !== 0) {
                    ms = 0;
                    dgood.play();
                }
            }
        } else {
            ms = -1;
            overlay.textContent = "The result's are ALRIGHT."
            if (stat !== "alright") {
                stat = "alright";
                mus(2);
            }
        }

        // overlay.textContent = `Score: ${totalScore}`;
    }

    function loopWithDelay(start, end, delay) {
        function loop(i) {
            if (i >= end) {
                window.scrollBy(0, i / 10);
                setTimeout(() => loop(i - 1), delay);
            }
        }
        loop(start);
    }

    let cSeconds = [];
    let cStatus = [];
    let cPoints = [];
    let cReps = 0;

    function updateChart() {
        cReps++;
        cSeconds.push(cReps);
        cStatus.push(statn);
        cPoints.push(totalScore);
    }

    function downloadChart() {
        let chartConfig = {
            type: "line",
            data: {
                labels: cSeconds,
                datasets: [{
                        label: "Status",
                        data: cStatus,
                        fill: false,
                        borderColor: "blue",
                        yAxisID: "y-axis-0"
                    },
                    {
                        label: "Points",
                        data: cPoints,
                        fill: true,
                        borderColor: "red",
                        yAxisID: "y-axis-1"
                    }
                ]
            },
            options: {
                scales: {
                    yAxes: [{
                            id: "y-axis-0",
                            position: "left",
                            ticks: {
                                min: 0,
                                max: 2,
                                stepSize: 1,
                                callback: function(value, index, values) {
                                    return ['AWFUL', 'BAD', 'ALRIGHT'][value];
                                }
                            }
                        },
                        {
                            id: "y-axis-1",
                            position: "right",
                            ticks: {
                                min: 0,
                                max: 40,
                                suggestedMax: 15,
                                stepSize: 2
                            }
                        }
                    ]
                },
                title: {
                    display: true,
                    text: "Parappaifier - Google Search '" + document.title.split('-')[0].trim() + "'"
                }
            }
        };
        let chartConfigJson = JSON.stringify(chartConfig);
        let chartConfigBase64 = btoa(chartConfigJson);
        return "https://quickchart.io/chart?bkg=white&encoding=base64&c=" + chartConfigBase64;
    }

    // Now start the thing!
    window.addEventListener('load', detectWords);
    window.addEventListener('scroll', detectWords);
    window.addEventListener('resize', detectWords);
    detectWords();

    let intervalId
    let updateChartIn

    let autoscroll = false;

    // Function to stop the interval when Q is pressed
    function stopFunction(event) {
        if (event.key === 'q' || event.key === 'Q') {
            window.removeEventListener('load', detectWords);
            window.removeEventListener('scroll', detectWords);
            window.removeEventListener('resize', detectWords);
            clearInterval(intervalId);
            clearInterval(updateChartIn);
            shutoff.play();
            if (autoscroll) {
                loopWithDelay(50, 1, 1);
                setTimeout(function() {
                    if (confirm("Open the chart?")) {
                        window.open(downloadChart());
                    };
                }, 700);
            };
            setTimeout(function() {
                overlay.textContent = "SCRIPT TERMINATED. F5"
                scrolling.pause();
                alright.pause();
                bad.pause();
                awful.pause();

            }, 450);

            document.removeEventListener('keydown', stopFunction);
        } else if ((event.key === 'e' || event.key === 'E') && (autoscroll === false)) {
            autoscroll = true;
            starter.play();
            scrolling.play();
            intervalId = setInterval(scroll, 1);
            updateChartIn = setInterval(updateChart, 1000);
        }
    }

    document.addEventListener('keydown', stopFunction);
})();