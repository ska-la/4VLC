/*------------------------------- JS stuff for item.html -------------------------------*/
"use strict";

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
//var tmpName = "";
var inStance;

  brIndex = getTagIndex( xmlDoc, "broadcast" );
  if ( brIndex === -1 ) {
    window.close();
  }
  brXmlPart = xmlDoc.getElementsByTagName("broadcast")[brIndex];
  var tagAttrs = brXmlPart.attributes;
/*  tmpName = tagAttrs.getNamedItem("name").nodeValue;
  document.getElementById("nameInfo").innerHTML = "<h2><b>" + tmpName + "</b></h2>";
  document.getElementById("nameInfo2").innerHTML = "<h2><b>" + tmpName + "</b></h2>";    */
  document.getElementById("accessInfo").innerHTML = "<h2><b>" + howToAccess() + "</b></h2>";
  inStance = brXmlPart.getElementsByTagName("instance")[0];
  if ( inStance != undefined ) {
    dynDecor();
    if ( inStance.attributes.getNamedItem("state").nodeValue === "playing" ) {
      pollVlm = setInterval( vlmStatReq, 3141 );
    }
    if ( inStance.attributes.getNamedItem("state").nodeValue === "paused" ) {
      document.getElementById("idPause").innerHTML = resumeDecor;
    }
    document.getElementById("idStop").style.display = "none";
    document.getElementById("idPlay").style.display = "block";
  }
  if ( tagAttrs.getNamedItem("loop").nodeValue === "yes" ) {
    loopEd = true;
  } else {
    loopEd = false;
  }
  if ( loopEd ) {
    document.getElementById("idCheck").innerHTML = squareImg + checkImg;
  } else {
    document.getElementById("idCheck").innerHTML = squareImg;
  }
  var inputsArr = brXmlPart.getElementsByTagName("input");
  var tmpStr = "";
  var tmpFiles = "";
  var fullPath = "";
  var arrLen = inputsArr.length;
  var j,k;
    for ( j=0; j < arrLen; j++ ) {
      fullPath = inputsArr[j].childNodes[0].nodeValue;
      tmpStr += fullPath + "<br>";
      if ( (k = fullPath.lastIndexOf("/")) == -1 ) {
        tmpFiles += fullPath.slice(fullPath.lastIndexOf("\\") + 1) + "<br>";
      } else {
        tmpFiles += fullPath.slice(k+1) + "<br>";
      }
    }
  document.getElementById("inputInfo").innerHTML = tmpStr;
  document.getElementById("outputInfo").innerHTML = brXmlPart.getElementsByTagName("output")[0].childNodes[0].nodeValue;
  document.getElementById("idFiles").innerHTML = tmpFiles;
}

function getTagIndex( dXml, tName ) {
  var tAgs = dXml.getElementsByTagName( tName );
  var attrName = "name";
  var j, aTtribs;
  for ( j in tAgs ) {
    aTtribs = tAgs[j].attributes;
    if ( aTtribs == undefined ) {
      window.alert("VLM has not the task!");
      return -1;
    }
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
          vlcError();
        }
      } else  if ( this.readyState == 4 && this.status != 200 ) {
        vlcFail( this );
      }
    }
  );
}

function playItem() {
var tmpCmd = vlmCmd + cmdControl + document.title + " " + ctrlPlay + currFileIndex.toString();

  w3Http( tmpCmd, function () {
      if ( this.readyState == 4 && this.status == 200 ) {
        if ( this.responseText.length == 84 ) {
          document.getElementById("idStop").style.display = "none";
          document.getElementById("idPlay").style.display = "block";
          pollVlm = setInterval( vlmStatReq, 3141 );
        } else {
          xmlDoc = this.responseXML;
          vlcError();
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
          stopThen();
        } else {
          xmlDoc = this.responseXML;
          vlcError();
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
    tmpCmd = tmpCmd + ctrlPlay + currFileIndex.toString();
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
          vlcError();
        }
      } else  if ( this.readyState == 4 && this.status != 200 ) {
        vlcFail( this );
      }
    }
  );
}

