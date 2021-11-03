/*
var ua = detect.parse(navigator.userAgent);

if (ua.browser.family=='Chrome') 
    chrome.tabs.executeScript(null, {code: "var scriptOptions = {browser:'Chrome'};"}, function(){
      chrome.tabs.executeScript(null, {file: "/content_scripts/listener_ad.js"});
    }); 
else
   browser.tabs.executeScript(null, {code: "var scriptOptions = {browser:'other'};"}, function(){
    browser.tabs.executeScript(null, {file: "/content_scripts/listener_ad.js"});
  });
*/
var ua = detect.parse(navigator.userAgent);
var button = document.getElementById('but');
var bulb_img = document.getElementById('bulb');
var bulb_off = (ua.browser.family=='Chrome')? chrome.extension.getURL("popup/img/bulb.png"): browser.extension.getURL("popup/img/bulb.png");
var bulb_on = (ua.browser.family=='Chrome')? chrome.extension.getURL("popup/img/lightbulb.png"): browser.extension.getURL("popup/img/lightbulb.png");

if (ua.browser.family=='Chrome') 

    chrome.runtime.onMessage.addListener(Listener);
else
    browser.runtime.onMessage.addListener(Listener);


function Listener(request, sender, sendResponse) {

  if (request.error==true)
  {
      button.disabled = true;
      button.textContent = 'Сервер не работает';
      bulb_img.setAttribute("src", bulb_off);
  }else
  {   
      button.disabled = false;
      if (request.running==true)
      {
          button.textContent = 'Остановить';
          bulb_img.setAttribute("src", bulb_on);
      }          
      else
      {
          button.textContent = 'Запустить';
          bulb_img.setAttribute("src", bulb_off);
      }
  }        
}
if (ua.browser.family=='Chrome') 
{
  try {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
          chrome.tabs.sendMessage(tabs[0].id, {runServer: "GET_State"});
        });
  }catch (ex) {
        console.log ('ошибка запроса состояния сервера:',ex.message);
        button.disabled = true;
        button.textContent = 'Сервер не работает';
        bulb_img.setAttribute("src", bulb_off);
  }
    
}
else
{
  try {
        var gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});  

        gettingActiveTab.then((tabs) => {
          browser.tabs.sendMessage(tabs[0].id, {runServer: "GET_State"});
    });
  }catch (ex) {
        console.log ('ошибка запроса состояния сервера:',ex.message);
        button.disabled = true;
        button.textContent = 'Сервер не работает';
        bulb_img.setAttribute("src", bulb_off);
  }
  
} 

button.addEventListener("click", (e) => {
  
  if (ua.browser.family=='Chrome') 
  {
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {runServer: e.target.textContent});
      });
  }
  else
  {
      var gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});   

      gettingActiveTab.then((tabs) => { 
        browser.tabs.sendMessage(tabs[0].id, {runServer: e.target.textContent});
    });
  }                    
});