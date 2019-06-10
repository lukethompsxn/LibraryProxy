'use strict';

var base = "https://";
var proxy = ".ezproxy.auckland.ac.nz";
chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
      return {redirectUrl:  base + details.url.match(/^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/?\n]+)/)[1].replace(/\./g, "-") + proxy + details.url.match(/^https?:\/\/[^\/]+([\S\s]*)/)[1]};
    },
    {
      urls: chrome.storage.sync({databases: dbs}, function() {
        return {url: dbs}
      }),
      types: ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
    },
    ["blocking"]
);