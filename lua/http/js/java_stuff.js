/*------------------ all JS stuff is here ------------------*/
"use strict";

function pageInit() {

  classFiles = document.getElementById("idFiles").attributes.getNamedItem("class");
  classTasks = document.getElementById("idTasks").attributes.getNamedItem("class");
  classDivF = document.getElementById("idDivF").attributes.getNamedItem("class");
  classDivT = document.getElementById("idDivT").attributes.getNamedItem("class");

}

function openFList( newDir, d ) {

var tmpDir = "";
var tmpIndex = newDir.lastIndexOf("/");

  if ( d !== "dir" ) {
    window.alert("It's not MP4 file!");
    return;
  }

  if ( newDir !== "" ) {
    if ( newDir.slice(-2) === ".." ) {
      tmpDir = newDir.slice(prefLen, prefLen + newDir.slice(prefLen,-3).lastIndexOf("/"));
      tmpDir = reqDir + uriSlash + tmpDir;
    } else {
      tmpDir = reqDir + uriSlash + newDir.slice(prefLen);
    }
  } else {
    tmpDir = reqDir + charTilda;
  }

  w3Http( tmpDir, function () {
    if ( this.readyState == 4 && this.status == 200 ) {
      jsonObj = JSON.parse( this.responseText );
      dataConvert();
      w3DisplayData("idTbl", jsonObj );
    } else  if ( this.readyState == 4 && this.status != 200 ) {
        vlcFail( this );
    }
    function dataConvert() {
      var i;
      var indX = 0;
      var tmpExt = "";
      var tmpPath = "";
      
      for ( i in jsonObj["element"] ) {
      
        jsonObj["element"][i].click_type = "";
        
        if ( jsonObj["element"][i].type == "dir" ) {
          if ( jsonObj["element"][i].name == ".." ) {
            jsonObj["element"][i].icon_type = '<img src="images/folder-out.jpg" alt="Folder">';
          } else {
            jsonObj["element"][i].icon_type = '<img src="images/folder-in.jpg" alt="Folder">';
          }
          jsonObj["element"][i].click_type = "openFList('" + jsonObj["element"][i].uri + "','dir')";
          jsonObj["element"][i].path = "";
        } else {
          jsonObj["element"][i].icon_type = '<img src="images/Other-48.png" alt="File">';
          indX = jsonObj["element"][i].name.lastIndexOf(".");
          if ( indX !== -1 ) {
            tmpExt = jsonObj["element"][i].name.slice(indX +1).toLowerCase();
            var j;
            for ( j in extA ) {
              if ( extA[j] === tmpExt ) {
                jsonObj["element"][i].icon_type = '<img src="images/Audio-48.png" alt="File">';
              }
            }
            for ( j in extV ) {
              if ( extV[j] === tmpExt ) {
                jsonObj["element"][i].icon_type = '<img src="images/Video-48.png" alt="File">';
                if ( j >= 0 && j <= 5 ) {
                  tmpPath = jsonObj["element"][i].path.replace( /\\/g, "\\\\" );
                  jsonObj["element"][i].click_type = "tryStream('" + tmpPath + "','" + jsonObj["element"][i].name + "')";
                } else {
                  jsonObj["element"][i].click_type = "";
                }
              }
            }
          }
        }
      }
    }
  } );

  document.getElementById("idMain").style.display = "none";
  document.getElementById("idSec").style.display = "block";

}

function tryStream( curFilePath, curFileName ) {
var ulArr = document.getElementById("ulTasks").getElementsByTagName("li");
var ulArrLen = ulArr.length;
var k = 0;
  for (k; k<ulArrLen; k++) {
    ulArr[k].style.display = "none";
  }
  filePath = curFilePath;
  fileName = curFileName;
  document.getElementById("idTaskName").style.display = "block";
}

function tryStream2(tmpName) {
  if ( tmpName == null || tmpName == "" ) {
    return;
  }
  strmName = tmpName + " ";

  if ( addrLastByte < 254 ) {
    addrLastByte++;
  } else {
    addrLastByte = 1;
  }
var tmpByte = addrLastByte.toString();
var tmpCmd = vlmCmd + encodeURIComponent(cmdNew + strmName + strmMode + strmEn + strmLoop + strmIn + filePath + strmOut1 + mcastIp + tmpByte + strmOut2 + mcastPort + strmOut3 + fileName + strmOutEnd);

  w3Http( tmpCmd , function () {
      if ( this.readyState == 4 && this.status == 200 ) {
        if ( this.responseText.length == 84 ) {
          window.open("item.html?name=" + encodeURIComponent(tmpName));
        } else {
          xmlDoc = this.responseXML;
          errMsg = xmlDoc.getElementsByTagName("error")[0].childNodes[0].nodeValue;
          if ( errMsg.slice(-19) === "Name already in use" ) {
            fPath = filePath;
            addMoreFile();
          } else {
            window.alert( errMsg );
          }
        }
      } else  if ( this.readyState == 4 && this.status != 200 ) {
        vlcFail( this );
      }
    }
  );
}