function nextItem() {
var tmpLen = brXmlPart.getElementsByTagName("input").length;
  if ( tmpLen > 1 ) {
    if ( tmpLen > currFileIndex ) {
      currFileIndex++;
    } else {
      currFileIndex = 1;
    }
  }
  npItemPlay();
}

function prevItem() {
var tmpLen = brXmlPart.getElementsByTagName("input").length;
  if ( tmpLen > 1 ) {
    if ( currFileIndex > 1 ) {
      currFileIndex--;
    } else {
      currFileIndex = tmpLen;
    }
  }
  npItemPlay();
}

function vlmStatReq() {
  w3Http( vlmStatus , function () {
      if ( this.readyState == 4 && this.status == 200 ) {
        xmlDoc = this.responseXML;
        brIndex = getTagIndex( xmlDoc, "broadcast" );
        if ( brIndex === -1 ) {
          window.close();
        }
        brXmlPart = xmlDoc.getElementsByTagName("broadcast")[brIndex];
        dynDecor();
      } else  if ( this.readyState == 4 && this.status != 200 ) {
        vlcFail( this );
      }
    }
  );
}

function getTrackLen( aTtrs ) {
var tempNum, tempNum2;
var tempTime = "";

  tempNum = Number(aTtrs.getNamedItem("length").nodeValue.slice(0,-6));
  tempNum2 = tempNum%60;
  if ( tempNum2 < 10 ) {
    tempTime = ":0" + (tempNum2).toFixed(0);
  } else {
    tempTime = ":" + (tempNum2).toFixed(0);
  }
  tempNum -= tempNum2;
  tempNum2 = (tempNum%3600)/60;
  if ( tempNum2 < 10 ) {
    tempTime = ":0" + (tempNum2).toFixed(0) + tempTime;
  } else {
    tempTime = ":" + (tempNum2).toFixed(0) + tempTime;
  }
  tempNum -= tempNum2*60;
  tempNum2 = (tempNum%86400)/3600;
  if ( tempNum2 < 10 ) {
    tempTime = "0" + (tempNum2).toFixed(0) + tempTime;
  } else {
    tempTime = (tempNum2).toFixed(0) + tempTime;
  }
  document.getElementById("timeTotal").innerHTML = tempTime;
  if ( tempTime !== "00:00:00" ) {
    knownLength = true;
  }
}

function dynDecor() {
var tmpAttrs, tmpNum, tmpNum2;
var tmpTime = "";

  if ( brXmlPart.getElementsByTagName("instance")[0] == undefined ) {
    stopThen();
  }
  tmpAttrs = brXmlPart.getElementsByTagName("instance")[0].attributes;
  tmpNum = tmpAttrs.getNamedItem("playlistindex").nodeValue;
  if ( currFileIndex != tmpNum ) {
    currFileIndex = tmpNum;
    knownLength = false;
  }
  if ( ! knownLength ) {
    getTrackLen( tmpAttrs );
    document.getElementById("fileName").innerHTML = getFileName();
  }
  tmpNum = Number(tmpAttrs.getNamedItem("time").nodeValue.slice(0,-6));
  tmpNum2 = tmpNum%60;
  if ( tmpNum2 < 10 ) {
    tmpTime = ":0" + (tmpNum2).toFixed(0);
  } else {
    tmpTime = ":" + (tmpNum2).toFixed(0);
  }
  tmpNum -= tmpNum2;
  tmpNum2 = (tmpNum%3600)/60;
  if ( tmpNum2 < 10 ) {
    tmpTime = ":0" + (tmpNum2).toFixed(0) + tmpTime;
  } else {
    tmpTime = ":" + (tmpNum2).toFixed(0) + tmpTime;
  }
  tmpNum -= tmpNum2*60;
  tmpNum2 = (tmpNum%86400)/3600;
  if ( tmpNum2 < 10 ) {
    tmpTime = "0" + (tmpNum2).toFixed(0) + tmpTime;
  } else {
    tmpTime = (tmpNum2).toFixed(0) + tmpTime;
  }
  document.getElementById("timeElapsed").innerHTML = tmpTime;
  tmpNum = Number(tmpAttrs.getNamedItem("position").nodeValue.slice(2,4));
  document.getElementById("idProgress").style.width = tmpNum + "%";
}

