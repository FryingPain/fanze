// ==UserScript==
// @name         Parappa Google Search
// @namespace    https://www.fryingpain.com
// @homepage     https://www.fryingpain.com/userscripts/
// @version      2.1.0
// @description  Search images. now in parappa style!
// @author       FryingPain & AI :3
// @match        *://www.google.com/search*
// @grant        none
// @downloadURL  https://www.fryingpain.com/userscripts/ParappaGoogleSearch.user.js
// @updateURL    https://www.fryingpain.com/userscripts/ParappaGoogleSearch.user.js
// ==/UserScript==

/*

update: You can now fall below "awful", thus ending the round. Toggle it on line 79.

 IMPORTANT: THIS MAY NOT WORK ON CHROMIUM BASED BROWSERS!

˜”*°•.˜”*°• WELCOME •°*”˜.•°*”˜

Thanks for using my shitty ass script.
This script 'Parappaifies' the Google Search.
Search something, and the script will judge the results, in 4 categories. "COOL", "ALRIGHT", "BAD" and "AWFUL".
Totally open source, so you can edit it to your liking and fix the shitty code.


˜”*°•.˜”*°• HOW THIS WORKS •°*”˜.•°*”˜

The script gets all the titles & website names and checks if they're in the trigger list.
It'll then add 1 point or 2 points depending on how bad the word is.
It then adds both numbers to make a final score.
Depending on the final score, it's what the grading is.

<-10 : COOL
-6 - 4: ALRIGHT
4-14: BAD
14-60: AWFUL
60>: END ROUND (toggable)

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

UPDATE: STATUS 3 MEANS COOL (too lazy to change the image)

˜”*°•.˜”*°• HOW TO GET COOL •°*”˜.•°*”˜

Getting cool is similar to getting lower ranks.
However, in order for the cool points to count, the status must be at alright.
Fairly easy, just search up "cats" or "dogs". It's wholesome.

Enjoy my script!
Now i'm going to watch Murder Drones.

*/

