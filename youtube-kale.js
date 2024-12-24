// ==UserScript==
// @name         YouTube Video Length Filter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hide YouTube videos shorter than a specified duration on the home page, Hide YT Shorts
// @author       George Mack / Mayank Ramnani
// @match        https://www.youtube.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Minimum video length in minutes
    const MIN_LENGTH = 20;

    // Function to convert YouTube time string (e.g., "5:34") to minutes
    function timeStringToMinutes(timeString) {
        const parts = timeString.split(":").map(Number);
        if (parts.length === 2) {
            return parts[0] + parts[1] / 60; // mm:ss
        } else if (parts.length === 3) {
            return parts[0] * 60 + parts[1] + parts[2] / 60; // hh:mm:ss
        }
        return 0;
    }

    // Function to filter videos by length
    function filterVideos() {
        const videoElements = document.querySelectorAll("ytd-rich-item-renderer");

        videoElements.forEach(video => {
            const timeElement = video.querySelector("ytd-thumbnail-overlay-time-status-renderer span");

            if (timeElement) {
                const timeText = timeElement.textContent.trim();
                const videoLength = timeStringToMinutes(timeText);

                if (videoLength < MIN_LENGTH) {
                    video.style.display = "none";
                }
            }
        });
    }

    // Function to filter videos by length
    function hideShorts() {
        const shortsSections = document.querySelectorAll("ytd-rich-section-renderer");
        shortsSections.forEach(section => {
            if (section.textContent.includes('Shorts')) {
                section.style.display = 'none';
            }
        });
    }

    // Observe changes to the YouTube home feed to continuously filter videos
    const observer = new MutationObserver(() => {
        filterVideos();
        hideShorts()
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Initial filter when the script loads
    filterVideos();
    hideShorts()
})();
