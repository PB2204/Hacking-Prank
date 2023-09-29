(function (global, factory) {
    if (typeof exports === 'object' && typeof module !== 'undefined') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else {
        global.Scrambler = factory();
    }
}(self, function () {
    'use strict';

    var Scrambler = (() => {
        class Scrambler {
            static get CHARACTERS() {
                return {
                    DEFAULT: ["@", "#", "$", "%", "?", "&", "*", "▓", "+", "_"],
                    ALPHABET: ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
                };
            }

            constructor() {
                this.characters = [...Scrambler.CHARACTERS.DEFAULT];
                this.maxCounter = 12;
                this.targetText = "";
                this.scrambledText = "";
                this.encodingCounters = [];
                this.decodingCounters = [];
                this.onScramble = null;
                this.frameId = null;
                this.frameIndex = 0;
            }

            scramble(targetText, onScramble, options = null) {
                this.characters = options?.characters ? [...options.characters] : [...Scrambler.CHARACTERS.DEFAULT];
                this.targetText = targetText;
                this.encodingCounters = this._generateCounters(this.scrambledText);
                this.decodingCounters = this._generateCounters(this.targetText);
                this.onScramble = onScramble;
                this.frameId = null;
                this.frameIndex = 0;
                this.frameId = requestAnimationFrame(() => this._encode());
            }

            _randomText(length) {
                let result = "";
                for (let i = 0; i < length; i += 1) {
                    result += this.characters[Math.floor(Math.random() * this.characters.length)];
                }
                return result;
            }

            _generateCounters(text) {
                return new Array(text.length).fill(0).map(() => Math.floor(Math.random() * this.maxCounter) + 1);
            }

            _encode() {
                if (this.frameIndex === 0) {
                    if (this.encodingCounters.reduce((total, counter) => total + counter, 0) === 0) {
                        return void (this.frameId = requestAnimationFrame(() => this._fill()));
                    }
                    for (let i = 0; i < this.encodingCounters.length; i += 1) {
                        if (this.encodingCounters[i] !== 0) {
                            this.encodingCounters[i] -= 1;
                            this.onScramble(this.scrambledText);
                        } else {
                            const temp = this.scrambledText.split("");
                            temp[i] = this._randomText(1);
                            this.scrambledText = temp.join("");
                        }
                    }
                }
                this.frameIndex = (this.frameIndex + 1) % 3;
                this.frameId = requestAnimationFrame(() => this._encode());
            }

            _fill() {
                if (this.frameIndex === 0) {
                    if (this.scrambledText.length === this.targetText.length) {
                        return void (this.frameId = requestAnimationFrame(() => this._decode()));
                    }
                    const diff = this.scrambledText.length < this.targetText.length ? 1 : -1;
                    this.scrambledText = this._randomText(this.scrambledText.length + diff);
                    this.onScramble(this.scrambledText);
                }
                this.frameIndex = (this.frameIndex + 1) % 2;
                this.frameId = requestAnimationFrame(() => this._fill());
            }

            _decode() {
                if (this.scrambledText === this.targetText) {
                    cancelAnimationFrame(this.frameId);
                } else {
                    if (this.frameIndex === 0) {
                        let temp = "";
                        for (let i = 0; i < this.decodingCounters.length; i += 1) {
                            if (this.decodingCounters[i] !== 0) {
                                temp += this.characters[Math.floor(Math.random() * this.characters.length)];
                                this.decodingCounters[i] -= 1;
                            } else {
                                temp += this.targetText[i];
                            }
                        }
                        this.scrambledText = temp;
                        this.onScramble(this.scrambledText);
                    }
                    this.frameIndex = (this.frameIndex + 1) % 4;
                    this.frameId = requestAnimationFrame(() => this._decode());
                }
            }
        }

        return Scrambler;
    })();

    return Scrambler;
}));

const texts = [
    "Sorry for the inconvenience",
    "Don't worry, you can fix this ;)",
    "Pay the ransom",
    "Follow the instructions below.",
    "Pay before the timer expires!"
];

texts[0] = document.getElementById("t0").innerHTML;
texts[1] = document.getElementById("t1").innerHTML;
texts[2] = document.getElementById("t2").innerHTML;
texts[3] = document.getElementById("t3").innerHTML;
texts[4] = document.getElementById("t4").innerHTML;

const scrambler = new Scrambler();

function handleScramble(text) {
    document.getElementById("scrambleText").innerHTML = text;
}

let i = 0;

function printText() {
    const text = texts[i % texts.length];
    i++;

    if (i % 3 === 2) {
        scrambler.scramble(text, handleScramble, {
            characters: Scrambler.CHARACTERS.ALPHABET
        });
    } else {
        scrambler.scramble(text, handleScramble);
    }

    setTimeout(printText, 5000);
}

setTimeout(() => {
    printText();
}, 3000);

const countDownDate = new Date().getTime() + 86400000 + 1210000;
let price = 10000;

console.log(countDownDate);

const x = setInterval(() => {
    const now = new Date().getTime();
    const timeLeft = countDownDate - now;
    const days = Math.floor(timeLeft / 86400000);
    const hours = Math.floor((timeLeft % 86400000) / 3600000);
    const minutes = Math.floor((timeLeft % 3600000) / 60000);
    const seconds = Math.floor((timeLeft % 60000) / 1000);

    if (seconds < 10) {
        seconds = "0" + seconds;
    }

    if (minutes < 10) {
        minutes = "0" + minutes;
    }

    document.getElementById("countdown").innerHTML = `<span id='minutes'>${minutes}</span>:<span>${seconds}</span>`;

    if (timeLeft < 0) {
        clearInterval(x);
        document.getElementById("countdown").innerHTML = "EXPIRED";
    }

    price += 123.99;
    document.getElementById("price").innerHTML = "$" + price.toFixed(2);
}, 200);

const introbox = document.getElementById("intro");
const btn = document.getElementById("btn");

btn.addEventListener("click", () => {
    introbox.style.display = "none";
});

const close = document.getElementById("close");

close.addEventListener("click", () => {
    introbox.style.display = "none";
});


// Full Screen View

function goFullScreen() {
    const element = document.documentElement;
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
}

function protectPayButton(event) {
    // Prevent the click event from propagating further to the body onclick event
    event.stopPropagation();
}