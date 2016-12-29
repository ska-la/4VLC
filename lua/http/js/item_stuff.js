/*------------------------------- JS stuff for item.html -------------------------------*/

function pageInit() {

  document.title = getPageParam( window.location.href, "name" );
  w3Http( vlmStatus , function () {
      if ( this.readyState == 4 && this.status == 200 ) {
        xmlDoc = this.responseXML;
        fillPage();
      } else  if ( this.readyState == 4 && this.status != 200 ) {
        vlcFail( this );
      }
    }
  );

}

function getPageParam( strPageURI, strParam ) {

  var tmpParams = strPageURI.slice( strPageURI.lastIndexOf("?") + 1 );
  var tmpArr = tmpParams.split("&");
  var j;
  for ( j in tmpArr ) {
    if ( tmpArr[j].indexOf(strParam) == 0 ) {
      return tmpArr[j].slice( tmpArr[j].lastIndexOf("=") + 1 );
    }
  }

}

function fillPage() {

var tmpName = "";

  brIndex = getTagIndex( xmlDoc, "broadcast" );
  var tagAttrs = xmlDoc.getElementsByTagName("broadcast")[brIndex].attributes;
  tmpName = tagAttrs.getNamedItem("name").nodeValue;
  document.getElementById("nameInfo").innerHTML = tmpName;
  document.getElementById("nameInfo2").innerHTML = tmpName;
  document.getElementById("loopInfo").innerHTML = tagAttrs.getNamedItem("loop").nodeValue;
  document.getElementById("inputInfo").innerHTML = xmlDoc.getElementsByTagName("input")[brIndex].childNodes[0].nodeValue;
  document.getElementById("outputInfo").innerHTML = xmlDoc.getElementsByTagName("output")[brIndex].childNodes[0].nodeValue;

}

function getTagIndex( dXml, tName ) {

  var tAgs = dXml.getElementsByTagName( tName );
  var attrName = "name";
  var j, aTtribs;
  for ( j in tAgs ) {
    aTtribs = tAgs[j].attributes;
    if ( aTtribs.getNamedItem( attrName ).nodeValue === document.title ) {
      return j;
    }
  }

}

function delItem() {

var tmpCmd = vlmCmd + cmdDel + document.title;

  w3Http( tmpCmd, function () {
      if ( this.readyState == 4 && this.status == 200 ) {
        if ( this.responseText.length == 84 ) {
          window.close();
        } else {
          xmlDoc = this.responseXML;
          window.alert( xmlDoc.getElementsByTagName("error")[0].childNodes[0].nodeValue );
        }
      } else  if ( this.readyState == 4 && this.status != 200 ) {
        vlcFail( this );
      }
    }
  );

}

function playItem() {

var tmpCmd = vlmCmd + cmdControl + document.title + " " + ctrlPlay;

  w3Http( tmpCmd, function () {
      if ( this.readyState == 4 && this.status == 200 ) {
        if ( this.responseText.length == 84 ) {
          document.getElementById("idStop").style.display = "none";
          document.getElementById("idPlay").style.display = "block";
          pollVlm = setInterval( vlmStatReq, 3141 );
        } else {
          xmlDoc = this.responseXML;
          window.alert( xmlDoc.getElementsByTagName("error")[0].childNodes[0].nodeValue );
        }
      } else  if ( this.readyState == 4 && this.status != 200 ) {
        vlcFail( this );
      }
    }
  );

}

function stopItem() {

var tmpCmd = vlmCmd + cmdControl + document.title + " " + ctrlStop;

  w3Http( tmpCmd, function () {
      if ( this.readyState == 4 && this.status == 200 ) {
        if ( this.responseText.length == 84 ) {
          document.getElementById("idPlay").style.display = "none";
          document.getElementById("idStop").style.display = "block";
          clearInterval( pollVlm );
          knownLength = false;
        } else {
          xmlDoc = this.responseXML;
          window.alert( xmlDoc.getElementsByTagName("error")[0].childNodes[0].nodeValue );
        }
      } else  if ( this.readyState == 4 && this.status != 200 ) {
        vlcFail( this );
      }
    }
  );

}