function addMoreFile() {
var tmpCmd = vlmCmd + encodeURIComponent(cmdSetup + strmName + strmIn + fPath + '"');

  w3Http( tmpCmd , function () {
      if ( this.readyState == 4 && this.status == 200 ) {
        if ( this.responseText.length != 84 ) {
          xmlDoc = this.responseXML;
          window.alert( xmlDoc.getElementsByTagName("error")[0].childNodes[0].nodeValue );
        }
      } else  if ( this.readyState == 4 && this.status != 200 ) {
        vlcFail( this );
      }
    }
  );
  addrLastByte--;
}

function fashionExchange() {
var tmpValue = classFiles.value;
  classFiles.value = classTasks.value;
  classTasks.value = tmpValue;
}

function selectFiles() {
  if ( classDivF.value.indexOf("w3-hide") != -1 ) {
    clearInterval( pollVlm );
    classDivT.value = classDivT.value + " w3-hide";
    classDivF.value = classDivF.value.replace(" w3-hide", "");
    fashionExchange();
  }
}

function selectTasks() {
  if ( classDivT.value.indexOf("w3-hide") != -1 ) {
    taskList();
    pollVlm = setInterval( taskList, 5000 );
    classDivF.value = classDivF.value + " w3-hide";
    classDivT.value = classDivT.value.replace(" w3-hide", "");
    fashionExchange();
  }
}

function taskList() {
var brList;
  w3Http( vlmStatus , function () {
      if ( this.readyState == 4 && this.status == 200 ) {
        xmlDoc = this.responseXML;
        buildTaskList();
        w3DisplayData("tblTasks", tasksObj);
        w3DisplayData("ulTasks", tasksObj);
      } else  if ( this.readyState == 4 && this.status != 200 ) {
        vlcFail( this );
      }
      function buildTaskList() {
        var t, listLen;
        var strTasks = '{"task":[';
        
        brList = xmlDoc.getElementsByTagName("broadcast");
        listLen = brList.length;
        for ( t=0; t < listLen; t++ ) {
          strTasks += '{"name":"' + brList[t].attributes.getNamedItem("name").nodeValue + '"}';
          if ( t != listLen - 1 ) {
            strTasks += "," ;
          }
        }
        strTasks += ']}';
        tasksObj = JSON.parse(strTasks);
      }
    }
  );
}

function filterApp(inPut) {
var recOrds = document.getElementById("ulTasks").getElementsByTagName("li");
var arrLen = recOrds.length;
var whatFind = inPut.value.toLowerCase();
var l = 0;
  document.getElementById("ulTasks").style.display = "";
  if ( whatFind.length > 0 ) {
    for (l; l<arrLen; l++) {
      if ( recOrds[l].innerHTML.toLowerCase().indexOf(whatFind) > -1 ) {
        recOrds[l].style.display = "";
      } else {
        recOrds[l].style.display = "none";
      }
    }
  } else {
    for (l; l<arrLen; l++) {
      recOrds[l].style.display = "none";
    }
  }
}

function flushToInp(curIl) {
  document.getElementById("idInp").value = curIl.getElementsByTagName("b")[0].innerHTML;
  document.getElementById("ulTasks").style.display = "none";
}

function selectYes() {
var nameVal = document.getElementById("idInp").value;
  if ( nameVal === "" ) {
    tryStream2("Test");
  } else {
    tryStream2(nameVal);
  }
  document.getElementById("idTaskName").style.display="none";
}

function selectNo() {
  document.getElementById("idTaskName").style.display="none";
}

function closeFList() {
  document.getElementById("idSec").style.display = "none";
  document.getElementById("idMain").style.display = "block";
  document.getElementById("idInp").value = "";
}

function vlcFail( abc ) {
  window.alert("VLC can't do it!\nStatus: " + abc.status + " " + abc.statusText);
}

