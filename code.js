// Initialize variables
var canvas1 = document.getElementById('myCanvas1');
var context1 = canvas1.getContext('2d');

var canvas2 = document.getElementById('myCanvas2');
var context2 = canvas2.getContext('2d');

var T1 = new Array(10);
var T2 = new Array(10);

var r1 = Math.floor(Math.random()*1000000000);
var r2 = Math.floor(Math.random()*1000000000);

var step = 0;

for (i=0;i<10;i++){
	T1[i] = ''; T2[i] = '';
}

T1[hash('TEST1',1)] = ' ';
T2[hash('TEST2',2)] = ' ';

var x="";

// clear canvas
context1.clearRect(0, 0, canvas1.width, canvas1.height);
context1.fillStyle = '#fff';
context1.fillRect  (0, 0, canvas1.width, canvas1.height);

context2.clearRect(0, 0, canvas2.width, canvas2.height);
context2.fillStyle = '#fff';
context2.fillRect  (0, 0, canvas2.width, canvas2.height);

// draw tables
for (i=0;i<10;i++){
  context1.beginPath();
  context1.rect(4, 20+i*40, 160, 40);
  context1.fillStyle = '#fff';
  context1.fill();
  context1.lineWidth = 1;
  context1.strokeStyle = '#555';
  context1.stroke();
}

for (i=0;i<10;i++){
  context2.beginPath();
  context2.rect(136, 20+i*40, 160, 40);
  context2.fillStyle = '#fff';
  context2.fill();
  context2.lineWidth = 1;
  context2.strokeStyle = '#555';
  context2.stroke();
}

context1.beginPath();
context1.fillStyle = '#000';
context1.font='25px Georgia';
context1.fillText("T1",65,460);

context2.beginPath();
context2.fillStyle = '#000';
context2.font='25px Georgia';
context2.fillText("T2",195,460);

disparrays();

document.getElementById('inputx').focus();

// ------------------- functions

// draw arcs and arrows
function arrow(pos, side, bidir, width){
	ctx = (side==1)?context1:context2;

	ctx.beginPath();
	ctx.fillStyle = '#fff';
	if (side==2)
		ctx.fillRect  (0, 0, 134, canvas2.height);
	else
		ctx.fillRect  (166, 0, canvas1.width-166, canvas1.height);
	ctx.fill();

	ctx.beginPath();
	if (side==2){
		ctx.moveTo(134,40*(pos+1));
		ctx.lineTo(126,40*(pos+1)-8);
		ctx.lineTo(126,40*(pos+1)+8);
		ctx.fillStyle = '#000';
		ctx.fill();
		if (bidir==1){
			ctx.moveTo(0,230);
			ctx.lineTo(8,222);
			ctx.lineTo(8,238);
			ctx.fillStyle = '#000';
			ctx.fill();
		}
	} else {
		ctx.moveTo(167,40*(pos+1));
		ctx.lineTo(174,40*(pos+1)-8);
		ctx.lineTo(174,40*(pos+1)+8);
		ctx.fillStyle = '#000';
		ctx.fill();
		if (bidir==1){
			ctx.moveTo(300,230);
			ctx.lineTo(292,222);
			ctx.lineTo(292,238);
			ctx.fillStyle = '#000';
			ctx.fill();
		}
	}

	ctx.beginPath();
	ctx.lineWidth = width;
	if (side==2){
		ctx.moveTo(3,230);
		ctx.bezierCurveTo(40,230,80,40*(pos+1),132,40*(pos+1));
	} else {
		ctx.moveTo(174,40*(pos+1));
		ctx.bezierCurveTo(220,40*(pos+1),260,230,297,230);
	}
	ctx.stroke();
}


function disparrays(){
	for (i=0;i<10;i++){
		context1.beginPath();
		context1.fillStyle = 'pink';
		context1.fillRect(4+2, 20+i*40+2, 160-4, 40-4);
		context1.fill();
		context1.fillStyle = '#000';
		context1.font='15px Courier';
		context1.fillText(T1[i],10,43+i*40);

		context2.beginPath();
		context2.fillStyle = 'grey';
		context2.fillRect(136+2, 20+i*40+2, 160-4, 40-4);
		context2.fill();
		context2.fillStyle = '#000';
		context2.font='15px Courier';
		context2.fillText(T2[i],142,43+i*40);
	}

}


function clearfield(){
	context1.beginPath();
	context1.fillStyle = '#fff';
	context1.fillRect  (166, 0, canvas1.width-166, canvas1.height);
	context1.fill();

	context2.beginPath();
	context2.fillStyle = '#fff';
	context2.fillRect  (0, 0, 134, canvas2.height);
	context2.fill();
}

function highlight(side, i, cond){
	if (side==1){
		context1.beginPath();
		context1.fillStyle = cond?"rgba(0, 255, 0, 0.5)":"rgba(255, 0, 0, 0.5)";
		context1.fillRect(4+2, 20+i*40+2, 160-4, 40-4);
	} else {
		context2.beginPath();
		context2.fillStyle = cond?"rgba(0, 255, 0, 0.5)":"rgba(255, 0, 0, 0.5)";
		context2.fillRect(136+2, 20+i*40+2, 160-4, 40-4);
	}

}

// process change in input box
function process(){
	x = document.getElementById("inputx").value;
	clearfield();
	if (x.length>0){
		x1 = hash(x, 1);
		x2 = hash(x, 2);
		arrow(x1, 1, 0, 1);
		arrow(x2, 2, 0, 1);

		disparrays();
		highlight(1,x1,(T1[x1] == x));
		highlight(2,x2,(T2[x2] == x));

		if ((T1[x1] == x) || (T2[x2] == x)){
			document.getElementById("message").innerHTML = "<font color='green'>FOUND</font>";
		} else {
			document.getElementById("message").innerHTML = "<font color='red'>NOT FOUND</font>";
		}
	} else {
			document.getElementById("message").innerHTML = "";
			disparrays();
	}
	document.getElementById('inputx').focus();
}



