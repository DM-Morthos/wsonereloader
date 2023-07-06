// Variables to track active tabs and idle state
let activeTabIds = [];
let idleTimeout;
let countdownInterval;


// Function to format time in MM:SS format
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}



// Function to reload the webpage
function reloadWebpage(tabId) {
  console.log("Reloading webpage for tab ID:", tabId);
  browser.tabs.reload(tabId);
}

// Function to check idle state and reload if idle for 8 minutes
function checkIdleState() {
  browser.idle.queryState(8 * 60).then(function (state) {
    console.log("Idle state:", state);

    if (state === "idle") {
      activeTabIds.forEach(function (tabId) {
        console.log("Reloading webpage for tab ID:", tabId);
        reloadWebpage(tabId);
      });
    }
  });
}

// Function to update the popup content
function updatePopupContent() {
  const tabsInfo = document.getElementById("tabs-info");
  const countdown = document.getElementById("countdown");

  // Clear existing content
  tabsInfo.textContent = "";
  countdown.textContent = "";

  // Display tabs info
  if (activeTabIds.length > 0) {
    const tabsList = document.createElement("ul");
    tabsList.classList.add("tabs-list");

    activeTabIds.forEach(function (tabId) {
      browser.tabs.get(tabId).then(function (tab) {
        console.log("Adding tab to the list:", tab.url);
        const tabItem = document.createElement("li");
        tabItem.textContent = tab.url;
        
        if (tab.active) {
          tabItem.classList.add("active-tab");
        }

        tabsList.appendChild(tabItem);
      });
    });

    tabsInfo.appendChild(tabsList);
  } else {
    tabsInfo.textContent = "No tabs matching the criteria found";
  }

  // Start the countdown timer if a matching tab is inactive
  if (activeTabIds.length > 0 && document.visibilityState === "hidden") {
    let remainingTime = 8 * 60;
    countdown.textContent = formatTime(remainingTime);

    countdownInterval = setInterval(function () {
      remainingTime--;
      countdown.textContent = formatTime(remainingTime);

      if (remainingTime <= 0) {
        clearInterval(countdownInterval);
      }
    }, 1000);
  } else {
    // Clear the countdown timer if the conditions are not met
    clearInterval(countdownInterval);
  }
}



// Helper function to update active tab IDs
function updateActiveTabIds() {
  return browser.tabs.query({ url: "https://*.awmdm.com/*" }).then(function (tabs) {
    console.log("Tabs being considered:", tabs.map(tab => tab.url));
    activeTabIds = tabs.filter(function (tab) {
      return !tab.active;
    }).map(function (tab) {
      return tab.id;
    });
    console.log("Active tab IDs:", activeTabIds);
    updatePopupContent();
  });
}


// Event listener for extension icon click
browser.browserAction.onClicked.addListener(function () {
  console.log("Extension icon clicked");
  // Update the active tab IDs and popup content
  updateActiveTabIds()//.then(updatePopupContent);
});

// Event listener for tab activation
browser.tabs.onActivated.addListener(function (activeInfo) {
  const tabId = activeInfo.tabId;
  const tabUrl = activeInfo.url;

  if (tabUrl && tabUrl.match(/^https?:\/\/[^/]*\.awmdm\.com\//)) {
    if (!activeTabIds.includes(tabId)) {
      console.log("Tab activated:", tabUrl);
      activeTabIds.push(tabId);
    }
  }

  updatePopupContent(); // Call updatePopupContent() after tab activation
});



// Function to handle tab activation
function handleTabActivation(activeInfo) {
  const tabId = activeInfo.tabId;
  const tabUrl = activeInfo.url;

  console.log("Tab activated:", tabId, tabUrl);

  if (tabUrl && tabUrl.match(/^https?:\/\/[^/]*.awmdm\.com\//)) {
    if (!activeTabIds.includes(tabId)) {
      console.log("Tab activated:", tabUrl);
      activeTabIds.push(tabId);
    }
  }
  updatePopupContent();
}

// Function to handle tab visibility change
function handleTabVisibilityChange() {
  updatePopupContent();
}

// Event listener for tab visibility change
document.addEventListener("visibilitychange", handleTabVisibilityChange);

// Event listener for tab removal
browser.tabs.onRemoved.addListener(function (tabId) {
  const tabIndex = activeTabIds.indexOf(tabId);
  if (tabIndex > -1) {
    console.log("Tab removed:", tabId);
    activeTabIds.splice(tabIndex, 1);
    updatePopupContent();
  }
});

// Function to handle tab clicks
function handleTabClick() {
  clearInterval(countdownInterval);
  console.log("Tab clicked");
  updatePopupContent();
}

// Event listener for tab clicks
browser.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (activeTabIds.includes(tabId) && changeInfo.status === "complete") {
    console.log("Tab updated:", tabId);
    browser.tabs.executeScript(tabId, {
      code: `document.addEventListener("click", function() {
        browser.runtime.sendMessage({ type: "tabClicked" });
      });`
    });
  }
});

// Event listener for messages from content scripts
browser.runtime.onMessage.addListener(function (message) {
  if (message.type === "tabClicked") {
    console.log("Message received: tabClicked");
    handleTabClick();
  }
});


// Initialize the popup content on load
document.addEventListener("DOMContentLoaded", function () {
  console.log("Popup loaded");
  updatePopupContent();
}); 


// Call checkIdleState on initial load
console.log("Calling checkIdleState");
checkIdleState();

// Call updateActiveTabIds on initial load
console.log("Calling updateActiveTabIds");
updateActiveTabIds();