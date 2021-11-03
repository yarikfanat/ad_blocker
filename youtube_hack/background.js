
//var resource = document.URL;
var pattern = "<all_urls>";
var h,m,s,d;
var prefix = null;
var sufix = null;

var ua = detect.parse(navigator.userAgent);

function handleActivated(activeInfo) {
 chrome.tabs.query({active: true,currentWindow: true}, (tabs) => {
    var tab = tabs[0];
 //   resource = tab.url;
  });
}

function logError(responseDetails) {
  console.log("Url block-> ",responseDetails.url);
  console.log("Error=",responseDetails.error);
}

function logURL1(requestDetails) {
   console.log ('loading ',requestDetails.url);
//  if (resource.indexOf("youtube.com/")!= -1)  
//  {
    var j;
    if ((j=requestDetails.url.indexOf(".googlevideo.com/generate_204"))!= -1)
    {
        prefix = requestDetails.url.slice (0,j);
        sufix = prefix.slice (prefix.lastIndexOf ('-'));
        return {cancel: false};
    }
    if ((j=requestDetails.url.indexOf(".googlevideo.com"))!= -1 && prefix)
    {
        var pref = requestDetails.url.slice (0,j);
        if (pref.indexOf(sufix)== -1)
        {
            d = new Date();

            h = addZero(d.getHours());
            m = addZero(d.getMinutes());
            s = addZero(d.getSeconds());
            console.log ("Обнаружена реклама от Google ",h,':',m,':',s,requestDetails.url);
            console.log ('Блокирую');

            return {cancel: true};
        }else
        {
            return {cancel: false};
        }
            
    }
    if ( requestDetails.url.indexOf("/pagead/")!= -1)
    {
      if ((requestDetails.url.indexOf("doubleclick.net")!= -1 || requestDetails.url.indexOf("google.com")!= -1) &&
           requestDetails.url.indexOf("www.ivi.ru")!= -1) {

          return {cancel: false};
      }
      d = new Date();

      h = addZero(d.getHours());
      m = addZero(d.getMinutes());
      s = addZero(d.getSeconds());
      console.log ("Попытка втюрить рекламу ",h,':',m,':',s,requestDetails.url);
      console.log ('Блокирую');

      return {cancel: true};
    }
    if ( requestDetails.url.indexOf("ad_cpn=")!= -1 ||
         requestDetails.url.indexOf("el=adunit")!= -1)
    {
      d = new Date();

      h = addZero(d.getHours());
      m = addZero(d.getMinutes());
      s = addZero(d.getSeconds());
      console.log ("Попытка втюрить рекламу ",h,':',m,':',s,requestDetails.url);
      console.log ('Блокирую');

      return {cancel: true};
    }
    if ( requestDetails.url.indexOf("/player/ad_break?") != -1)
    {
      d = new Date();

      h = addZero(d.getHours());
      m = addZero(d.getMinutes());
      s = addZero(d.getSeconds());
      console.log ("Попытка втюрить рекламный ролик AD_break ",h,':',m,':',s,requestDetails.url);
      console.log ('Блокирую');
      return {cancel: true};
    }

    if ((requestDetails.url.indexOf("/ads?") != -1) ||
        (requestDetails.url.indexOf("/ptracking?") != -1) ||
        (requestDetails.url.indexOf("el=adunit") != -1) ||
        (requestDetails.url.indexOf("pltype=adhost") != -1))
    {
      d = new Date();

      h = addZero(d.getHours());
      m = addZero(d.getMinutes());
      s = addZero(d.getSeconds());
      console.log ("Попытка принудительной рекламы <ptracking> ",h,':',m,':',s,requestDetails.url);
      console.log ('Блокирую');
      return {cancel: true};
    }
}

