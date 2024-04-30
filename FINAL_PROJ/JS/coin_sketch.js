//-------------------------------------------------------------------------------------------
// COIN SHRINE
//-------------------------------------------------------------------------------------------
//Variables
var canvas, offeringBox1;
var piggybank, bgImg, overlayImg, timer, clickHere, decorativeArrow;
var coinArray = [];
var coinImages = [];
var coinSounds = [];
var coinDrip = [];

function preload() {
  //Sound loading
  coinSounds.push(
    loadSound("../Assets/coinShrine/coin1.mp3"),
    loadSound("../Assets/coinShrine/coin2.mp3"),
    loadSound("../Assets/coinShrine/coin3.mp3"),
    loadSound("../Assets/coinShrine/coin4.mp3")
  );
}
function setup() {
  //Canvas logic
  canvas = createCanvas(windowWidth, 1500);

  //Variable initialising
  timer = 0;
  var padding = 170;

  //Gif loading
  piggybank = loadImage("../Assets/coinShrine/piggy.gif");

  //Loading gif from folder
  for (i = 1; i < 40; i++) {
    path = "../Assets/coinShrine/resized_coins/" + str(i) + ".gif";
    coinImages.push(path);
  }

  //Shuffle array
  shuffle(coinImages, true);

  //Draw grid of coins
  for (let v = 0; v < 7; v++) {
    for (let i = 0; i < 6; i++) {
      let index = (i + 6 * v) % coinImages.length;
      coinArray.push(
        new coinGif(
          coinImages[index],
          ((windowWidth - padding) / 7) * i + padding + 30,
          210 + 160 * v
        )
      );
    }
  }

  // Fills grid to even n.o.
  if (coinArray.length < 42) {
    let additionalCoins = 42 - coinArray.length;
    for (let i = 0; i < additionalCoins; i++) {
      let index = i % coinImages.length;
      coinArray.push(
        new coinGif(
          coinImages[index],
          (windowWidth / 7) * i + padding,
          200 + 150 * 7
        )
      );
    }
  }

  //Img loading
  clickHere = loadImage("../Assets/click_here.png");
  decorativeArrow = loadImage("../Assets/main_page/arrow.png");
  bgImg = loadImage("../Assets/coinShrine/shrine2.jpg");
  overlayImg = loadImage("../Assets/coinShrine/4.png");

  //Offering box
  offeringBox1 = new offeringBox(width, height);

  //Particle system
  coinDrip.push(new laceParticle());
}

function draw() {
  timer += 1;
  var sineAnimMap = map(sin(timer / 20), -1, 1, -10, 10);
  clear();
  cursor("../Assets/mouse.png");
  image(piggybank, windowWidth / 2 - piggybank.width / 2, -40);

  for (var i = 0; i < coinArray.length; i++) {
    coinArray[i].draw();
    coinArray[i].animate();
  }

  for (var i = 0; i < coinDrip.length; i++) {
    coinDrip[i].show();
    coinDrip[i].update();

    if (coinDrip[i].remove()) {
      coinDrip.splice(i, 1);
      console.log("particle removed!");
    }
  }

  image(clickHere, width - 5 - clickHere.width, height - 170 + sineAnimMap / 2);
  image(
    decorativeArrow,
    width - clickHere.width + 45,
    height - 110 + sineAnimMap / 2
  );
  offeringBox1.draw();
  if (timer % 40 == 0) {
    coinDrip.push(new laceParticle());
  }
}

function windowResized() {
  resizeCanvas(windowWidth, 2000);
}

function mousePressed() {
  //Removes coins on mouse press
  for (var i = 0; i < coinArray.length; i++) {
    if (coinArray[i].remove()) {
      var chosenSound = random(coinSounds);
      chosenSound.play();
      coinArray.splice(i, 1);
      //console.log("coin removed!");
    }
  }
  offeringBox1.mouseInteraction(mouseX, mouseY);
  offeringBox1.selectFlower(mouseX, mouseY);
}

//Coin drawing
class coinGif {
  constructor(img, x_pos, y_pos) {
    this.x = x_pos;
    this.y = y_pos;
    this.coinPic = loadImage(img);
    this.mouseHover = false;
    this.imgX = this.x - this.coinPic.width / 2;
    this.imgY = this.y - this.coinPic.height / 2;
  }
  draw() {
    tint("white");
    image(this.coinPic, this.x, this.y);
  }
  animate() {
    if (
      mouseX > this.imgX &&
      mouseX < this.imgX + this.coinPic.width &&
      mouseY > this.imgY &&
      mouseY < this.imgY + this.coinPic.height
    ) {
      this.coinPic.play();
      this.mouseHover = true;
    } else {
      this.coinPic.pause();
      this.mouseHover = false;
    }
  }

  remove() {
    return this.mouseHover;
  }
}

//Lace particle system, adapted with coins
class laceParticle {
  constructor() {
    this.x = random(0, windowWidth);
    this.y = 0;
    this.vy = random(6, 3);
    this.coinSmear = [
      loadImage("../Assets/main_page/crochet.png"),
      loadImage("../Assets/main_page/crochet2.png"),
      loadImage("../Assets/main_page/crochet3.png"),
      loadImage("../Assets/coinShrine/1.png"),
      loadImage("../Assets/coinShrine/2.png"),
      loadImage("../Assets/coinShrine/3.png"),
      loadImage("../Assets/coinShrine/4.png"),
      loadImage("../Assets/coinShrine/5.png"),
    ];
    this.activePic = random(this.coinSmear);
  }
  show() {
    fill(255);
    push();
    tint(255, 200);
    image(
      this.activePic,
      this.x - this.activePic.width / 2,
      this.y - this.activePic.height / 2
    );
    pop();
  }
  update() {
    this.y += this.vy;
  }

  remove() {
    return this.y >= height;
  }
}
