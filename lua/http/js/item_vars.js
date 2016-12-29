/*----------------------- JS global vars for item.html -----------------*/

"use strict";

var vlmStatus = "/requests/vlm.xml";
var vlmCmd = "/requests/vlm_cmd.xml?command=";
var cmdControl = "control ";
var cmdDel = "del ";
var ctrlPlay = "play";
var ctrlPause = "pause";
var ctrlStop = "stop";

var pauseDecor = '<b>Pause </b><i class="fa fa-pause"></i>';
var resumeDecor = '<b>Resume </b><i class="fa fa-play"></i>';

var xmlDoc;
var brIndex = 0;
var knownLength = false;
var pollVlm;


