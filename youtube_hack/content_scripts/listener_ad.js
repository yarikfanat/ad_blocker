var player,h,m,s,d,id_chk,observer,ads_module;

var ua = detect.parse(navigator.userAgent);

const callback_ivi = function(mutationsList, observer) {
       for (let mutation of mutationsList) {  
       if (mutation.type === 'childList') {
           var add_nodes = mutation.addedNodes;  
            if (add_nodes.length)
            {   
              console.log ('addnode type=',add_nodes[0].nodeType,'add nodes=',add_nodes[0]);
            /*  if (add_nodes[0].nodeType==1)                    
              {
                console.log ('add nodes=',add_nodes[0]);
                  if (add_nodes[0].tagName.toLowerCase()=='div')
                  {
                      if (typeof add_nodes[0].id!="undefined" && add_nodes[0].id=='js-player')
                      {
                          d = new Date();

                          h = addZero(d.getHours());
                          m = addZero(d.getMinutes());
                          s = addZero(d.getSeconds());    
                          console.log ('обнаружен рекламный контейнер js-player',h,':',m,':',s); 
                          try {
                                add_nodes[0].parentElement.removeChild (add_nodes[0]);
                                console.log ('рекламный блок удален ');
                          } catch (ex) {
                                console.error('Ошибка при удалении рекламного блока  ->', ex.message);
                          }                          
                      }
                  }
              } */
            }
         }  
       }
};
const callback = function(mutationsList, observer) {
       var i;
       for (let mutation of mutationsList) {           
           if (mutation.type === 'childList') {
               var add_nodes = mutation.addedNodes;               
               if (add_nodes.length)
               {                                   
                   if (add_nodes[0].nodeType==1)                    
                   {  
                       search_skip (add_nodes[0]);                                    
                       if (add_nodes[0].classList.contains('ytp-ad-overlay-slot'))
                       {
                          d = new Date();
                          console.log ('всплывающий рекламный баннер ',addZero(d.getHours()),':',addZero(d.getMinutes()),':',addZero(d.getSeconds()));

                          try {
                              while (add_nodes[0].firstChild) {                       
                                add_nodes[0].removeChild(add_nodes[0].firstChild);
                              }
                              add_nodes[0].style.display = 'none';
                              console.log ('рекламный баннер успешно удален');
                          }
                          catch (ex) {
                              console.error('Ошибка при удалении баннера ->', ex.message);
                          }                          
                          
                       }
                   }  
               }
           }                                              
       }
    };

const config = {
  childList: true,
  subtree: true,
  characterData: true
};    

var state_serv  = {
  running: true,
  error: false
};

function search_skip (node)
{
  for (var i = 0; i < node.children.length; i++) {        
    if (node.children[i].style.display == 'none')
    {
        if (node.children[i].tagName.toLowerCase()=='span')
            node.children[i].style.display = 'inline-block';
        else
            node.children[i].style.display = 'block';

    }
    
    if (node.children[i].textContent.toLowerCase()=='пропустить рекламу'||
        node.children[i].textContent.toLowerCase()=='пропустить')
    {
       if (node.children[i].parentElement.tagName.toLowerCase()=='button')
       {
           console.log ("обнаружена клиентская заставка принудительного просмотра ");       
           d = new Date();
           console.log ('инициирую пропуск рекламы',addZero(d.getHours()),':',addZero(d.getMinutes()),':',addZero(d.getSeconds()));
           try {
                var but_skip = node.children[i].parentElement;
                var event = new MouseEvent('click', {
                    'view': window,
                    'bubbles': true,
                    'cancelable': true
                });
                but_skip.dispatchEvent( event );
                return;

           } catch (ex) {
                console.error('Ошибка инициации пропуска рекламы->', ex.message);
                return;
           }
      }
       
    }
    search_skip (node.children[i]);
  }
}
function Listener_adframe(request, sender, sendResponse) {
  if (request=='del_adframe')
  {
      console.log ('сообщение на удаление рекламного фрейма поступило');
      remove_adframe ('movie-code');
  }else if (request=='del_adframe_ivi')
  {
      console.log ('сообщение на удаление рекламного фрейма ivi поступило');
      remove_adframe ('player-iframe');
  }
}
function Listener_msg(request, sender, sendResponse) {
  
  d = new Date();
  h = addZero(d.getHours());
  m = addZero(d.getMinutes());
  s = addZero(d.getSeconds());
  if (request.runServer=='Остановить')
  {    
      observer.disconnect();     
      console.log ('stop ad-blocker -- ',h,':',m,':',s);
      state_serv.running = false;
  }else if (request.runServer=='Запустить')
  {
      observer.observe(player, config);
      console.log ('start ad-blocker -- ',h,':',m,':',s);
      state_serv.running = true;
  }
  if (ua.browser.family=='Chrome')
      chrome.runtime.sendMessage(state_serv,null);
  else
      browser.runtime.sendMessage(state_serv,null);
  
}

