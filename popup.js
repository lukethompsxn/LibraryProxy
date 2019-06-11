const pre = "*://";
const post = "/*";
const add = "Add to Proxy";
const remove = "Remove from Proxy";

chrome.storage.sync.get("databases", function (result) {
    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
        let domain = pre + tabs[0].url.match(/^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/?\n]+)/)[1] + post;
        let unproxyDomain = convertProxyToDomain(domain);
        console.log(unproxyDomain);
        let dbList = result.databases;
        if (dbList && (dbList.includes(domain) || dbList.includes(unproxyDomain))) {
            setForRemove(dbList, unproxyDomain);
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
            addDomain(domain);
            setForRemove(dbList, domain)
        });
    }
}

function setForRemove(dbList, domain) {
    let button = document.getElementById("add-remove");
    button.innerText = remove;
    button.onclick = function () {
        let index = dbList.indexOf(domain);
        if (index === 0) {
            dbList.shift();
        } else {
            dbList.splice(index, index);
        }

        chrome.storage.sync.set({"databases": dbList}, function () {
            console.log("Successfully removed: " + domain);
            document.getElementById("add-remove").innerText = add;
            reloadExtension();
        });
    }

}

function addDomain(domain) {
    let domains = [domain];
    chrome.runtime.getBackgroundPage(function(bg) {
        bg.addToFilter(domains);

        chrome.tabs.getSelected(null, function(tab) {
            var code = 'window.location.reload();';
            chrome.tabs.executeScript(tab.id, {code: code});
        });
    });
}

function reloadExtension() {
    chrome.runtime.getBackgroundPage(function(bg) {
        bg.reload();
    });
}

function convertProxyToDomain(proxyDomain) {
    return proxyDomain.replace(".ezproxy.auckland.ac.nz", "").replace(/-/g, ".");
}