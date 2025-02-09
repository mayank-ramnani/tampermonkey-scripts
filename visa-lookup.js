// ==UserScript==
// @name         visa-lookup
// @namespace    http://tampermonkey.net/
// @version      2025-02-08
// @description  Print available dates in a new HTML element on the page
//                  instead of having to scroll through calendar pages to see them
// @author       Mayank Ramnani
// @match        https://www.usvisascheduling.com/en-US/ofc-schedule/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=b2clogin.com
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", runScript);
    } else {
        runScript();
    }

    function runScript() {
        console.log("Script ran on full page load!");

        const originalAjax = $.ajax;

        $.ajax = function (settings) {
            if (settings.url.includes("schedule-group/get-family-ofc-schedule")) {
                const originalSuccess = settings.success;

                settings.success = function (data, textStatus, jqXHR) {
                    if (data?.ScheduleDays) {
                        const dates = data.ScheduleDays.map(day => day.Date);

                        // create or update the container in <main>
                        let container = document.getElementById("schedule-dates-container");
                        if (!container) {
                            container = document.createElement("div");
                            container.id = "schedule-dates-container";
                            container.style.padding = "10px";
                            container.style.border = "1px solid #ccc";
                            container.style.marginTop = "10px";
                            container.style.backgroundColor = "#f9f9f9";
                            document.querySelector("main")?.appendChild(container);
                        }

                        // update content
                        container.innerHTML = `<h3>Available Dates:</h3><ul>${dates.map(date => `<li>${date}</li>`).join("")}</ul>`;
                    }

                    if (originalSuccess) {
                        originalSuccess(data, textStatus, jqXHR);
                    }
                };
            }

            return originalAjax.apply(this, arguments);
        };
    }
})();