function addZero(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

function start (id_player) {
  player = document.getElementById(id_player);
  if (!player)
  {
      d = new Date();

      h = addZero(d.getHours());
      m = addZero(d.getMinutes());
      s = addZero(d.getSeconds());
      console.log ('Плеер не найден. Попытка проверки через каждые 1 сек',h,':',m,':',s);
      id_chk = setInterval (function () {check_player(id_player);},1000);
  } else
  {
      if (id_player=='movie_player') //youtube 
      {
          start_server (); 
      }
   /*   else if (id_player=='player-iframe') 
      {          
          id_chk = setInterval (check_ivi_player(),1000);
      }*/
  }
}

function search_torrent_player () {
  player = document.getElementById('movie-code');
  if (!player)
  {
      d = new Date();

      h = addZero(d.getHours());
      m = addZero(d.getMinutes());
      s = addZero(d.getSeconds());
      console.log ('Плеер не найден. Попытка проверки через каждые 1 сек',h,':',m,':',s);
      id_chk = setInterval (check_torrent_player,1000);
  } else
      remove_adframe ();
}
function start_server () {
    try {
      d = new Date();

      h = addZero(d.getHours());
      m = addZero(d.getMinutes());
      s = addZero(d.getSeconds());

      if (player.id=='movie_player')
      {
          observer = new MutationObserver(callback);
          observer.observe(player, config);
      }
      console.log ('start ad-blocker -- ',h,':',m,':',s);

      try {
            if (ua.browser.family=='Chrome') 
                chrome.runtime.onMessage.addListener(Listener_msg);
            else
                browser.runtime.onMessage.addListener(Listener_msg);
      }catch (ex) {
            console.error('Ошибка подключения слушателя ->', ex.message);
            state_serv.error = true;
      }
      
    }catch (ex)
    {
          console.error('Ошибка при запуске сервера  ->', ex.message);
          state_serv.error = true;
    }

}

function check_player (id_player) {
    player = document.getElementById(id_player);
    if (player)
    {
        clearInterval (id_chk);
        d = new Date();

        h = addZero(d.getHours());
        m = addZero(d.getMinutes());
        s = addZero(d.getSeconds());
        console.log ('Плееер обнаружен ',h,':',m,':',s);
        if (id_player=='movie_player')
        {
            start_server ();
        }
   /*     else if (id_player=='player-iframe')
        {          
            id_chk = setInterval (check_ivi_player(),1000);
        }*/
    }
}
function check_ivi_player () {

  var doc;

  if(player.contentDocument) { 
     doc = player.contentDocument; 
  } else {
     doc = player.contentWindow.document; 
  }
  console.log ('doc==',doc);
  var jsplayer = doc.getElementById('js-player');

  if (jsplayer){
        
      clearInterval (id_chk);
      d = new Date();

      h = addZero(d.getHours());
      m = addZero(d.getMinutes());
      s = addZero(d.getSeconds());    
      console.log ('обнаружен рекламный контейнер js-player',h,':',m,':',s); 
      try {
            jsplayer.parentElement.removeChild (jsplayer);
            console.log ('рекламный блок удален ');
          } catch (ex) {
            console.error('Ошибка при удалении рекламного блока  ->', ex.message);
      }
  }
}

if (document.location.href.indexOf ('youtube.com')!=-1)
  start ('movie_player');
else
if (document.location.href.indexOf ('fast-torents.ru')!=-1)
{
    chrome.runtime.onMessage.addListener(Listener_adframe);
    var list = document.querySelectorAll('iframe[src^="https://"]');
    if (list.length)
    {
      d = new Date();

      h = addZero(d.getHours());
      m = addZero(d.getMinutes());
      s = addZero(d.getSeconds());
      try {
          var conteiner = list[0].parentElement;
          var src_frame = list[0].src;
          conteiner.parentElement.removeChild (conteiner);
          console.log ('рекламный фрейм удален ->',src_frame,' ',h,':',m,':',s);      
      } catch (ex)
      {
          console.error('Ошибка при удалении рекламного фрейма  ->', ex.message);
      }        
    }
}
if (document.location.href.indexOf ('.ivi.ru')!=-1){
    chrome.runtime.onMessage.addListener(Listener_adframe);
    start ('player-iframe');
}

function remove_adframe (id_player) {
   player = document.getElementById(id_player);
   if (player)
   {
       if (id_player=='movie-code') //fast-torrent
       {
           console.log ('колич во доченних элементов в плеере=',player.children.length);
           for (let i = 0; i < player.children.length; i++) {
               if (player.children[i].tagName.toLowerCase()=='iframe')
               {   
                   if (player.children[i].src.indexOf ('.svetacdn.') !=-1)
                     continue;
                   console.log ('пробую удалить рекламный фрейм');   
                   d = new Date();

                   h = addZero(d.getHours());
                   m = addZero(d.getMinutes());
                   s = addZero(d.getSeconds());            
                   try {
                         var src_frame = player.children[i].src;
                         player.removeChild (player.children[i]);
                         console.log ('рекламный фрейм удален ->',src_frame,' ',h,':',m,':',s);
                   }catch (ex) {
                         console.error('Ошибка при удалении рекламного фрейма  ->', ex.message);
                   }
                   break;             
               }
           }
       }else
       if (id_player=='player-iframe') //ivi.ru
       {           
           var doc;
           if(player.contentDocument) { 
              doc = player.contentDocument; 
          } else {
              doc = player.contentWindow.document; 
          }

          var conteiner_ad = doc.getElementById ('vpaidContainer');
          if (conteiner_ad)
          {
              for (let i = 0; i < conteiner_ad.children.length; i++) {        
                   if (conteiner_ad.children[i].tagName.toLowerCase()=='div')
                   {
                       if (conteiner_ad.children[i].innerHTML.toLowerCase().indexOf ('<iframe') != -1)
                       {
                           for (var j = 0; j < conteiner_ad.children[i].children.length; j++)
                           {
                                if (typeof conteiner_ad.children[i].children[j].name != 'undefined' &&
                                    conteiner_ad.children[i].children[j].tagName.toLowerCase()=='iframe' &&
                                    conteiner_ad.children[i].children[j].name.indexOf ('goog_')!= -1)
                                {
                                    d = new Date();

                                    h = addZero(d.getHours());
                                    m = addZero(d.getMinutes());
                                    s = addZero(d.getSeconds());    
                                    console.log ('обнаружен рекламный контейнер ',conteiner_ad.children[i].children[j].name,h,':',m,':',s); 
                                    try {
                                          conteiner_ad.children[i].children[j].parentElement.removeChild (conteiner_ad.children[i].children[j]);
                                          console.log ('рекламный блок удален ');
                                    } catch (ex) {
                                          console.error('Ошибка при удалении рекламного блока  ->', ex.message);
                                    }
                                }
                           }
                       }
                   }
              }              
          }
       }       
   }
}