function insrt(loop){

	if (loop > 16){
		document.getElementById("message").innerHTML = "<font color='red'>INSERT fail.<br><br> MaxLoop=16 <br>reached. <br>Should rehash,<br>and increase<br>table size.</font>";
		setTimeout("document.getElementById('inputx').readOnly = false;document.getElementById('insertbutton').disabled = false;document.getElementById('deletebutton').disabled = false;document.getElementById('inputx').focus();",2000);
		return;
	}
	x = document.getElementById("inputx").value;
	if (x.length>0){
		x1 = hash(x, 1);
		x2 = hash(x, 2);
		document.getElementById('inputx').style.backgroundColor='white';
		if ((T1[x1] == x) || (T2[x2] == x)){
			document.getElementById("message").innerHTML = "<font color='red'>INSERT fail.<br><br> EXISTS.</font>";
			setTimeout("document.getElementById('inputx').focus();", 1000);
		}	else if (T1[x1] == ''){
			T1[x1] = x;
			disparrays();
			clearfield();
			arrow(x1,1,0,3);
			highlight(1,x1,true);
			document.getElementById("message").innerHTML = "<font color='green'>INSERT ok.</font>";
			document.getElementById('inputx').value = '';
			setTimeout("document.getElementById('inputx').readOnly = false;document.getElementById('insertbutton').disabled = false;document.getElementById('deletebutton').disabled = false;document.getElementById('inputx').focus();", 1000);
		} else if (T1[x1] != x){
			disparrays();
			clearfield();
			arrow(x1,1,0,3);
			highlight(1,x1,false);
			document.getElementById("message").innerHTML = "<font color='green'>Cell occupied.<br><br> We evict. <br><br> (Loop: "+loop+"/16)</font>";
			document.getElementById('inputx').readOnly = true;
                        document.getElementById("insertbutton").disabled = true;
                        document.getElementById("deletebutton").disabled = true;
			setTimeout("arrow("+x1+",1,1,3);", 1000);
			setTimeout("document.getElementById('inputx').value = '"+T1[x1]+"';T1["+x1+"]='"+x+"';disparrays();document.getElementById('inputx').style.backgroundColor='#7fff7f';highlight(1,"+x1+",true);", 2000);
			setTimeout("insertright("+(loop+1)+");", 3000);

		}
	}
}


function insertright(loop){
	x = document.getElementById("inputx").value;
	if (x.length>0){
		x1 = hash(x, 1);
		x2 = hash(x, 2);
		document.getElementById('inputx').style.backgroundColor='white';
		if (T2[x2] == ''){
			T2[x2] = x;
			disparrays();
			clearfield();
			arrow(x2,2,0,3);
			highlight(2,x2,true);
			document.getElementById("message").innerHTML = "<font color='green'>INSERT ok.</font>";
			document.getElementById('inputx').value = '';
			setTimeout("document.getElementById('inputx').readOnly = false;document.getElementById('insertbutton').disabled = false;document.getElementById('deletebutton').disabled = false; document.getElementById('inputx').focus();", 1000);
		} else if (T2[x2] != x){
			disparrays();
			clearfield();
			arrow(x2,2,0,3);
			highlight(2,x2,false);
			document.getElementById("message").innerHTML = "<font color='green'>Cell occupied.<br><br> We evict. <br><br> (Loop: "+loop+"/16)</font>";
			document.getElementById('inputx').readOnly = true;
                        document.getElementById("insertbutton").disabled = true;
                        document.getElementById("deletebutton").disabled = true;
			setTimeout("arrow("+x2+",2,1,3);", 1000);
			setTimeout("document.getElementById('inputx').value = '"+T2[x2]+"';T2["+x2+"]='"+x+"';disparrays();;document.getElementById('inputx').style.backgroundColor='#7fff7f';;highlight(2,"+x2+",true);", 2000);
			setTimeout("insrt("+(loop+1)+");", 3000)
		}
	}
}

function delt(){
	x = document.getElementById("inputx").value;
	if (x.length>0){
		x1 = hash(x, 1);
		x2 = hash(x, 2);
		if ((T1[x1] != x) && (T2[x2] != x)){
			document.getElementById("message").innerHTML = "<font color='red'>DELETE fail.<br><br> NOT FOUND</font>";
			setTimeout("document.getElementById('inputx').focus();", 1000);
		}  else if (T1[x1] == x){
			T1[x1] = '';
			disparrays();
			document.getElementById("message").innerHTML = "<font color='green'>DELETE ok.</font>";
			setTimeout("document.getElementById('inputx').value = '';document.getElementById('inputx').focus();", 1000);
		}  else if (T2[x2] == x){
			T2[x2] = '';
			disparrays();
			document.getElementById("message").innerHTML = "<font color='green'>DELETE ok.</font>";
			setTimeout("document.getElementById('inputx').value = '';document.getElementById('inputx').focus();", 1000);
		}
	}

}

// dummy hash function loosely based on http://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript-jquery
// note: this is fine for visualization, but not for any real application
function hash(stri, variant) {
  var hash = 0, i, chr, len;
  if (stri.length == 0) return hash;
  for (i = 0, len = stri.length; i < len; i++) {
    chr   = stri.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr + (chr*((variant==1)?r1:r2)<<i);
    hash |= 0;
  }
  hash = Math.abs(hash) % 10;
  return hash;
}
