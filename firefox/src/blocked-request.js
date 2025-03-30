"use strict";

const listBlockedBtn = document.querySelector("#list-blocked");
const closeTabBtn = document.querySelector("#close-tab");
const fillBlockedUrls = document.querySelector("#fill-blocked-urls");

const closeTab = () => window.close();
closeTabBtn.addEventListener("click", closeTab);

const hidePwInfo = () => {
    listBlockedBtn.hidden = false;
    fillBlockedUrls.innerHTML = "";
    listBlockedBtn.focus();
};

const dGsFill = (gs) => {
    fillBlockedUrls.innerHTML = "";
    const gsLength = gs.length;
    if (gsLength === 0) {
        fillBlockedUrls.textContent = "Nothing to show. Block list is empty";
        return;
    }

    for (let i = 0; i < gsLength; i++) {
        const blockedURL = document.createElement("div");
        blockedURL.textContent = gs[i];

        const removeButton       = document.createElement("button");
        removeButton.id          = `removeEntry-${i}`;
        removeButton.className   = "remove-entry";
        removeButton.title       = `Remove '${gs[i]}' from block list`;
        removeButton.textContent = "Remove";

        fillBlockedUrls.appendChild(blockedURL);
        fillBlockedUrls.appendChild(removeButton);
    }
};

const revealBlockedList = async () => {
    if (confirm("Confirm to show the block list.")) {
        listBlockedBtn.hidden = true;
        fillBlockedUrls.innerHTML = "";
        browser.storage.local.get("gs").then((result) => {
                const gesperrtSeiten = result.gs || [];
                dGsFill(gesperrtSeiten);
            })
            .catch((err) => {
                console.error("you're not supposed to be here yet.. ERROR:", err);
            });
        return;
    } else {
        return;
    }
};
listBlockedBtn.addEventListener("click", revealBlockedList);

const removeEntry = async (event) => {
    if (event.target.classList.contains("remove-entry") && confirm("Confirm to remove this entry from list.")) {
        const removeId = event.target.id.split("-")[1];

        let gsResult = await browser.storage.local.get("gs");
        let editGs = gsResult.gs;
        editGs.splice(removeId, 1);

        await browser.storage.local.set({
            gs: editGs,
        });
        gsResult = await browser.storage.local.get("gs");
        dGsFill(gsResult.gs);

        const removeButtons = document.querySelectorAll(".remove-entry");
        removeButtons.forEach((removeButton) => (removeButton.disabled = true));
        setTimeout(() => {
            hidePwInfo();
        }, 3000);
    }
};
fillBlockedUrls.addEventListener("click", removeEntry);
