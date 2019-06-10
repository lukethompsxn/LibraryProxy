const pre = "*://";
const post = "/*";
const add = "Add to LibProxy";
const remove = "Remove from LibProxy";

chrome.storage.sync.get("databases", function (result) {
    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
        let domain = pre + tabs[0].url.match(/^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/?\n]+)/)[1] + post;
        let dbList = result.databases;
        if (dbList && dbList.includes(domain)) {
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
            console.log("made new set");
            console.log("domain" + domain);
        }
        dbList.push(domain);
        console.log("here: " + dbList[domain]);
        chrome.storage.sync.set({"databases": dbList}, function () {
            console.log("Successfully added: " + domain);
            document.getElementById("add-remove").innerText = remove;
            setForRemove(dbList, domain)
        });

        chrome.storage.sync.set({"dogs": dbList}, function () {
            console.log("Successfully added: " + domain);
            document.getElementById("add-remove").innerText = remove;
            setForRemove(dbList, domain)
        });
    }
}

function setForRemove(dbList, domain) {
    let button = document.getElementById("add-remove");
    button.innerText = remove;
    button.onclick = function () {
        console.log("domain" + domain);
        dbList[domain] = undefined;
        console.log("list" + dbList);
        chrome.storage.sync.set({"databases": dbList}, function () {
            console.log("Successfully removed: " + domain);
            document.getElementById("add-remove").innerText = add;
            setForAdd(dbList, domain);
        });
    }

}

document.getElementById("poll").onclick = function() {
    chrome.storage.sync.get("databases", function (result) {
        console.log(result.databases);
    });
};