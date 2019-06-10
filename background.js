'use strict';

let base = "https://";
let proxy = ".ezproxy.auckland.ac.nz";
let databases = ["*://ieeexplore.ieee.org/*"];

chrome.storage.sync.get("databases", function(result) {
   databases.push(result.databases);
});

chrome.storage.onChanged.addListener(function() {
    console.log("hehe");
});

chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
      return {redirectUrl:  base + details.url.match(/^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/?\n]+)/)[1].replace(/\./g, "-") + proxy + details.url.match(/^https?:\/\/[^\/]+([\S\s]*)/)[1]};
    },
    {
      urls: databases,
      types: ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
    },
    ["blocking"]
);
