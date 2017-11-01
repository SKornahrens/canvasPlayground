
//Canvas setup
var canvas = new fabric.Canvas('canvas')
var c = canvas.getContext('2d')
  canvas.setWidth(2000)
  canvas.setHeight(1000)

//requiring in Color.js
var Color = net.brehaut.Color;

$("#CutImageUp").on("click", function() {
  console.log("Cut Image Called");
  createSquares()
})

$("#GetImageData").on("click", function () {
  // c.putImageData(imagePieceData[49], 50, 50)
  GetImageData(imagePieceData)
})

//Given the image, create 100 40px by 40px squares
//for each iteration generates a Url to the locally stored image
//and produces Image data that can be used for comparison purposes
var image = new Image();
image.src = 'jptwo.jpg';
function createSquares() {
    for(var x = 0; x < 10; ++x) {
        for(var y = 0; y < 10; ++y) {
            var splitCanvas = document.createElement('canvas');
            splitCanvas.width = 40;
            splitCanvas.height = 40;
            var context = splitCanvas.getContext('2d');
            context.drawImage(image, x * 40, y * 40, 40, 40, 0, 0, splitCanvas.width, splitCanvas.height);
            getImagePieceUrls(splitCanvas.toDataURL());
            getImagePieceData(context.getImageData(0, 0, splitCanvas.width, splitCanvas.height))
        }
    }
}

//Used to store image Urls for placement
var imagePieceUrls = {};
var imageCount = 0
function getImagePieceUrls(image) {
  console.log("test");
  imagePieceUrls[imageCount] = {
    "url" : image,
    "dark_border" : [],
    "luminosityAverage" : undefined
  }
  imageCount++
}

//Used to store image data for comparison
var imagePieceData = [];
function getImagePieceData(data) {
  imagePieceData.push(data);
}

//Takes in array of images and finds the RGB values for each pixel of the image and
//finds the HSL for each pixel as well.
var count = 0
function GetImageData(images) {
  images.forEach((imageFound) => {
    pixelColorData[count] = []
    pixelLightnessData[count] = []
    for (var i = 0; i < imageFound.data.length; i+=4) {
      var tempData = []
      tempData.push(imageFound.data[i], imageFound.data[i + 1], imageFound.data[i + 2])
      var tempRGB = Color(tempData)
      populateColorArrays(tempRGB)
      // pixelColorData[count].push(tempRGB)
      // pixelLightnessData[count].push(tempRGB.toHSL().lightness)
    }
    count++
  })
}


var pixelColorData = {}
var pixelLightnessData = {}
function populateColorArrays(data) {
  pixelColorData[count].push(data)
  pixelLightnessData[count].push(data.toHSL().lightness)
}

//
// $("#GetImageData").on("click", function () {
//   console.log("Get Image Data Called");
//   c.putImageData(imagePieceData[49], 50, 50)
//   var data = imagePieceData[49].data
//     for (var i = 0; i < data.length; i+=4) {
//       var tempData = []
//       tempData.push(data[i], data[i+1], data[i+2])
//       var tempRGB = Color(tempData)
//       pixelColorData.push(tempRGB)
//       pixelLightnessData.push(tempRGB.toHSL().lightness)
//     }
//     getBorderData(pixelLightnessData)
// })




$("#getBorderData").on("click", function () {
  console.log(pixelLightnessData);
  console.log(Object.keys(pixelLightnessData))
  var keyOfLightData = Object.keys(pixelLightnessData)
  console.log(keyOfLightData);
  console.log();
  // pixelLightnessData.forEach((image) => {
  //   console.log(Object.keys(pixelLightnessData));
  for (var l = 0; l < keyOfLightData.length; l++) {
    getBorderData(pixelLightnessData[l]);
  }


    // getBorderData(pixelLightnessData[49])
})

var pixelBorderColors = {}
var borderCount = 0;
function getBorderData(data) {


  pixelBorderColors["top"] = []
  var sumTop = 0
  for (var i = 0; i <= 39; i++) {
      sumTop = sumTop + data[i]
  }
  pixelBorderColors["top"].push(sumTop / 40)

  pixelBorderColors["bottom"] = []
  var sumBottom = 0
  for (var j = 1560; j <= 1599; j++) {
    sumBottom = sumBottom + data[j]
  }
  pixelBorderColors["bottom"].push(sumBottom / 40)

  pixelBorderColors["left"] = []
  pixelBorderColors["right"] = []
  sumLeft = 0
  sumRight = 0
  for (var k = 0; k <=1560; k += 40) {
    sumLeft = sumLeft + data[k]
    sumRight = sumRight + data[k + 39]
  }
  pixelBorderColors["left"].push(sumLeft / 40)
  pixelBorderColors["right"].push(sumRight / 40)
  borderTagger(borderCount, sumTop, sumRight, sumBottom, sumLeft)
  borderCount++

}

