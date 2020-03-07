let started = true;
let citiesR = [];
let citiesL = [];
let citiesG = [];
let orderL = [];
let orderG = [];
let totalCities = 10;
let popSize = 5000;
let count = 0;
let population = [];
let fitness = [];
let generations = 0;
let noImprovementCount = 0;

var interactiveSketch = function(sketch) {
  var slider1 = document.getElementById("myRange1");
  var output1 = document.getElementById("slider-value1");
  output1.innerHTML = slider1.value; // Display the default slider value
  var slider2 = document.getElementById("myRange2");
  var output2 = document.getElementById("slider-value2");
  output2.innerHTML = slider2.value; // Display the default slider value

  let started = false;
  let cities = [];
  let order = [];
  let totalCities = slider2.value;
  let popSize = slider1.value;
  let count = 0;
  let population = [];
  let fitness = [];
  let noImprovementCount = 0;
  let bestEver = order;
  let recordDistance = Infinity

  // Update the current slider value (each time you drag the slider handle)
  slider1.oninput = function() {
    output1.innerHTML = this.value;
  }
  slider2.oninput = function() {
    output2.innerHTML = this.value;
  }
  sketch.setup = function(){
    var canvasDiv = document.getElementById('fourth-sketch-container');
    var width = canvasDiv.offsetWidth;
    var sketchCanvas = sketch.createCanvas(width,450);
    sketchCanvas.parent("interactive");
    sketch.background(0);
    sketch.noLoop();
  }

  sketch.randomCities = function() {
    sketch.reset();
    for (let i = 0; i < totalCities; i++) {
      v = sketch.createVector(sketch.random(sketch.width),sketch.random(sketch.height));
      cities.push(v);
      order.push(i);
    }
    sketch.start();
  }

  sketch.start = function() {
    if (cities.length > 1) {
      for (let i = 0; i < popSize; i++) {
        population[i] = sketch.shuffle(order);
      }
      started = true;
      sketch.loop();
    }
  }

  sketch.mouseClicked = function() {
    if ((started == false) &&
        (sketch.mouseX <= sketch.width && sketch.mouseX >= 0 && sketch.mouseY <= sketch.height && sketch.mouseY >= 0)) {
      sketch.fill(255);
      v = sketch.createVector(sketch.mouseX,sketch.mouseY);
      sketch.ellipse(sketch.mouseX, sketch.mouseY, 8, 8);
      cities.push(v);
      order.push(count);
      count++;
      // prevent default
      return false;
    }
  }

  sketch.reset = function() {
    started = false;
    sketch.clear();
    sketch.setup();
    count = 0;
    cities = [];
    order = [];
    population = [];
    fitness = [];
    recordDistance = Infinity;
    bestEver = null;
    currentBest = null;
    generations = 0;
    totalCities = slider2.value;
    popSize = slider1.value;
    sketch.noLoop();
  }

  sketch.draw = function() {
    if (started === true) {
      sketch.calculateFitness();
      sketch.normalizeFitness();
      sketch.nextGeneration();

      sketch.background(0);

      sketch.fill(255);
      for (let i = 0; i < cities.length; i++) {
        sketch.ellipse(cities[i].x, cities[i].y,8,8);
      }

      sketch.stroke("#70C1B3");
      sketch.strokeWeight(4);
      sketch.beginShape();
      sketch.noFill();
      for (let i = 0; i < bestEver.length; i++) {
        let n = bestEver[i];
        sketch.vertex(cities[n].x,cities[n].y);
      }
      sketch.endShape();

      // stroke(255);
      // strokeWeight(1);
      // beginShape();
      // noFill();
      // for (let i = 0; i < currentBest.length; i++) {
      //   let n = currentBest[i];
      //   vertex(cities[n].x,cities[n].y);
      // }
      // endShape();
    }
      if (noImprovementCount > 5000) {
        sketch.noLoop();
        console.log("Finished");
      }
  }

  sketch.calcDistance = function(points,order) {
    var sum = 0;
    for (let i = 0; i < order.length-1; i++) {
      let indexA = order[i];
      let indexB = order[i+1];
      let cityA = points[indexA];
      let cityB = points[indexB];
      let d = sketch.dist(cityA.x,cityA.y,cityB.x,cityB.y);
      sum += d;
    }
    return sum;
  }

  sketch.swap = function(a,i,j) {
    var temp = a[i];
    a[i] = a[j];
    a[j] = temp;
  }

  sketch.calculateFitness = function() {
    noImprovementCount++;
    let currentRecord = Infinity;
    for (let i = 0; i < population.length; i++) {
      let d = sketch.calcDistance(cities, population[i]);
      if (d < recordDistance) {
        recordDistance = d;
        bestEver = population[i];
        noImprovementCount = 0;
      }
      if (d < currentRecord) {
        currentRecord = d;
        currentBest = population[i];
      }
      fitness[i] = 1 / (d*d+1);
    }
  }

  sketch.normalizeFitness = function() {
    let sum = 0;
    for (let i = 0; i < fitness.length; i++) {
      sum += fitness[i];
    }
    for (let i = 0; i < fitness.length; i++) {
      fitness[i] = fitness[i] / sum;
    }
  }

  sketch.nextGeneration = function() {
    let newPopulation = [];
    for (let i = 0; i < population.length; i++) {
      newPopulation[i] = population[i].slice();
      let orderA = sketch.pickOne(population, fitness);
      // let orderB = pickOne(population, fitness);
      // let order = crossOver(orderA, orderB);
      sketch.mutate(orderA,0.15);
      newPopulation[i] = orderA;
      generations++;
    }
    population = newPopulation;
  }

  sketch.pickOne = function(list, prob) {
    let index = 0;
    let r = sketch.random(1);

    while (r > 0) {
      r = r - prob[index];
      index++;
    }
    index--;
    return list[index].slice();
  }

  sketch.mutate = function(order, mutationRate) {
    for (var i = 0; i < cities.length; i++) {
      if (mutationRate > sketch.random(1)) {
        var indexA = sketch.floor(sketch.random(order.length));
        var indexB = indexA+1;
        if (indexB >= cities.length) {
          indexB = indexA-1;
        }
        sketch.swap(order, indexA, indexB);
      }
    }
  }

  //not really working, not applicable too much to this problem
  // function crossOver(orderA,orderB) {
  //   const start = floor(random(orderA.length));
  //   const end = floor(random(start,orderA.length));
  //   const newOrder = orderA.slice(start,end);
  //   let left = cities.length - newOrder.length;
  //   for (let i = 0; i < orderB.length; i++) {
  //     if (left <= 0) {
  //       break;
  //     }
  //     let city = orderB[i];
  //     if (!newOrder.includes(city)) {
  //        newOrder.push(city);
  //     }
  //     left--;
  //   }
  //   console.log(newOrder);
  //   return newOrder;
  // }
}

var interactive = new p5(interactiveSketch,'fourth-sketch-container');
