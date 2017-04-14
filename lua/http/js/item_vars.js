/*----------------------- JS global vars for item.html -----------------*/

"use strict";

var vlmStatus = "/requests/vlm.xml";
var vlmCmd = "/requests/vlm_cmd.xml?command=";
var cmdControl = "control ";
var cmdDel = "del ";
var cmdSetup = "setup ";
var ctrlPlay = "play ";
var ctrlPause = "pause";
var ctrlStop = "stop";
var ctrlSeek = "seek ";

var pauseDecor = '<b>Pause </b><i class="fa fa-pause"></i>';
var resumeDecor = '<b>Resume </b><i class="fa fa-play"></i>';

var squareImg = '<i class="fa fa-square-o fa-stack-2x"></i>';
var checkImg = '<i class="fa fa-check fa-stack-2x" style="color:orange"></i>';

var xmlDoc;
var brIndex = 0;
var brXmlPart;
var knownLength = false;
var pollVlm;
var currFileIndex = 1;
var loopEd = true;


