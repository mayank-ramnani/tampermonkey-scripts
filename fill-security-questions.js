// ==UserScript==
// @name         fill-security-questions
// @namespace    http://tampermonkey.net/
// @version      2025-02-13
// @description  try to take over the world!
// @author       Mayank Ramnani
// @match        https://atlasauth.b2clogin.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=b2clogin.com
// @grant        none
// ==/UserScript==

function fillFields() {
    const answers = {
        "kba1_response": "answer1", // kba1 will always be the same question
        "kba2_response": "answer2",
        "kba3_response": "answer3"
    };

    let filled = false;
    Object.entries(answers).forEach(([id, value]) => {
        let field = document.getElementById(id);
        if (field) {
            field.value = value;
            filled = true;
        }
    });
    if (!filled) {
        setTimeout(fillFields, 1000); // try again after 1000ms
    }
    else {
        let button = document.getElementById("continue");
        if (button) {
            button.click();
            console.log("done!");
        } else {
            console.log("button not found");
        }
    }
}

(function() {
    'use strict';
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", fillFields);
    } else {
        fillFields();
    }
})();
