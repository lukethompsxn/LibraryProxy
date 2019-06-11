'use strict';

let base = "https://";
let proxy = ".ezproxy.auckland.ac.nz";

chrome.storage.sync.get("databases", function (result) {
    let databases = ["*://ieeexplore.ieee.org/*"];

    if (result.databases !== undefined && result.databases.length !== 0) {
        databases = result.databases;
    } else {
        databases = ["*://ieeexplore.ieee.org/*"];
    }
    addToFilter(databases);
});

function addToFilter(dbs) {
    chrome.webRequest.onBeforeRequest.addListener(
        function(details) {
            return {redirectUrl:  base + details.url.match(/^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/?\n]+)/)[1].replace(/\./g, "-") + proxy + details.url.match(/^https?:\/\/[^\/]+([\S\s]*)/)[1]};
        },
        {
            urls: dbs,
            types: ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
        },
        ["blocking"]
    );
}

function reload() {
    chrome.runtime.reload();
}
