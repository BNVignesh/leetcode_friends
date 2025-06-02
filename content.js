

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "scrapeLeetCode") {
        const maxwait = 5000
        const start = Date.now()
        
        const interval = setInterval(() => {
            const totalElem = document.querySelector('span[class*="text-[30px"]');
            const ratingElem = document.querySelector('div[class *= "text-label-1 dark:text-dark-label-1 flex items-center text-2xl"]');

            const totalText = totalElem?.textContent.trim() || "-";
            const ratingText = ratingElem?.textContent.trim() || "-";

            
            if (totalText && totalText !== "-" && ratingText && ratingText !== '-') {
                clearInterval(interval);
                sendResponse([totalText, ratingText]);
            }else if (Date.now() - start >= maxwait){
                clearInterval(interval)
                sendResponse([totalText, '-'])
            }
        }, 500);

        
        return true;
    }
});
