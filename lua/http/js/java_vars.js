/*------------------ all JS global vars are here ------------------*/
"use strict";

var reqDir = "/requests/browse.json?uri=file%3A%2F%2F";
var charTilda ="~";
var uriSlash = "%2F";
var prefLen = 8;

//var vlmStatus = "/requests/vlm.xml";
var vlmCmd = "/requests/vlm_cmd.xml?command=";
var cmdNew = "new ";
var strmName = "";
var strmMode = "broadcast ";
var strmEn = "enabled ";
var strmLoop = "loop ";
var strmIn = 'input "';
var strmOut1 = '" output #rtp{mux=ts,dst=';
var mcastIp = '224.2.0.';
var addrLastByte = 1;
var strmOut2 = ',port=';
var mcastPort = '1234';
var strmOut3 = ',sdp=sap,name="';
var strmOutEnd = '"}';

var extA = ["mp3", "ogg", "flac", "wma", "wav"];
var extV = ["mp4", "mpeg", "mpg", "avi", "mkv", "ogv", "wmv", "webm"];

var jsonObj;
var xmlDoc;

