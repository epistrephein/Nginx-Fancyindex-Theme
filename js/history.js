function insertMirrorlistLinks() {
  var colgroupElement = document.getElementsByTagName('colgroup')[0]
  if (colgroupElement !== undefined)
    colgroupElement.parentNode.removeChild(colgroupElement)
  var theadElement = document.getElementsByTagName('thead')[0]
  if (theadElement !== undefined)
    theadElement.firstChild.append(document.createElement('th'))
  var tbodyElement = document.getElementsByTagName('tbody')[0]
  for (var trElement = tbodyElement.firstChild; trElement !== null; trElement = trElement.nextElementSibling)
  {
    var tdMirrorlist = document.createElement('td');
    if (trElement.childNodes[1].innerHTML !== '-')
    {
      var fileName = trElement.childNodes[0].firstChild.href
      tdMirrorlist.innerHTML = '<a href="' fileName + '?mirrorlist" style="display: initial" title="Mirrorlist ' + fileName + '"><img src="/css/mirrorlist16.png" /></a>'
    }
    trElement.append(tdMirrorlist);
  }
}

if (!!(window.history && history.pushState)) {

  var addEvent = (function () {
    if (document.addEventListener) {
      return function (el, type, fn) {
        if (el && el.nodeName || el === window) {
          el.addEventListener(type, fn, false);
        } else if (el && el.length) {
          for (var i = 0; i < el.length; i++) {
            addEvent(el[i], type, fn);
          }
        }
      };
    } else {
      return function (el, type, fn) {
        if (el && el.nodeName || el === window) {
          el.attachEvent('on' + type, function () {
            return fn.call(el, window.event);
          });
        } else if (el && el.length) {
          for (var i = 0; i < el.length; i++) {
            addEvent(el[i], type, fn);
          }
        }
      };
    }
  })();

  var updateCrumbs = function() {
    setTimeout(function () {
      var loc = document.location.pathname;
      var segments = loc.split('/');
      var breadcrumbs = '';
      var currentPath = '/';
      for (var i = 0; i < segments.length; i++) {
        if (segments[i] !== '') {
          currentPath += segments[i] + '/';
          breadcrumbs += '<a href="' +  currentPath + '">' + window.unescape(segments[i]) + '<\/a>';
        } else if (segments.length -1 !== i) {
          currentPath += '';
          breadcrumbs += '<a href="' + currentPath + '">Root<\/a>';
        }
      }
      document.getElementById('breadcrumbs').innerHTML = breadcrumbs;
    }, 500);
  };

  var swapPage = function(href) {
    var req = false;
    if (window.XMLHttpRequest) {
      req = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
      req = new ActiveXObject('Microsoft.XMLHTTP');
    }
    req.open('GET', href, false);
    req.send(null);
    if (req.status == 200) {
      var target = document.getElementsByClassName('box-content')[0];
      var div = document.createElement('div');
      div.innerHTML = req.responseText;
      var elements = div.getElementsByClassName('box-content')[0];
      target.innerHTML = elements.innerHTML;
      initHistory();
      insertMirrorlistLink();
      return true;
    }
    return false;
  };

  var initHistory = function() {
    var list = document.getElementById('list');

    addEvent(list, 'click', function (event) {
      if (event.target.nodeName == 'A' && event.target.innerHTML.indexOf('/') !== -1) {
        event.preventDefault();
        swapPage(event.target.href);
        var title = event.target.innerHTML;
        history.pushState({page: title}, title, event.target.href);
        updateCrumbs();
      }
    });
  };

  addEvent(window, 'popstate', function (e) {
    swapPage(location.pathname);
    updateCrumbs();
  });

  initHistory();
}
