const pre = "*://";
const post = "/*";
const add = "Add to LibProxy";
const remove = "Remove from LibProxy";

chrome.storage.sync.get("databases", function (result) {
    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
        let domain = pre + tabs[0].url.match(/^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/?\n]+)/)[1] + post;
        let unproxyDomain = convertProxyToDomain(domain);
        console.log(unproxyDomain);
        let dbList = result.databases;
        if (dbList && (dbList.includes(domain) || dbList.includes(unproxyDomain))) {
            setForRemove(dbList, domain);
        } else {
            setForAdd(dbList, domain);
        }
    });
});

function setForAdd(dbList, domain) {
    let button = document.getElementById("add-remove");
    button.innerText = add;
    button.onclick = function () {
        if (dbList === undefined) {
            dbList = [];
        }

        dbList.push(domain);
        chrome.storage.sync.set({"databases": dbList}, function () {
            console.log("Successfully added: " + domain);
            document.getElementById("add-remove").innerText = remove;
            triggerBackground();
            setForRemove(dbList, domain)
        });
    }
}

function setForRemove(dbList, domain) {
    let button = document.getElementById("add-remove");
    button.innerText = remove;
    button.onclick = function () {
        dbList[domain] = undefined;
        chrome.storage.sync.set({"databases": dbList}, function () {
            console.log("Successfully removed: " + domain);
            document.getElementById("add-remove").innerText = add;
            triggerBackground();
            setForAdd(dbList, domain);
        });
    }

}

document.getElementById("poll").onclick = function() {
    chrome.storage.sync.get("databases", function (result) {
        console.log(result.databases);
    });
};

function triggerBackground() {
    chrome.runtime.getBackgroundPage(function(bg) {
        bg.updateDatabases();

        chrome.tabs.getSelected(null, function(tab) {
            var code = 'window.location.reload();';
            chrome.tabs.executeScript(tab.id, {code: code});
        });
    });
}

function convertProxyToDomain(proxyDomain) {
    return proxyDomain.replace(".ezproxy.auckland.ac.nz", "").replace(/-/g, ".");
}