(function() {
    'use strict';

    function random(max) {
        return Math.floor(Math.random() * max);
    }

    const detectedOverlay = false; // Set to TRUE to see an overlay of the detected words. (You can also see the words on the console.)
    const TakoyamaJumpscare = false; // Takoyama's Getting Better/Worse when changing ranks.
    const belAwful = false; // Allows falling below "awful", thus ending the run.

    /* ˜”*°•.˜”*°• TRIGGER WORDS •°*”˜.•°*”˜

    Remember. Trigger1 adds 1 point to the total score.
    Trigger2 adds 2 points to the total score.

    adorable REMOVES 1 point. This is for getting "COOL"

    Feel free to edit those at your liking :3

    Important: Words cannot have spaces. (sad.)
    */
    const Trigger1 = ['amor', 'genderswap', 'deviantart', 'furaffinity', 'affinity', 'wattpad', 'love', 'fat', 'goo', 'changed', 'suggestive', 'yaoi', 'yuri', 'lumity', 'rupphire'];
    const Trigger2 = ['7w7', '7u7', 'r63', 'chubby', 'R18', 'fluff', 'rule', 'hentai', 'nsfw', 'cheeks', 'boozy' /*Fuck you enthuziastic. */ , 'fart', 'toot', 'feet', 'foot', 'vorarephilia', 'vore', 'inflation', 'scat', 'rule34', 'paheal', 'porn', 'dick', 'cum', 'smut', '+18', 'blushmallet', 'diarrhea', 'nightcrawler', 'dakimakura', 'bodypillow', '🔞', 'digestion', 'maid', 'bunny', 'feizao', 'notive', 'explicit', 'r34', 'diaper', 'r64'];
    const adorable = ['cat', 'dog', 'kitty'];

    /*
    Song 1: Hair Scare - Parappa 2
    Song 2: Instructor Mooselini's RAP - Parappa 1
    Song 3: Chop Chop Master Onion's Rap (this one has lyrics) - Parappa 1
    Song 4: Toasty Buns - Parappa 2
	You can comment the code and make it force a song.
    */
    const song = 1 + random(4);

    // Keep these the same, unless you wanna change it's behavior...

    let stat = "alright";
    let statn = 2;
    let statbef = statn;

    let totalScore = 0;
    let ms = -1;

    let autoscroll = false;

    // The result's are ALRIGHT thing.
    const overlay = document.createElement('img');
    overlay.style.position = 'fixed';
    overlay.style.bottom = '10px';
    overlay.style.left = '10px';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    // overlay.style.color = 'white';
    overlay.style.padding = '15px';
    overlay.style.borderRadius = '5px';
    overlay.style.zIndex = '1000';
    overlay.style.width = '200px';
    // overlay.style.fontSize = '30px';
    // overlay.textContent = "The result's are ALRIGHT.";

    const topbad = document.createElement('div');
    topbad.style.position = 'fixed';
    topbad.style.top = '50px';
    topbad.style.right = '10px';
    topbad.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    topbad.style.color = 'white';
    topbad.style.padding = '5px';
    topbad.style.borderRadius = '5px';
    topbad.style.zIndex = '1000';
    topbad.style.fontSize = '25px';

    const topawful = document.createElement('div');
    topawful.style.position = 'fixed';
    topawful.style.top = '100px';
    topawful.style.right = '10px';
    topawful.style.backgroundColor = 'rgba(150, 0, 0, 0.7)';
    topawful.style.color = 'white';
    topawful.style.padding = '15px';
    topawful.style.borderRadius = '5px';
    topawful.style.zIndex = '1000';
    topawful.style.fontSize = '25px';

    const thumb = document.createElement('img');
    thumb.style.position = 'fixed';
    thumb.style.bottom = '250px';
    thumb.style.left = '15px';
    thumb.style.width = '70px';
    thumb.src = ''

    // Needed to repeat this because of stupid preloading shit. Takes forever to load the videos when displayed.
    // Hope there is a better way, if find one, i'll fix it.

    const gettbv = document.createElement('video');
    gettbv.style.position = 'fixed';
    gettbv.style.top = '0px';
    gettbv.style.left = '0px';
    gettbv.style.width = '100%';
    gettbv.style.height = '100%';
    gettbv.src = 'https://www.fryingpain.com/assets/parappa/gettingBetter.mp4'

    const gettwv = document.createElement('video');
    gettwv.style.position = 'fixed';
    gettwv.style.top = '0px';
    gettwv.style.left = '0px';
    gettwv.style.width = '100%';
    gettwv.style.height = '100%';
    gettwv.src = 'https://www.fryingpain.com/assets/parappa/gettingWorse.mp4'

    const thatwasBAD = document.createElement('video');
    thatwasBAD.style.position = 'fixed';
    thatwasBAD.style.top = '0px';
    thatwasBAD.style.left = '0px';
    thatwasBAD.style.width = '100%';
    thatwasBAD.style.height = '100%';
    thatwasBAD.src = 'https://www.fryingpain.com/assets/parappa/death.mp4'

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

    const cool = document.createElement('audio');
    cool.src = 'https://www.fryingpain.com/assets/parappa/' + song + '/cool.mp3';
    // alright.src = 'http://localhost:8000/alright.wav';
    cool.loop = true;


    const alright = document.createElement('audio');
    alright.src = 'https://www.fryingpain.com/assets/parappa/' + song + '/alright.mp3';
    // alright.src = 'http://localhost:8000/alright.wav';
    alright.loop = true;

    const bad = document.createElement('audio');
    bad.src = 'https://www.fryingpain.com/assets/parappa/' + song + '/bad.mp3';
    // bad.src = 'http://localhost:8000/bad.wav';
    bad.loop = true;

    const awful = document.createElement('audio');
    awful.src = 'https://www.fryingpain.com/assets/parappa/' + song + '/awful.mp3';
    // awful.src = 'http://localhost:8000/awful.wav';
    awful.loop = true;

    const offset = 15;

    cool.currentTime = offset;
    alright.currentTime = offset;
    bad.currentTime = offset;
    awful.currentTime = offset;

    const vars = {
        cool: cool,
        alright: alright,
        bad: bad,
        awful: awful
    };

    document.body.appendChild(overlay);
    document.body.appendChild(thumb);

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
        cool.play();
        alright.play();
        bad.play();
        awful.play();
        cool.volume = 0;
        alright.volume = 0;
        bad.volume = 0;
        awful.volume = 0;
        // vars[stat].volume = 0.5;

        // bad.currentTime = alright.currentTime;
        // awful.currentTime = alright.currentTime;

        if (newValue === statn) {
            return;
        }

        statbef = statn;
        statn = newValue;

        if (statn > statbef) {
            increase.currentTime = 0;
            increase.play();
            thumb.src = 'https://www.fryingpain.com/assets/parappa/thumbup.gif';
        } else {
            decrease.currentTime = 0;
            decrease.play();
            thumb.src = 'https://www.fryingpain.com/assets/parappa/thumbdown.gif';
        }

        if (TakoyamaJumpscare){
            if (statn > statbef) {
                document.body.appendChild(gettbv);
                gettbv.currentTime = 0;
                gettbv.play();
            } else {
                document.body.appendChild(gettwv);
                gettwv.currentTime = 0;
                gettwv.play();
            }
            if (autoscroll) {
                clearInterval(intervalId);
                clearInterval(updateChartIn);
            }
            setTimeout(function() {
                if (statn > statbef) { // This sucks but idc as long as it works
                    document.body.removeChild(gettbv);
                } else {
                    document.body.removeChild(gettwv);
                }
                vars[stat].volume = 0.5;
                if (autoscroll) {
                    updateChartIn = setInterval(updateChart, 1000);
                    intervalId = setInterval(scroll, 1);
                }
            }, 2300);
        } else {
            vars[stat].volume = 0.5;
        }

        setTimeout(function() {
            thumb.src = '';
        }, 750);
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
        let score3 = 0;
        let detect1 = [];
        let detect2 = [];
        let detect3 = [];
        words.forEach(word => {
            if (Trigger1.includes(word.toLowerCase())) {
                score1++;
                detect1.push(word.toLowerCase());
            }
            if (Trigger2.includes(word.toLowerCase())) {
                score2 += 2;
                detect2.push(word.toLowerCase());
            }
            if (adorable.includes(word.toLowerCase())) {
                score3 += 1;
                detect3.push(word.toLowerCase());
            }
        });

        totalScore = score1 + score2;

        if (totalScore <= 4) {
            totalScore = totalScore - score3;
        }
        console.log(detect1);
        console.log(detect2);
        topbad.textContent = detect1;
        topawful.textContent = detect2;
        console.log(totalScore);
        if (totalScore > 60 && belAwful) {
            if (stat !== "off") {
                stat = "off";
                document.body.appendChild(thatwasBAD);
                thatwasBAD.currentTime = 0;
                thatwasBAD.play();
                stopthething(11000);
                setTimeout(function() {
                    if (confirm("TRY AGAIN?")) {
                        location.reload();
                    }
                },11100)
            } else if (ms === 0) {
                dbad.play();
            } else if (ms === 1) {
                dgood.play();
            }
            ms = -1;
        } else if (totalScore > 50 && belAwful) {
            if (stat === "awful") {
                if (ms !== 1) {
                    ms = 1;
                    dbad.play();
                }
            }
        } else if (totalScore > 14) {
            // overlay.textContent = "The result's are AWFUL."
            if (stat !== "awful") {
                stat = "awful";
                mus(0);
            } else if (ms === 0) {
                dbad.play();
            } else if (ms === 1) {
                dgood.play();
            }
            ms = -1;
        } else if (totalScore > 10) {
            if (stat === "bad") {
                // overlay.textContent = "The result's are BAD | ▼"
                if (ms !== 1) {
                    ms = 1;
                    dbad.play();
                }
            } else {
                // overlay.textContent = "The result's are AWFUL | ▲"
                if (ms !== 0) {
                    ms = 0;
                    dgood.play();
                }
            }

        } else if (totalScore > 6) {
            // overlay.textContent = "The result's are BAD."
            if (stat !== "bad") {
                stat = "bad";
                mus(1);
            } else if (ms === 0) {
                dbad.play();
            } else if (ms === 1) {
                dgood.play();
            }
            ms = -1;
        } else if (totalScore > 4) {
            if (stat === "alright") {
                // overlay.textContent = "The result's are ALRIGHT | ▼"
                if (ms !== 1) {
                    ms = 1;
                    dbad.play();
                }
            } else {
                // overlay.textContent = "The result's are BAD | ▲"
                if (ms !== 0) {
                    ms = 0;
                    dgood.play();
                }
            }
        } else if (totalScore > -6) {
            // overlay.textContent = "The result's are ALRIGHT."
            if (stat !== "alright") {
                stat = "alright";
                mus(2);
            } else if (ms === 0) {
                dbad.play();
            } else if (ms === 1) {
                dgood.play();
            }
            ms = -1;
        } else if (totalScore > -10) {
            if (stat === "cool") {
                if (ms !== 1) {
                    ms = 1;
                    dbad.play();
                }
            } else {
                if (ms !== 0) {
                    ms = 0;
                    dgood.play();
                }
            }
        } else {
            if (stat !== "cool") {
                stat = "cool";
                mus(3);
            } else if (ms === 0) {
                dbad.play();
            } else if (ms === 1) {
                dgood.play();
            }
            ms = -1;
        }
        let urlsito = 'https://www.fryingpain.com/assets/parappa/grade/' + stat + (ms + 1) + '.gif';
        if (urlsito !== overlay.src) {
            overlay.src = urlsito;
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
                                max: 3,
                                stepSize: 1,
                                callback: function(value, index, values) {
                                    return ['AWFUL', 'BAD', 'ALRIGHT','COOL'][value]; // this doesn't work at all lmao
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

    function stopthething(messdelay) {
        window.removeEventListener('load', detectWords);
            window.removeEventListener('scroll', detectWords);
            window.removeEventListener('resize', detectWords);
            clearInterval(intervalId);
            clearInterval(updateChartIn);
            overlay.src = 'https://www.fryingpain.com/assets/parappa/grade/off0.gif';
            shutoff.play();
            if (autoscroll) {
                loopWithDelay(50, 1, 1);
                setTimeout(function() {
                    if (confirm("Open the chart?")) {
                        window.open(downloadChart());
                    };
                }, messdelay);
            };
            setTimeout(function() {
                // overlay.textContent = "SCRIPT TERMINATED. F5"
                scrolling.pause();
                cool.pause();
                alright.pause();
                bad.pause();
                awful.pause();

            }, 450);

            document.removeEventListener('keydown', stopFunction);
    }
    // Function to stop the interval when Q is pressed
    function stopFunction(event) {
        if (event.key === 'q' || event.key === 'Q') {
            stopthething(700);
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