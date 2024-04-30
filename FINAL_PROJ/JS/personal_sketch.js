//-------------------------------------------------------------------------------------------
// PERSONAL SHRINE PAGE
//-------------------------------------------------------------------------------------------
//Variables
var canvas, offeringBox1;
var locket, chain, bow;
var chosenSound;
var timer;
var heartImages = [];
var imgArray = [];
var laceDrip = [];
var clickHere, decorativeArrow;
function setup() {
  //Canvas logic
  canvas = createCanvas(windowWidth, 2400);

  //Image loading
  locket = loadImage("../Assets/meShrine/locket2.gif");
  chain = loadImage("../Assets/meShrine/chain.png");
  bow = loadImage("../Assets/meShrine/bow.png");
  clickHere = loadImage("../Assets/click_here.png");
  decorativeArrow = loadImage("../Assets/main_page/arrow.png");

  //Offering box
  offeringBox1 = new offeringBox(width, height);

  //Initialise variables
  timer = 0;
  var padding = 150;

  //Sound + heart loading from folder.
  chosenSound = loadSound("../Assets/meShrine/ping.wav");
  for (i = 1; i < 29; i++) {
    path = "../Assets/meShrine/hearts/" + str(i) + ".png"; // create a path to the image
    heartImages.push(path);
  }

  //Shuffle heart array
  shuffle(heartImages, true);

  // Pushing grid of hearts
  for (let i = 0; i < 4; i++) {
    for (let v = 0; v < 7; v++) {
      imgArray.push(
        new heartPic(
          heartImages[i + 4 * v],
          ((windowWidth - padding) / 5) * i + padding + 60,
          560 + v * 250
        )
      );
    }
  }

  //Particle system
  laceDrip.push(new laceParticle());
}

function draw() {
  //Animatons
  timer += 1;
  var sineAnim = sin(timer / 10);
  var sineAnimMap = map(sin(timer / 20), -1, 1, -10, 10);

  //Clear bg for transparent overlay
  clear();

  //Custom cursor
  cursor("../Assets/main_page/crochet.png");

  //Img drawing
  push();
  tint("white");
  image(chain, width / 2 - chain.width / 2, -100);
  image(locket, width / 2 - locket.width / 2 - 70, 300);

  image(bow, width / 9, 20 + 10 * sineAnim);
  image(bow, width - width / 9 - bow.width, 20 + 10 * sineAnim);

  image(clickHere, width - 5 - clickHere.width, height - 170 + sineAnimMap / 2);
  image(
    decorativeArrow,
    width - clickHere.width + 45,
    height - 110 + sineAnimMap / 2
  );

  pop();

  for (var i = 0; i < imgArray.length; i++) {
    imgArray[i].draw();
    imgArray[i].animate();
  }

  //Offering box
  offeringBox1.draw();

  //Particle system
  for (var i = 0; i < laceDrip.length; i++) {
    laceDrip[i].show();
    laceDrip[i].update();

    if (laceDrip[i].remove()) {
      laceDrip.splice(i, 1);
      console.log("particle removed!");
    }
  }

  if (timer % 20 == 0) {
    laceDrip.push(new laceParticle());
    console.log(laceDrip);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, 2000);
}

function mousePressed() {
  for (var i = 0; i < imgArray.length; i++) {
    if (imgArray[i].remove()) {
      chosenSound.play();
      imgArray.splice(i, 1);
    }
  }
  offeringBox1.mouseInteraction(mouseX, mouseY);
  offeringBox1.selectFlower(mouseX, mouseY);
}

//Lace particle system
class laceParticle {
  constructor() {
    this.x = random(0, windowWidth);
    this.y = 0;
    this.vy = random(6, 3);
    this.crochetPic = loadImage("../Assets/meShrine/heart_crochet.png");
  }
  show() {
    image(
      this.crochetPic,
      this.x - this.crochetPic.width / 2,
      this.y - this.crochetPic.height / 2
    );
  }
  update() {
    this.y += this.vy;
  }

  remove() {
    return this.y >= height;
  }
}

//Heart images
class heartPic {
  constructor(img, x_pos, y_pos) {
    this.x = x_pos;
    this.y = y_pos;
    this.pic = loadImage(img);
    this.mouseHover = false;
    this.imgX = this.x - this.pic.width / 2;
    this.imgY = this.y - this.pic.height / 2;
  }
  draw() {
    tint("white");
    image(this.pic, this.x, this.y);
  }
  animate() {
    if (
      mouseX > this.imgX &&
      mouseX < this.imgX + this.pic.width &&
      mouseY > this.imgY &&
      mouseY < this.imgY + this.pic.height
    ) {
      this.mouseHover = true;
    } else {
      this.mouseHover = false;
    }
  }
  remove() {
    return this.mouseHover;
  }
}
