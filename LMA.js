//�O���[�o���֐����`
var canvas;
var ctx;
var phaseMenu = 0;
var phaseGameCom = 1;
var phaseGame2P = 2;
var phaseClear = 3;
var phaseDeath = 4;
var phase = phaseMenu;
var lastField = -1;
var statusField = [];
var newGame = 1;
var hand = 2; //�����͐łQ�C�����͐ԂłR

var firebaseConfig = {
  apiKey: "AIzaSyCODMszlrde5hAtMcFwmWOj8fEGEh0cshw",
  authDomain: "test-48ed6.firebaseapp.com",
  databaseURL: "https://test-48ed6.firebaseio.com",
  projectId: "test-48ed6",
  storageBucket: "",
  messagingSenderId: "810519313160",
  appId: "1:810519313160:web:5a40ebf471ae64a9"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var roomRef = firebase.database().ref().child('/');
//setInterval(countup, 42);

//���C���֐�
onload = function() {
  canvas = document.getElementById('id_canvas');
  ctx = canvas.getContext('2d');
  strokeRect(0, 0, 600, 441);
  if (phase == phaseMenu) {
    drawMenu();
  }
  canvas.addEventListener('click', clickfunc, false);
}

var charcode = "";
var charcount = 0;
$(document).keypress(function(event) {
	if(charcount!=5){
	  charcode = charcode & String.fromCharCode(event.which);
	  charcount = charcount + 1;
	}
  if (charcount == 5) {
    roomRef.orderByChild("id").startAt(charcode).endAt(charcode).once('value', function(snapshot) {
      if (snapshot == null) {
        roomRef.push({
          id: charcode,
          status: "empty",
        });
      }
    })
    charcount = 0;
  }
  console.log(String.fromCharCode(charcode));
});

function clickfunc(event) {
  var rect = event.target.getBoundingClientRect();
  var x = event.clientX - rect.left;
  var y = event.clientY - rect.top;
  var dif = 0;
  var tmpTimes;
  var tmpField;
  switch (phase) {
    case phaseMenu:
      refreshArray(statusField); //statusField��������
      if (130 < x && x < 280 && 300 < y && y < 340) {
        phase = phaseGameCom;
        defineField();
        drawGame();
      } else if (300 < x && x < 450 && 300 < y && y < 340) {
        phase = phaseGame2P;
        defineField();
        newGame = 0;
        drawGame();
      }
      break;
    case phaseGameCom:
      for (var i = 0; i < 30; i++) {
        var cx = 300 + 180 * Math.cos(Math.PI / 15 * i);
        var cy = 220 + 180 * Math.sin(Math.PI / 15 * i);
        if ((cx - 12) < x && x < (cx + 12) && (cy - 12) < y && y < (cy + 12) && statusField[i] == 0) {
          statusField[i] = 2;
          if (checkFailure() == 1) {
            phase = phaseDeath;
          } else {
            enemyMove();
          }

          newGame = 0;
        }
      }
      if (newGame == 1 && 460 < x && x < 560 && 350 < y && y < 370) {
        enemyMove();
        newGame = 0;
      }
      drawGame();
      if (phase == phaseDeath) {
        writeText("Game over.", 240, 225, 30, color = "red");
      } else if (phase == phaseClear) {
        writeText("You win!", 240, 225, 30, color = "red");
      }
      break;
    case phaseGame2P:
      for (var i = 0; i < 30; i++) {
        var cx = 300 + 180 * Math.cos(Math.PI / 15 * i);
        var cy = 220 + 180 * Math.sin(Math.PI / 15 * i);
        if ((cx - 12) < x && x < (cx + 12) && (cy - 12) < y && y < (cy + 12) && statusField[i] == 0) {
          statusField[i] = hand;
          lastField = i;
          if (hand == 2) {
            hand = 3;
          } else {
            hand = 2;
          }
          if (checkFailure() == 1) {
            phase = phaseDeath;
          }

        }
      }
      drawGame();
      if (phase == phaseDeath) {
        if (hand == 2) {
          writeText("1P win.", 240, 225, 30, color = "blue");
        } else {
          writeText("2P win.", 240, 225, 30, color = "red");
        }
      }
      break;
    case phaseClear:
      break;
    case phaseDeath:
      break;
  }
}

//�����`���֐��Q
function refresh() {
  fillRect(0, 0, 600, 441, "#ffffff");
  strokeRect(0, 0, 600, 441);
  return 0;
}

function drawMenu() {
  refresh();
  writeText("Leave Me Alone with Firebase", 130, 100, 50);
  writeText("(c) 2019 kigisu", 470, 430, 20);
  return 0;
}

function defineField() {
  var tmpField;
  var tmpTimes = randomNum(8);
  for (var i = 0; i < tmpTimes;) {
    tmpField = randomNum(30) - 1;
    if (statusField[tmpField] == 0) {
      statusField[tmpField] = 1;
      i++;
    }
  }
  return 0;
}

function drawGame() {
  refresh();
  if (newGame == 1) {
    fillRect(460, 350, 100, 20);
    writeText("Pass", 490, 365, 20, "#ffffff");
  }
  for (var i = 0; i < 30; i++) {
    switch (statusField[i]) {
      case 0:
        strokeCirc(300 + 180 * Math.cos(Math.PI / 15 * i), 220 + 180 * Math.sin(Math.PI / 15 * i), 12);
        break;
      case 1:
        fillCirc(300 + 180 * Math.cos(Math.PI / 15 * i), 220 + 180 * Math.sin(Math.PI / 15 * i), 12);
        break;
      case 2:
        fillCirc(300 + 180 * Math.cos(Math.PI / 15 * i), 220 + 180 * Math.sin(Math.PI / 15 * i), 12, color = "blue");
        break;
      case 3:
        fillCirc(300 + 180 * Math.cos(Math.PI / 15 * i), 220 + 180 * Math.sin(Math.PI / 15 * i), 12, color = "red");
        break;
    }
    if (i == lastField) {
      strokeCirc(300 + 180 * Math.cos(Math.PI / 15 * i), 220 + 180 * Math.sin(Math.PI / 15 * i), 12, color = "green", width = 3);
    }
  }
  return 0;
}

function checkFailure() {
  var flag = 0;
  var sarogate;
  for (var i = 0; i < 30; i++) {
    if (i == 29) {
      sarogate = 0;
    } else {
      sarogate = i + 1;
    }
    if (statusField[i] != 0 && statusField[sarogate] != 0) {
      if (!(statusField[i] == 1 && statusField[sarogate] == 1)) {
        flag = 1;
      }
    }
  }
  return flag;
}

function enemyMove() {
  var check = [];
  var before;
  var after
  var flag = 0;
  var tmp;
  refreshArray(check);
  for (var i = 0; i < 30; i++) {
    if (i == 0) {
      before = 29;
      after = 1;
    } else if (i == 29) {
      before = 28;
      after = 0;
    } else {
      before = i - 1;
      after = i + 1;
    }
    if (statusField[before] == 0 && statusField[i] == 0 && statusField[after] == 0) {
      check[flag] = i;
      flag++;
    }
  }
  if (flag == 0) {
    phase = phaseClear;
  } else {
    tmp = randomNum(flag) - 1;
    statusField[check[tmp]] = 3;
    lastField = check[tmp];
  }
  return 0;
}



//���{�`���֐��Q
function strokeRect(sx, sy, dx, dy, color = "black", width = 1) {
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.rect(sx, sy, dx, dy);
  ctx.stroke();
  return 0;
}

function fillRect(sx, sy, dx, dy, color = "black") {
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.rect(sx, sy, dx, dy);
  ctx.fill();
  return 0;
}

function writeText(str, sx, sy, px = 20, color = "black") {
  var pa = px + "px 'Times New Roman'";
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.font = pa;
  ctx.fillText(str, sx, sy);
  return 0;
}

function strokeCirc(sx, sy, r, color = "black", width = 1) {
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.arc(sx, sy, r, 0, Math.PI * 2);
  ctx.stroke();
  return 0;
}

function fillCirc(sx, sy, r, color = "black") {
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.arc(sx, sy, r, 0, Math.PI * 2);
  ctx.fill();
  return 0;
}

//���̑����{�֐�
function randomNum(max) { //max�ȉ��̃����_���Ȏ��R�����Ԃ�
  var random = Math.ceil(Math.random() * max);
  return random;
}

function refreshArray(vec) {
  for (var i = 0; i < 100; i++) {
    vec[i] = 0;
  }
  return 0;
}

//written by @kigisu_qz on 181117
