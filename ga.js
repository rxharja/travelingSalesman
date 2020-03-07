let recordDistanceG = Infinity;
let bestEverG = orderG;
let currentBestG = orderG;


var genetic = function(sketch) {
  sketch.setup = function() {
    sketch.createCanvas(400,300);
    sketch.background(0);
    for (let i = 0; i < popSize; i++) {
      population[i] = sketch.shuffle(orderG);
    }
  }

  sketch.draw = function() {
    // console.log(noImprovementCount);
    sketch.calculateFitness();
    sketch.normalizeFitness();
    sketch.nextGeneration();
    sketch.background(0);
    sketch.fill(255);
    for (let i = 0; i < citiesG.length; i++) {
      sketch.ellipse(citiesG[i].x, citiesG[i].y,8,8);
    }

    sketch.stroke(255,22,84);
    sketch.strokeWeight(4);
    sketch.beginShape();
    sketch.noFill();
    for (let i = 0; i < bestEverG.length; i++) {
      let n = bestEverG[i];
      sketch.vertex(citiesG[n].x,citiesG[n].y);
    }
    sketch.endShape();

    sketch.stroke(255);
    sketch.strokeWeight(1);
    sketch.beginShape();
    sketch.noFill();
    for (let i = 0; i < currentBestG.length; i++) {
      let n = currentBestG[i];
      console.log(n);
      sketch.vertex(citiesG[n].x,citiesG[n].y);
    }
    sketch.endShape();

    if (noImprovementCount > 5000) {
      sketch.noLoop();
      console.log("Finished");
    }
    }

  sketch.calcDistance = function(points,orderG) {
    var sum = 0;
    for (let i = 0; i < orderG.length-1; i++) {
      let indexA = orderG[i];
      let indexB = orderG[i+1];
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

      let d = sketch.calcDistance(citiesG, population[i]);
      if (d < recordDistanceG) {
        recordDistanceG = d;
        bestEverG = population[i];
        noImprovementCount = 0;
      }
      if (d < currentRecord) {
        currentRecord = d;
        currentBestG = population[i];
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
      let orderGA = sketch.pickOne(population, fitness);
      // let orderGB = pickOne(population, fitness);
      // let orderG = crossOver(orderGA, orderGB);
      sketch.mutate(orderGA,0.15);
      newPopulation[i] = orderGA;
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

  sketch.mutate = function(orderG, mutationRate) {
    for (var i = 0; i < citiesG.length; i++) {
      if (mutationRate > sketch.random(1)) {
        var indexA = sketch.floor(sketch.random(orderG.length));
        var indexB = indexA+1;
        if (indexB >= citiesG.length) {
          indexB = indexA-1;
        }
        sketch.swap(orderG, indexA, indexB);
      }
    }
  }

  //not really working, not applicable too much to this problem
  // function crossOver(orderGA,orderGB) {
  //   const start = floor(random(orderGA.length));
  //   const end = floor(random(start,orderGA.length));
  //   const neworderG = orderGA.slice(start,end);
  //   let left = citiesG.length - neworderG.length;
  //   for (let i = 0; i < orderGB.length; i++) {
  //     if (left <= 0) {
  //       break;
  //     }
  //     let city = orderGB[i];
  //     if (!neworderG.includes(city)) {
  //        neworderG.push(city);
  //     }
  //     left--;
  //   }
  //   return neworderG;
  // }
}
var c1 = new p5(genetic,'third-sketch-container');
