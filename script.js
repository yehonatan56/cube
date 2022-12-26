const slidesNames = ['top', 'bottom', 'right', 'left', 'front', 'back']
document.querySelector('.uploadBtn').addEventListener('click', function () {
  $(".urls").attr("type", "file");
  resetinput();
})

document.querySelector('.writeBtn').addEventListener('click', function () {
  $(".urls").attr("type", "text");
  resetinput();
})

function resetinput() {
  for (const item of slidesNames) {
    let statusId = 'status' + item.charAt(0).toUpperCase() + item.slice(1) + 'Url';
    document.getElementById(statusId).innerHTML = '❌';
    document.getElementById(statusId).style.color = 'red';
  }
}

let warning = document.querySelector(".warning");
let uploadObject;
let paramsObjects = {
  topUrl: document.getElementById("topUrl"),
  bottomUrl: document.getElementById("bottomUrl"),
  rightUrl: document.getElementById("rightUrl"),
  leftUrl: document.getElementById("leftUrl"),
  backUrl: document.getElementById("backUrl"),
  frontUrl: document.getElementById("frontUrl"),
}
const slides = [paramsObjects.topUrl, paramsObjects.bottomUrl, paramsObjects.rightUrl, paramsObjects.leftUrl, paramsObjects.backUrl, paramsObjects.frontUrl];
let urls = [{ fileName: '' }];
let checkAll = false;
for (let item of slides) {
  item.addEventListener('change', function () {
    switch (item.type) {
      case 'file':
        for (const fileObject of urls) {
          if (item.files[0].name == fileObject.fileName) {
            warning.style.visibility = "visible";
            warningEvents(item, fileObject, item.id);
            checkAll = true;
          }
        }
        if (!checkAll) {
          uploadImageF(item);
          //break;
        }
        break;

      case 'text':
        let urlValid = new URL(item.value);
        if (urlValid) {
          enableNextInput(slides, item);
        }
        break;
    }


  })
}

function uploadImageF(item) {
  var file = item;
  var form = new FormData();
  form.append("image", file.files[0])

  var settings = {
    "url": "https://api.imgbb.com/1/upload?key=779f7ba5324921e9e27a236f44447fc3",
    "method": "POST",
    "timeout": 0,
    "processData": false,
    "mimeType": "multipart/form-data",
    "contentType": false,
    "data": form
  };


  $.ajax(settings).done(function (response) {
    console.log(response);
    var jx = JSON.parse(response);
    console.log(jx.data.url);

    uploadObject = {
      id: item.id,
      url: jx.data.url,
      fileName: jx.data.image.filename,
    }
    urls.push(uploadObject);
  });

  console.log(item.id);
  enableNextInput(slides, item);

}


function enableNextInput(slides, item) {
  let statusId = 'status' + item.id.charAt(0).toUpperCase() + item.id.slice(1);
  document.getElementById(statusId).innerHTML = '✔';
  document.getElementById(statusId).style.color = 'green';

  for (let index = 0; index < slides.length; index++) {
    if (slides[index].id === item.id) {
      slides[index + 1].style.userSelect = "all";
      slides[index + 1].style.pointerEvents = "all";
    }

  }
}
// warning 


function warningEvents(item, fileObject, id) {
  let warning_yes = document.getElementById("warning-yes");
  let warning_no = document.getElementById("warning-no");


  warning_yes.addEventListener('click', (e) => {
    e.preventDefault();
    uploadImageF(item);
    warning.style.visibility = "hidden";
    enableNextInput(slides, item);

  })
  warning_no.addEventListener('click', (e) => {
    e.preventDefault();
    // fileObject.id = id;
    urls.push({
      id: id,
      url: fileObject.url,
      fileName: fileObject.fileName,
    });
    console.log(urls);
    warning.style.visibility = "hidden";
    enableNextInput(slides, item);

  })
}