function pauseItem() {

var tmpCmd = vlmCmd + cmdControl + document.title + " ";
var btnPause = document.getElementById("idPause");

  if ( btnPause.innerHTML === pauseDecor ) {
    tmpCmd = tmpCmd + ctrlPause;
  } else {
    tmpCmd = tmpCmd + ctrlPlay;
  }

  w3Http( tmpCmd, function () {
      if ( this.readyState == 4 && this.status == 200 ) {
        if ( this.responseText.length == 84 ) {
          if ( btnPause.innerHTML === pauseDecor ) {
            btnPause.innerHTML = resumeDecor;
            clearInterval( pollVlm );
          } else {
            btnPause.innerHTML = pauseDecor;
            pollVlm = setInterval( vlmStatReq, 3141 );
          }
        } else {
          xmlDoc = this.responseXML;
          window.alert( xmlDoc.getElementsByTagName("error")[0].childNodes[0].nodeValue );
        }
      } else  if ( this.readyState == 4 && this.status != 200 ) {
        vlcFail( this );
      }
    }
  );

}

function vlmStatReq() {

  w3Http( vlmStatus , function () {
      if ( this.readyState == 4 && this.status == 200 ) {
        xmlDoc = this.responseXML;
        brIndex = getTagIndex( xmlDoc, "broadcast" );
        dynDecor();
      } else  if ( this.readyState == 4 && this.status != 200 ) {
        vlcFail( this );
      }
    }
  );

}

function getTrackLen( aTtrs ) {

var tmpNum, tmpNum2;
var tmpTime = "";

  tmpNum = Number(aTtrs.getNamedItem("length").nodeValue.slice(0,-6));
  tmpNum2 = tmpNum%60;
  if ( tmpNum2 < 10 ) {
    tmpTime = ":0" + (tmpNum2).toFixed(0);
  } else {
    tmpTime = ":" + (tmpNum2).toFixed(0);
  }
  tmpNum2 = (tmpNum%3600 - tmpNum2)/60;
  if ( tmpNum2 < 10 ) {
    tmpTime = ":0" + (tmpNum2).toFixed(0) + tmpTime;
  } else {
    tmpTime = ":" + (tmpNum2).toFixed(0) + tmpTime;
  }
  tmpNum2 = tmpNum/3600;
  if ( tmpNum2 < 10 ) {
    tmpTime = "0" + (tmpNum2).toFixed(0) + tmpTime;
  } else {
    tmpTime = (tmpNum2).toFixed(0) + tmpTime;
  }
  document.getElementById("timeTotal").innerHTML = tmpTime;

}

function dynDecor() {

var tmpAttrs, tmpNum, tmpNum2;
var tmpTime = "";

  tmpAttrs = xmlDoc.getElementsByTagName("broadcast")[brIndex].getElementsByTagName("instance")[0].attributes;
  if ( ! knownLength ) {
    getTrackLen( tmpAttrs );
    knownLength = true;
  }
  tmpNum = Number(tmpAttrs.getNamedItem("time").nodeValue.slice(0,-6));
  tmpNum2 = tmpNum%60;
  if ( tmpNum2 < 10 ) {
    tmpTime = ":0" + (tmpNum2).toFixed(0);
  } else {
    tmpTime = ":" + (tmpNum2).toFixed(0);
  }
  tmpNum2 = (tmpNum%3600 - tmpNum2)/60;
  if ( tmpNum2 < 10 ) {
    tmpTime = ":0" + (tmpNum2).toFixed(0) + tmpTime;
  } else {
    tmpTime = ":" + (tmpNum2).toFixed(0) + tmpTime;
  }
  tmpNum2 = tmpNum/3600;
  if ( tmpNum2 < 10 ) {
    tmpTime = "0" + (tmpNum2).toFixed(0) + tmpTime;
  } else {
    tmpTime = (tmpNum2).toFixed(0) + tmpTime;
  }
  document.getElementById("timeElapsed").innerHTML = tmpTime;
  tmpNum = Number(tmpAttrs.getNamedItem("position").nodeValue.slice(2,4));
  document.getElementById("idProgress").style.width = tmpNum + "%";

}

function vlcFail( abc ) {
  window.alert("VLC can't do it!\nStatus: " + abc.status + " " + abc.statusText);
}

