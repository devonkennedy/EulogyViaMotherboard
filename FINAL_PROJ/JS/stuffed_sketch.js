//-------------------------------------------------------------------------------------------
// STUFFED ANIMAL POCKET SHRINE!
//-------------------------------------------------------------------------------------------
//Variables
var canvas, offeringBox1, picnicScene, food, border, aap, cloud;
var jellycat, rabbit1, sloth, rabbit2;
var squeak, timer;
var randomY = [];
var randomX = [];
var randomSine = [];
function preload() {
  //Audio loading
  soundFormats("mp3", "ogg", "wav");
  squeak = loadSound("../Assets/animalShrine/squeak.mp3");
}
function setup() {
  //Canvas creation
  canvas = createCanvas(windowWidth, 1000);
  canvas.position(0, 400);
  canvas.style("z-index", "1");

  //Offering box
  offeringBox1 = new offeringBox(width, height);

  //Image loading
  food = loadImage("../Assets/animalShrine/picnic_food.png");
  picnicScene = loadImage("../Assets/animalShrine/picnic_scene_bl.gif");
  border = loadImage("../Assets/animalShrine/border.png");
  cloud = loadImage("../Assets/animalShrine/12.png");
  jellycat = new stuffedAnimal(
    width / 2 - 350,
    height / 2 + 120,
    "../Assets/animalShrine/jellycatR.png",
    "../Assets/animalShrine/jellycatL.png"
  );
  rabbit1 = new stuffedAnimal(
    width / 2 + 250,
    height / 2 + 90,
    "../Assets/animalShrine/rabbit1R.png",
    "../Assets/animalShrine/rabbit1L.png"
  );
  sloth = new stuffedAnimal(
    width / 2 - 30,
    height / 2 - 1,
    "../Assets/animalShrine/slothR.png",
    "../Assets/animalShrine/slothL.png"
  );
  rabbit2 = new stuffedAnimal(
    width / 2 - 500,
    height / 2 + 170,
    "../Assets/animalShrine/rabbit2R.png",
    "../Assets/animalShrine/rabbit2L.png"
  );

  //Var setting
  timer = 0;
  for (var i = 0; i < 4; i++) {
    randomY.push(random(100, 400));
    randomX.push(random(-50, 50));
    randomSine.push(random(-5, 5));
  }
}

function draw() {
  //Animation
  var sineAnim = map(sin(timer / 20), -1, 1, -10, 10);
  timer += 1;

  //Makes overlay bg transparent
  clear();

  //Img drawing
  for (var i = 0; i < 4; i++) {
    image(
      cloud,
      180 + ((width - 200) / 4) * i + randomX[i],
      randomY[i] + sineAnim * randomSine[i]
    );
  }
  jellycat.draw();
  rabbit1.draw();
  sloth.draw();
  rabbit2.draw();
  image(food, width / 2 - food.width / 2.1, height / 2 - food.height / 2.4);
  push();
  scale(1.4, 0.9);
  image(border, 50, 100);
  pop();
  offeringBox1.draw();

  //Custom cursor
  cursor("../Assets/mouse.png");
}

function windowResized() {
  resizeCanvas(windowWidth, 2000);
}

//Drag interaction logic
function mousePressed() {
  jellycat.dragging(mouseX, mouseY);
  rabbit1.dragging(mouseX, mouseY);
  sloth.dragging(mouseX, mouseY);
  rabbit2.dragging(mouseX, mouseY);
  offeringBox1.mouseInteraction(mouseX, mouseY);
  offeringBox1.selectFlower(mouseX, mouseY);
}
function mouseReleased() {
  jellycat.isDragged = false;
  rabbit1.isDragged = false;
  sloth.isDragged = false;
  rabbit2.isDragged = false;
}

//Stuffed animal class
class stuffedAnimal {
  constructor(xpos, ypos, imgPathR, imgPathL) {
    this.x_pos = xpos;
    this.y_pos = ypos;
    this.isRight = true;
    this.isDragged = false;
    this.Rimg = loadImage(imgPathR);
    this.Limg = loadImage(imgPathL);
  }
  draw() {
    if (this.x_pos > width / 2 - this.Rimg.width / 2) {
      image(this.Limg, this.x_pos, this.y_pos);
    }
    if (this.x_pos < width / 2 - this.Rimg.width / 2) {
      image(this.Rimg, this.x_pos, this.y_pos);
    }

    if (this.isDragged == true) {
      this.x_pos = mouseX - this.Rimg.width / 2;
      this.y_pos = mouseY - this.Rimg.height / 2;
    }
  }
  dragging(mouseX, mouseY) {
    if (
      mouseX > this.x_pos &&
      mouseX < this.x_pos + this.Rimg.width &&
      mouseY > this.y_pos &&
      mouseY < this.y_pos + this.Rimg.height
    ) {
      squeak.play();
      this.isDragged = true;
    }
  }
}