function editSap() {
var tmpCmd = "";

  var tmpStr = brXmlPart.getElementsByTagName("output")[0].childNodes[0].nodeValue;
  var firstQuote = tmpStr.indexOf("\"");
  var secondQuote = tmpStr.lastIndexOf("\"");
  var tmpSapName = tmpStr.slice( firstQuote + 1, secondQuote );

  var newName = window.prompt("Input another name to distinguish your stream\ninto a list of Service Advertising Protocol(SAP).", tmpSapName);
  if ( newName != null && newName !== tmpSapName ) {
    tmpStr = tmpStr.replace(tmpSapName,newName);
    tmpCmd = vlmCmd + encodeURIComponent(cmdSetup + document.title + " output " + tmpStr);
  w3Http( tmpCmd , function () {
      if ( this.readyState == 4 && this.status == 200 ) {
        if ( this.responseText.length != 84 ) {
          xmlDoc = this.responseXML;
          vlcError();
        }
      } else  if ( this.readyState == 4 && this.status != 200 ) {
        vlcFail( this );
      }
    }
  );
  }
}

function changeLoop() {
var tmpLoop = "";

  if ( loopEd ) {
    document.getElementById("idCheck").innerHTML = squareImg;
    tmpLoop = " unloop";
    loopEd = false;
  } else {
    document.getElementById("idCheck").innerHTML = squareImg + checkImg;
    tmpLoop = " loop";
    loopEd = true;
  }

  var tmpCmd = vlmCmd + encodeURIComponent(cmdSetup + document.title + tmpLoop);

  w3Http( tmpCmd , function () {
      if ( this.readyState == 4 && this.status == 200 ) {
        if ( this.responseText.length != 84 ) {
          xmlDoc = this.responseXML;
          vlcError();
        }
      } else  if ( this.readyState == 4 && this.status != 200 ) {
        vlcFail( this );
      }
    }
  );
}

function stopThen() {
  clearInterval( pollVlm );
  knownLength = false;
  document.getElementById("idPlay").style.display = "none";
  document.getElementById("idStop").style.display = "block";
  document.getElementById("idPause").innerHTML = pauseDecor;
}

function howToAccess() {
var tmpAccess = "";

  var tmpStr = brXmlPart.getElementsByTagName("output")[0].childNodes[0].nodeValue;
  var firstQuote = tmpStr.indexOf("#");
  var secondQuote = tmpStr.indexOf("{");
  var tmpAccess = tmpStr.slice( firstQuote + 1, secondQuote ) + "://";

  var firstQuote = tmpStr.indexOf("dst=") + 3;
  var secondQuote = tmpStr.indexOf(",port=");
  var tmpAccess = tmpAccess + tmpStr.slice( firstQuote + 1, secondQuote ) + ":";

  var firstQuote = secondQuote + 5;
  var secondQuote = tmpStr.indexOf(",sdp=");
  var tmpAccess = tmpAccess + tmpStr.slice( firstQuote + 1, secondQuote );

  return tmpAccess;
}

function shDetails() {
var det = document.getElementById("idDetails");
  if ( det.className.indexOf("w3-show") == -1 ) {
    det.className = det.className + " w3-show";
  } else {
    det.className = det.className.replace("w3-show" ,"");
  }
}

function getFileName() {
  var tmpPath = brXmlPart.getElementsByTagName("input")[currFileIndex-1].childNodes[0].nodeValue;
  return tmpPath.slice(tmpPath.lastIndexOf("/")+1);
}

function npItemPlay() {
  clearInterval( pollVlm );
  document.getElementById("idPause").innerHTML = pauseDecor;
  knownLength = false;
  playItem();
}

function vlcError() {
  window.alert( xmlDoc.getElementsByTagName("error")[0].childNodes[0].nodeValue );
}

function vlcFail( abc ) {
  window.alert("VLC can't do it!\nStatus: " + abc.status + " " + abc.statusText);
}

