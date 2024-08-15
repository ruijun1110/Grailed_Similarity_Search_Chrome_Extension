// Function to get the current tab
function getCurrentTab(callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        callback(tabs[0]);
    });
}

// Function to scrape content from the current page
function scrapeContent(callback) {
    getCurrentTab(function (tab) {
        chrome.tabs.sendMessage(tab.id, { action: "scrapeContent" }, function (response) {
            if (chrome.runtime.lastError) {
                console.error('Error: ', JSON.stringify(chrome.runtime.lastError));
                callback(null);
            } else {
                callback(response);
            }
        });
    });
}

// Function to update the popup with scraped content
function updatePopup(content) {
    if (content && content.imageUrl) {
        document.getElementById('productImage').src = content.imageUrl;
        document.getElementById('productImage').style.display = 'block';
    } else {
        document.getElementById('productImage').style.display = 'none';
    }

    if (content && content.name) {
        document.getElementById('productName').textContent = content.name;
    } else {
        document.getElementById('productName').textContent = 'Product information not found';
    }

    if (!content) {
        document.getElementById('content').innerHTML = '<p>Unable to retrieve product information. Make sure you are on a Grailed product page.</p>';
        document.getElementById('content').style.border = 'none';
        document.getElementById('findSimilarBtn').disabled = 'true';
        document.getElementById('findSimilarBtn').style.backgroundColor = 'darkgray';
    }
}

function findSimilarItems() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "scrapeContent" }, function (response) {
            if (response && response.imageUrl && response.name) {
                // Immediately open a new tab with the Next.js search results page
                const nextjsUrl = 'http://localhost:3001'; // Update this with your actual Next.js app URL
                const queryParams = new URLSearchParams({
                    imageUrl: response.imageUrl,
                    name: response.name
                }).toString();
                chrome.tabs.create({ url: `${nextjsUrl}?${queryParams}` });
            } else {
                console.error('Failed to get image URL or item name');
            }
        });
    });
}

// // Add event listener for the "Find Similar" button
// document.getElementById('findSimilarBtn').addEventListener('click', findSimilarItems);

// Scrape content when the popup is opened
document.addEventListener('DOMContentLoaded', function () {
    scrapeContent(function (content) {
        updatePopup(content);
    });

    document.getElementById('findSimilarBtn').addEventListener('click', findSimilarItems);
});