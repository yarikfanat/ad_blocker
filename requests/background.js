
var pattern =/* "*://*.fast-torents.ru/*"*/ "<all_urls>";
var h,m,s,d;

function logError(responseDetails) {
  console.log("Url block-> ",responseDetails.url);
  console.log("Error=",responseDetails.error);
}

function logURL(requestDetails) {
   console.log("Url -> ",requestDetails.url);
  /*
  if ( requestDetails.url.indexOf("/pagead/adview?")!= -1)
  {
  	d = new Date();

    h = addZero(d.getHours());
    m = addZero(d.getMinutes());
    s = addZero(d.getSeconds());
  	console.log ("Попытка втюрить рекламу ",addZero(d.getHours()),':',addZero(d.getMinutes()),':',addZero(d.getSeconds()),requestDetails.url);
  	console.log ('Блокирую');

  	return {cancel: true};
  }
  if ( requestDetails.url.indexOf("/pagead/")!= -1)
  {
  	d = new Date();

    h = addZero(d.getHours());
    m = addZero(d.getMinutes());
    s = addZero(d.getSeconds());
  	console.log ("Попытка втюрить рекламу ",addZero(d.getHours()),':',addZero(d.getMinutes()),':',addZero(d.getSeconds()),requestDetails.url);
  	console.log ('Блокирую');

  	return {cancel: true};
  }
  if ( requestDetails.url.indexOf("/player/ad_break?") != -1)
  {
  	d = new Date();

    h = addZero(d.getHours());
    m = addZero(d.getMinutes());
    s = addZero(d.getSeconds());
  	console.log ("Попытка втюрить рекламный ролик AD_break ",addZero(d.getHours()),':',addZero(d.getMinutes()),':',addZero(d.getSeconds()),requestDetails.url);
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
  	console.log ("Попытка принудительной рекламы <ptracking> ",addZero(d.getHours()),':',addZero(d.getMinutes()),':',addZero(d.getSeconds()),requestDetails.url);
    console.log ('Блокирую');
  	return {cancel: true};
  }
  	*/
}

chrome.webRequest.onBeforeRequest.addListener(
  logURL,
  {urls: [pattern]}
);

chrome.webRequest.onErrorOccurred.addListener(
  logError,
  {urls: [pattern]}
);
function addZero(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}
