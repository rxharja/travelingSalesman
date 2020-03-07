let recordDistanceL = Infinity;
let countL = 0;
let bestEverL = orderL;

var lexico = function(sketch) {

  sketch.setup = function() {
    sketch.createCanvas(400,300);
    sketch.background(0);
  }

  sketch.draw = function() {
    sketch.background(0);
    sketch.fill(255);
    for (let i = 0; i < citiesL.length; i++) {
      sketch.ellipse(citiesL[i].x, citiesL[i].y,8,8);
    }

    sketch.stroke(243,255,189);
    sketch.strokeWeight(4);
    sketch.beginShape();
    sketch.noFill();

    for (var i = 0; i < bestEverL.length; i++) {
      var n = bestEverL[i];
      sketch.vertex(citiesL[n].x,citiesL[n].y);
    }
    sketch.endShape();
    sketch.stroke(255);
    sketch.strokeWeight(1);
    sketch.beginShape();
    sketch.noFill();
    for (let i = 0; i < orderL.length; i++) {
      let n = orderL[i];
      sketch.vertex(citiesL[n].x,citiesL[n].y);
    }
    sketch.endShape();

    var d = sketch.calcDistance(citiesL,orderL);
    if (d < recordDistanceL) {
      recordDistanceL = d;
      bestEverL = orderL.slice();
    }

    sketch.nextorderL();
  }

  sketch.nextorderL = function() {
    let largestI = -1;
    for (let i = 0; i < orderL.length - 1; i++) {
      if (orderL[i] < orderL[i+1]) {
        largestI = i;
      }
    }
    if (largestI !== -1) {
      let largestJ = -1;
      for (let j = 0; j < orderL.length; j++) {
        if (orderL[largestI] < orderL[j]) {
          largestJ = j;
        }
      }
      sketch.swap(orderL,largestI,largestJ);
      const endArr = orderL.splice(largestI+1);
      endArr.reverse();
      orderL = orderL.concat(endArr);
    } else {
      sketch.noLoop();
    }
  }

  sketch.swap = function(a,i,j) {
    var temp = a[i];
    a[i] = a[j];
    a[j] = temp;
  }

  sketch.calcDistance = function(points,orderL) {
    var sum = 0;
    for (let i = 0; i < orderL.length-1; i++) {
      let indexA = orderL[i];
      let indexB = orderL[i+1];
      let cityA = points[indexA];
      let cityB = points[indexB];
      let d = sketch.dist(cityA.x,cityA.y,cityB.x,cityB.y);
      sum += d;
    }
    return sum;
  }
}

var c2 = new p5(lexico,'second-sketch-container');
