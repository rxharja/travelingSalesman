//requires p5.js to visualize and run
let iterations = 0;
let recordDistanceR;

var rand = function(sketch) {
   sketch.setup = function() {
    sketch.createCanvas(400,300);
    for (let i = 0; i < totalCities; i++) {
      let v = sketch.createVector(sketch.random(sketch.width),sketch.random(sketch.height))
      citiesR[i] = v;
      citiesL[i] = v;
      citiesG[i] = v;
      orderL.push(i);
      orderG.push(i);
    }

    let d = sketch.calcDistance(citiesR);
    recordDistanceR = d;
    bestEverR = citiesR.slice();
  }

  sketch.draw = function() {
    if (iterations > 5000) {
      sketch.noLoop();
    }

    sketch.background(0,0,0);
    sketch.fill(255);
    for (let i = 0; i < citiesR.length; i++) {
      sketch.ellipse(citiesR[i].x, citiesR[i].y,8,8);
    }

    sketch.stroke(255);
    sketch.strokeWeight(1);
    sketch.beginShape();
    sketch.noFill();
    for (let i = 0; i < citiesR.length; i++) {
      sketch.vertex(citiesR[i].x,citiesR[i].y);
    }
    sketch.endShape();

    sketch.stroke(36,123,160);
    sketch.strokeWeight(4);
    sketch.beginShape();
    sketch.noFill();
    for (let i = 0; i < bestEverR.length; i++) {
      sketch.vertex(bestEverR[i].x,bestEverR[i].y);
    }
    sketch.endShape();

    let i = sketch.floor(sketch.random(citiesR.length));
    let j = sketch.floor(sketch.random(citiesR.length));
    sketch.swap(citiesR,i,j);

    let d = sketch.calcDistance(citiesR);
    if (d < recordDistanceR) {
      recordDistanceR = d;
      bestEverR = citiesR.slice();
    }
  }

  sketch.swap = function(a,i,j) {
    let temp = a[i];
    a[i] = a[j];
    a[j] = temp;
  }

  sketch.calcDistance = function(points) {
    let sum = 0;
    for (let i = 0; i < points.length-1; i++) {
      let d = sketch.dist(points[i].x,points[i].y,points[i+1].x,points[i+1].y);
      sum += d;
    }
    return sum;
  }
}

var c1 = new p5(rand,'first-sketch-container');
