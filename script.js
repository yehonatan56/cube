const slidesNames = ['top', 'bottom', 'right', 'left', 'front', 'back']
document.querySelector('.uploadBtn').addEventListener('click', function () {
  $(".urls").attr("type", "file");
})

document.querySelector('.writeBtn').addEventListener('click', function () {
  $(".urls").attr("type", "text");
})

let uploadObject;
let paramsObjects = {
  topUrl: document.getElementById("topUrl"),
  bottomUrl: document.getElementById("bottomUrl"),
  rightUrl: document.getElementById("rightUrl"),
  leftUrl: document.getElementById("leftUrl"),
  backUrl: document.getElementById("backUrl"),
  frontUrl: document.getElementById("frontUrl"),
}
const slides = [paramsObjects.topUrl, paramsObjects.bottomUrl, paramsObjects.leftUrl, paramsObjects.rightUrl, paramsObjects.frontUrl, paramsObjects.backUrl];
let urls = [];
for (let item of slides) {
  item.addEventListener('change', function () {
    uploadImageF(item);
    console.log(urls);
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
      url: jx.data.url
    }
    urls.push(uploadObject);
  });


  // item.id = object key



}


let copyBtn = document.querySelector(".copyBtn");
document.querySelector(".createBtn").addEventListener('click', create);
function create() {
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

  let shortcode = `
    [show-custom-animation width="${params.width}"  animation_speed="${params.speed}" cube_background_color="transparent" animation_rotatex=${params.rx} animation_rotatey=${params.ry} animation_rotatez=${params.rz}  cube_face_top_image_url="${params.topUrl}" cube_face_right_image_url="${params.rightUrl}" cube_face_bottom_image_url="${params.bottomUrl}" cube_face_left_image_url="${params.leftUrl}" cube_face_back_image_url="${params.backUrl}" cube_face_front_image_url="${params.frontUrl}" cube_border_size=${params.borderSize} cube_border_color="${params.borderColor}" ]
    `;
  document.querySelector(".shortcode").innerHTML = shortcode;
  copyBtn.style.display = 'block';

  copyBtn.addEventListener('click', copy);
  function copy() {
    // Get the text field
    var copyText = document.querySelector(".shortcode");

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
}