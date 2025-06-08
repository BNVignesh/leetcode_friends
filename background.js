const inputbox = document.getElementById('userID')
const addbutton = document.getElementById('addfriend')
const body = document.getElementById('info')

const friends = []

const savedfriends = JSON.parse(localStorage.getItem('friends') || "[]")


savedfriends.forEach(async (name) => {

    const tab = await chrome.tabs.create({
        url : `https://leetcode.com/u/${name}`,
        active : false
    })

    await new Promise(resolve => setTimeout(resolve, 2000))

    await chrome.tabs.executeScript({
        target : {tabId : tab.id}, 
        files : ['content.js']
    })

    chrome.tabs.sendMessage(tab.id, {action : "scrapeLeetCode"}, (response) => {
        if(!response || response.error){
            body.innerHTML += `Failed to fetch ${name}'s data`
            return
        }

        
        const [total, rating] = response
        
        if (total === '-' && rating == '-' ){
            return
        }
        
        friends.push(name)

        const temp = document.createElement('div')
        temp.className = 'friend info'

        const id = document.createElement('div')
        id.textContent = name
        id.className = 'f name'
        temp.append(id)

        const tot = document.createElement('div')
        tot.textContent = total
        tot.className = 'f total'
        temp.append(tot)

        const rate = document.createElement('div')
        rate.textContent = rating
        rate.className = 'f rating'
        temp.append(rate)

        body.append(temp)
        
        chrome.tabs.remove(tab.id)

        
    })
})

addbutton.addEventListener('click', async () => {
    const name = inputbox.value
    if (friends.includes(name)){
        return
    }
    
    
    
    const tab = await chrome.tabs.create({
        url : `https://leetcode.com/u/${name}`,
        active : false
    })
    
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    await chrome.tabs.executeScript({
        target : {tabId : tab.id},
        files : ['content.js']
    })
    
    chrome.tabs.sendMessage(tab.id, {action : "scrapeLeetCode"}, (response) => {
        if(!response || response.error){
            body.innerHTML += `Failed to fetch ${name}'s data`
            return
        }
        
        
        const [total, rating] = response
        
        if (total === '-' && rating == '-' ){
            return
        }
        
        friends.push(name)
        
        localStorage.setItem('friends', JSON.stringify(friends))

        const temp = document.createElement('div')
        temp.className = 'friend info'

        const id = document.createElement('div')
        id.textContent = name
        id.className = 'f name'
        temp.append(id)

        const tot = document.createElement('div')
        tot.textContent = total
        tot.className = 'f total'
        temp.append(tot)

        const rate = document.createElement('div')
        rate.textContent = rating
        rate.className = 'f rating'
        temp.append(rate)
        
        body.append(temp)

        chrome.tabs.remove(tab.id)
        
        inputbox.value = ''
    })
})