function borderTagger(index, top, right, bottom, left) {
  var topAvg = top / 40 * 225
  var rightAvg = right / 40 * 225
  var bottomAvg = bottom / 40 * 225
  var leftAvg = left / 40 * 255
  if (50 > topAvg) {
    imagePieceUrls[index].dark_border.push("top")
  }
  if (50 > rightAvg) {
    imagePieceUrls[index].dark_border.push("right")
  }
  if (50 > bottomAvg) {
    imagePieceUrls[index].dark_border.push("bottom")
  }
  if (50 > leftAvg) {
    imagePieceUrls[index].dark_border.push("left")
  }
  // console.log(imagePieceUrls[49])
}
var countTop = 0
var countRight = 0
var countBottom = 0
var countLeft = 0
var countNoBorder = 0

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

$("#populateSort").on("click", function() {
  for (var o = 0; o < Object.keys(imagePieceUrls).length; o++) {
    if (imagePieceUrls[o].dark_border.length == []) {
      countNoBorder++
      var placeImage = imagePieceUrls[o].url
      console.log(placeImage);
      fabric.Image.fromURL(placeImage, function(oImg) {
        oImg.set('left', getRandomArbitrary(1200,2000))
        oImg.set('top', getRandomArbitrary(0,1000))
        canvas.add(oImg)
      })
    }
    for (var p = 0; p < imagePieceUrls[o].dark_border.length; p++) {
      if (imagePieceUrls[o].dark_border[p] === "top") {
        countTop++
        var placeImage = imagePieceUrls[o].url
        fabric.Image.fromURL(placeImage, function(oImg) {
          oImg.set('left', getRandomArbitrary(0,400))
          oImg.set('top', getRandomArbitrary(0,400))
          canvas.add(oImg)
        })
      }
      if (imagePieceUrls[o].dark_border[p] === "right") {
        countRight++
        var placeImage = imagePieceUrls[o].url
        fabric.Image.fromURL(placeImage, function(oImg) {
          oImg.set('left', getRandomArbitrary(600,1000))
          oImg.set('top', getRandomArbitrary(0,400))
          canvas.add(oImg)
        })
      }
      if (imagePieceUrls[o].dark_border[p] === "bottom") {
        countBottom++
        var placeImage = imagePieceUrls[o].url
        fabric.Image.fromURL(placeImage, function(oImg) {
          oImg.set('left', getRandomArbitrary(600,900))
          oImg.set('top', getRandomArbitrary(600,900))
          canvas.add(oImg)
        })
      }
      if (imagePieceUrls[o].dark_border[p] === "left") {
        countLeft++
        var placeImage = imagePieceUrls[o].url
        fabric.Image.fromURL(placeImage, function(oImg) {
          oImg.set('left', getRandomArbitrary(100,400))
          oImg.set('top', getRandomArbitrary(600,900))
          canvas.add(oImg)
        })
      }

    }
  }
  console.log("Top pieces: " + countTop);
  console.log("Right pieces: " + countRight);
  console.log("Bottom pieces: " + countBottom);
  console.log("Left pieces: " + countLeft);
  console.log("No border pieces: " + countNoBorder);
})

//Save drawn image
var imagePieceData
$("#SaveImage").on("click", function() {
  console.log("heard save");
  var DrawnCanvas = imagePieceUrls[49]
  var w=window.open('about:blank','image from canvas');
  w.document.write("<img src='"+DrawnCanvas+"' alt='from canvas'/>")
})

$("#getGrayScale").on("click", function() {
  console.log("heard grayscale");
  var data = imagePieceData[49].data
  for (var i = 0; i < data.length; i += 4) {
      var avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i]     = avg; // red
      data[i + 1] = avg; // green
      data[i + 2] = avg; // blue
  c.putImageData(imagePieceData[49], 50, 100)
  }
  console.log(imagePieceData[49]);
  console.log(imagePieceData[50]);
})