let copyBtn = document.querySelector(".copyBtn");
document.querySelector(".createShortCodeBtn").addEventListener('click', create);
document.querySelector(".createCodeBtn").addEventListener('click', create);
function create(button) {
  let params = {
    topUrl: document.getElementById("topUrl").value,
    bottomUrl: document.getElementById("bottomUrl").value,
    rightUrl: document.getElementById("rightUrl").value,
    leftUrl: document.getElementById("leftUrl").value,
    backUrl: document.getElementById("backUrl").value,
    frontUrl: document.getElementById("frontUrl").value,
    width: document.getElementById("width").value,
    borderSize: document.getElementById("borderSize").value,
    borderColor: document.getElementById("borderColor").value,
    speed: document.getElementById("speed").value,
    rx: document.getElementById("rx").value,
    ry: document.getElementById("ry").value,
    rz: document.getElementById("rz").value,

    createShortCode: function () {
      let shortcode = `
     [show-custom-animation width="${this.width}"  animation_speed="${this.speed}" cube_background_color="transparent" animation_rotatex=${this.rx} animation_rotatey=${this.ry} animation_rotatez=${this.rz}  cube_face_top_image_url="${this.topUrl}" cube_face_right_image_url="${this.rightUrl}" cube_face_bottom_image_url="${this.bottomUrl}" cube_face_left_image_url="${this.leftUrl}" cube_face_back_image_url="${this.backUrl}" cube_face_front_image_url="${this.frontUrl}" cube_border_size=${this.borderSize} cube_border_color="${this.borderColor}" ]
      `;
      document.querySelector(".result").innerHTML = shortcode;


    },



    createCode: function () {
      let code = `
      <div class="cube"  >
      <div class="top"></div>
      <div class="right"></div>
      <div class="left"></div>
      <div class="bottom"></div>
      <div class="front"></div>
      <div class="back"></div>
</div>

<style>
.cube {
  width: ${this.width}px;
  height: ${this.width}px;
  backface-visibility: hidden;
  transform-style: preserve-3d;
  animation: rotate ${this.speed}s infinite linear;
}
@keyframes rotate {
  to {
    transform: rotateX(${this.rx}deg) rotateY(${this.ry}deg) rotateZ(${this.rz}deg);
  }
}

.cube > div {
  position: absolute;
  width: inherit;
  height: inherit;
  border: ${this.borderSize}px solid ${this.borderColor};
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}

.bottom {
  background-image: url("${this.bottomUrl}");
}
.right {
  background-image: url("${this.rightUrl}");
}
.front {
  background-image: url("${this.frontUrl}");
}
.back {
  background-image: url("${this.backUrl}");
}
.left {
  background-image: url("${this.leftUrl}");
}
.top {
  background-image: url("${this.topUrl}");
}

</style>
      `;
      document.querySelector(".result").textContent = code;
    }
  }

  if ($(".urls").attr("type") == "file") {
    try {
      for (let index = 0; index < 6; index++) {
        let id = urls[index].id;
        let url = urls[index].url;
        params[id] = url;
        console.log(params);
      }
    } catch (error) {
      console.error(error);
    }
  }

  if (button.target.className == "createShortCodeBtn") {
    params.createShortCode();
  } else {
    params.createCode();
  }
  copyBtn.style.display = 'block';
}
copyBtn.addEventListener('click', copy);
function copy() {
  // Get the text field
  var copyText = document.querySelector(".result");

  var range = document.createRange();
  range.selectNode(copyText);
  window.getSelection().removeAllRanges(); // clear current selection
  window.getSelection().addRange(range); // to select text
  document.execCommand("copy");
  window.getSelection().removeAllRanges();// to deselect
}

function incrementValue(e) {
  e.preventDefault();
  var fieldName = $(e.target).data('field');
  var parent = $(e.target).closest('div');
  var currentVal = parseInt(parent.find('input[name=' + fieldName + ']').val(), 10);

  if (!isNaN(currentVal)) {
    parent.find('input[name=' + fieldName + ']').val(currentVal + 1);
  } else {
    parent.find('input[name=' + fieldName + ']').val(0);
  }
}

function decrementValue(e) {
  e.preventDefault();
  var fieldName = $(e.target).data('field');
  var parent = $(e.target).closest('div');
  var currentVal = parseInt(parent.find('input[name=' + fieldName + ']').val(), 10);

  if (!isNaN(currentVal) && currentVal > 0) {
    parent.find('input[name=' + fieldName + ']').val(currentVal - 1);
  } else {
    parent.find('input[name=' + fieldName + ']').val(0);
  }
}

$('.input-group').on('click', '.button-plus', function (e) {
  incrementValue(e);
});

$('.input-group').on('click', '.button-minus', function (e) {
  decrementValue(e);
});
