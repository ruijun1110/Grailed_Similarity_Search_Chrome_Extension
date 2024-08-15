// content.js
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "scrapeContent") {
        // Scrape the product image URL
        const imageElement = document.querySelector('img.Photo_picture__g7Lsj.Image_fill__QTtNL.Image_clip__bU5A3.Image_center__CG78h');
        let imageUrl = '';
        if (imageElement && imageElement.srcset) {
            imageUrl = imageElement.srcset.split(',')[0].split(' ')[0];
        }

        // Scrape the product name
        const nameElement = document.querySelector('h1.Body_body__dIg1V.Text.Details_title__PpX5v');
        const name = nameElement ? nameElement.textContent.trim() : '';

        const breadcrumbElements = document.querySelectorAll('.Link_link__2eb5_.Link_underline__PF2Dz.Breadcrumbs_link__q_nNg');
        let category = '';
        if (breadcrumbElements.length >= 4) {
            const fourthElement = breadcrumbElements[3];
            const textContent = fourthElement.textContent;
            const parts = textContent.split('-->');
            category = parts[parts.length - 1].trim();
        }
        console.log(category);

        // Only send response if at least one of imageUrl or name is found
        if (imageUrl || name) {
            sendResponse({ imageUrl: imageUrl, name: name });
        } else {
            sendResponse(null);
        }
    }
    return true; // Indicates that sendResponse will be called asynchronously
});