function logURL2(requestDetails) { 
     console.log ('loading ',requestDetails.url);
    if ((requestDetails.url.indexOf("/pagead/")!= -1 &&
         requestDetails.url.indexOf("label=show_ad")!= -1)||
         requestDetails.url.indexOf("dt.adsafeprotected.com")!= -1 ||
         requestDetails.url.indexOf("pagead2.googlesyndication.com")!= -1 ||
         requestDetails.url.indexOf("adservice.google.com")!= -1/* ||
        (requestDetails.url.indexOf("googlevideo.com")!= -1 &&
         requestDetails.url.indexOf("mime=video/mp4")!= -1)*/)
    {
      d = new Date();

      h = addZero(d.getHours());
      m = addZero(d.getMinutes());
      s = addZero(d.getSeconds());
      console.log ("Попытка втюрить рекламу ",h,':',m,':',s,requestDetails.url);
      console.log ('Блокирую');

      return {cancel: true};
    }
    if (((requestDetails.url.indexOf('.mp4') != -1 && //fast-torrent-ru
        requestDetails.url.indexOf('scdn') != -1) ||  //kinogoo.cc
       (requestDetails.url.indexOf('cdn') != -1 &&
        requestDetails.url.indexOf('.mp4') != -1)) &&
       (requestDetails.url.indexOf(':hls') == -1 &&
        requestDetails.url.indexOf(':seg') == -1 && 
        requestDetails.url.indexOf('blank.mp4') == -1))
    {
      d = new Date();

      h = addZero(d.getHours());
      m = addZero(d.getMinutes());
      s = addZero(d.getSeconds());
      console.log ("ролик scdn",h,':',m,':',s,requestDetails.url);
      console.log ('Блокирую');

      return {cancel: true};
    }
    if (requestDetails.url.indexOf('.mp4') != -1 &&
        requestDetails.url.indexOf('serving-sys.com') != -1)
    {
      if (ua.browser.family=='Chrome') 
      {
          d = new Date();

          h = addZero(d.getHours());
          m = addZero(d.getMinutes());
          s = addZero(d.getSeconds());
          try {
               chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
                 chrome.tabs.sendMessage(tabs[0].id,"del_adframe");
               });
          } catch (ex) {
               console.error ('ошибка предачи сообщения ->del_adframe:',h,':',m,':',s,ex.message);
          }  
      }else
      {
          d = new Date();

          h = addZero(d.getHours());
          m = addZero(d.getMinutes());
          s = addZero(d.getSeconds());
          try {
               var gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});  

               gettingActiveTab.then((tabs) => {
                 browser.tabs.sendMessage(tabs[0].id,"del_adframe");
               });
          }catch (ex) {
               console.error ('ошибка предачи сообщения ->del_adframe:',h,':',m,':',s,ex.message);
          }
      }
      return {cancel: true};
    }
    if (((requestDetails.url.indexOf('dfsplus-linx-3.dfs.ivi.ru')!=-1 ||
          requestDetails.url.indexOf('region.dfs.ivi.ru')!=-1) &&
          requestDetails.url.indexOf('/mp4-shq/')!=-1 &&
          requestDetails.url.indexOf('.mp4')!=-1) ||

         (requestDetails.url.indexOf('.mp4')!=-1 &&
          requestDetails.url.indexOf('content.admixer.net')!=-1)&&
          requestDetails.url.indexOf('csi.gstatic.com')==-1) //www.ivi.ru 
    {
        d = new Date();

        h = addZero(d.getHours());
        m = addZero(d.getMinutes());
        s = addZero(d.getSeconds());
        console.log ("ролик mp4-shq",h,':',m,':',s,requestDetails.url);  

     /*   if (ua.browser.family=='Chrome') 
        {
            d = new Date();

            h = addZero(d.getHours());
            m = addZero(d.getMinutes());
            s = addZero(d.getSeconds());
            try {
                 chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
                   chrome.tabs.sendMessage(tabs[0].id,"del_adframe_ivi");
                 });
            } catch (ex) {
                 console.error ('ошибка предачи сообщения ->del_adframe_ivi:',h,':',m,':',s,ex.message);
            }  
        }      */
        return {cancel: true};
    }

    if (requestDetails.url.indexOf('.adpartner.') !=-1 &&
        requestDetails.url.indexOf('.mp4') != -1) //bazon telegram
    {
        d = new Date();

        h = addZero(d.getHours());
        m = addZero(d.getMinutes());
        s = addZero(d.getSeconds());
        console.log ("ролик bazon",h,':',m,':',s,requestDetails.url);

        return {cancel: true};
    }
//  } 
}

/*
(ua.browser.family=='Chrome')?
chrome.tabs.onActivated.addListener(handleActivated):
browser.tabs.onActivated.addListener(handleActivated);
*/
(ua.browser.family=='Chrome')?
chrome.webRequest.onBeforeRequest.addListener(
  logURL1,
  {urls: ["*://*.youtube.com/*","*://*.google.com/*","*://*.doubleclick.net/*","*://*.googlevideo.com/*"]},["blocking"]
):
browser.webRequest.onBeforeRequest.addListener(
  logURL1,
  {urls: ["*://*.youtube.com/*","*://*.google.com/*","*://*.doubleclick.net/*","*://*.googlevideo.com/*"]},["blocking"]
);
(ua.browser.family=='Chrome')?
chrome.webRequest.onBeforeRequest.addListener(
  logURL2,
  {urls: [pattern]},["blocking"]
):
browser.webRequest.onBeforeRequest.addListener(
  logURL2,
  {urls: [pattern]},["blocking"]
);
(ua.browser.family=='Chrome')?
chrome.webRequest.onErrorOccurred.addListener(
  logError,
  {urls: [pattern]}
):
browser.webRequest.onErrorOccurred.addListener(
  logError,
  {urls: [pattern]}
);

function addZero(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}
