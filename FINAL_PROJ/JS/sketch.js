//-------------------------------------------------------------------------------------------
// MAIN PAGE!
//-------------------------------------------------------------------------------------------

//Variables
var canvas;
var laceDrip = [];
var arch,
  arrow_L,
  arrow_R,
  activeShrineImg,
  selectedShrine,
  doily_bg,
  decorativeArrow,
  clickHere,
  pas,
  title;
var timer, sineAnim, runOnce;
var arrowPress, shrineSelect, arrowR_x, arrowL_x;
var offeringBox1;

function preload() {
  //Audio preloading
  soundFormats("mp3", "ogg", "wav");
  arrowPress = loadSound("../Assets/main_page/menu_click.wav");
  shrineSelect = loadSound("../Assets/main_page/shrine_select.mp3");
}
function setup() {
  //Canvas logic
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0, 0);
  canvas.style("z-index", "-1");

  //Image loading
  arch = loadImage("../Assets/main_page/arch_final_blue.png");
  arrow_L = loadImage("../Assets/main_page/arrow_L_v3.png");
  arrow_R = loadImage("../Assets/main_page/arrow_R_v3.png");
  clickHere = loadImage("../Assets/click_here.png");
  decorativeArrow = loadImage("../Assets/main_page/arrow.png");
  pas = loadImage("../Assets/pas.png");
  title = loadImage("../Assets/main_page/in_memoriam.png");

  //Particle system
  laceDrip.push(new laceParticle());

  //Offering box
  offeringBox1 = new offeringBox(width, height);

  //Variable initialising
  timer = 0;
  runOnce = true;
  selectedShrine = 2;
  arrowL_x = 50;
  arrowR_x = 0;

  //Shrine logic
  const shrineObj = {
    1: "../Assets/main_page/coin_shrine_v3.png",
    2: "../Assets/main_page/stuffed_shrine.png",
    3: "../Assets/main_page/me_shrine.png",
  };

  if (shrineObj[selectedShrine]) {
    activeShrineImg = createImg(shrineObj[selectedShrine], "");
    activeShrineImg.mousePressed(shrineTP);
  }
}

function draw() {
  //Animation
  timer += 1;
  sineAnim = map(sin(timer / 20), -1, 1, -10, 10);

  //Clears bg for overlay
  clear();

  //Image drawing
  push();
  tint(255, 200); //Tints transparency
  image(arch, width / 2 - arch.width / 2, height / 2 - arch.height / 2);
  pop();

  push();
  tint(240, 128, 128, 245); //Tints red
  image(arrow_L, arrowL_x, height / 2 - arrow_L.height / 2);
  image(
    arrow_R,
    width - 50 - arrow_R.width + arrowR_x,
    height / 2 - arrow_R.height / 2
  );
  pop();

  image(clickHere, width - 5 - clickHere.width, height - 170 + sineAnim / 2);
  image(
    decorativeArrow,
    width - clickHere.width + 45,
    height - 110 + sineAnim / 2
  );
  image(pas, 10, height / 5 + sineAnim / 2);
  image(title, width - title.width - 10, 15 + sineAnim / 2);

  //fill(255, 0, 0);

  //Draws pocket shrines, TP logic
  if (runOnce == false) {
    const shrineObj = {
      1: {
        imgPath: "../Assets/main_page/coin_shrine_v3.png",
        onClick: shrineTP,
      },
      2: {
        imgPath: "../Assets/main_page/stuffed_shrine.png",
        onClick: shrineTP,
      },
      3: {
        imgPath: "../Assets/main_page/me_shrine.png",
        onClick: shrineTP,
      },
    };

    if (shrineObj[selectedShrine]) {
      activeShrineImg.remove();
      activeShrineImg = createImg(shrineObj[selectedShrine].imgPath, "");
      activeShrineImg.mousePressed(shrineObj[selectedShrine].onClick);
    }
    runOnce = true;
  }
  activeShrineImg.position(
    windowWidth / 2 - activeShrineImg.width / 2,
    windowHeight / 2 - activeShrineImg.height / 2 + sineAnim
  );

  //Particle animation
  for (var i = 0; i < laceDrip.length; i++) {
    laceDrip[i].show(selectedShrine);
    laceDrip[i].update();

    if (laceDrip[i].remove()) {
      laceDrip.splice(i, 1);
      console.log("particle removed!");
    }
  }

  if (timer % 20 == 0) {
    laceDrip.push(new laceParticle());
  }

  //Shrine selection
  if (selectedShrine >= 4) {
    selectedShrine = 1;
    runOnce = false;
  }
  if (selectedShrine < 1) {
    selectedShrine = 3;
    runOnce = false;
  }

  //Arrow anim
  arrowL_x -= sineAnim / 30;
  arrowR_x += sineAnim / 30;

  //Offering box
  offeringBox1.draw();

  //Custom cursor
  cursor("../Assets/mouse.png");
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

//Lace particle system
class laceParticle {
  constructor() {
    this.x = random(0, windowWidth);
    this.y = 0;
    this.vy = random(5, 1);
    this.lacePic = loadImage("../Assets/main_page/crochet.png");
    this.coinPic = loadImage("../Assets/main_page/crochet2.png");
    this.animalPic = loadImage("../Assets/main_page/crochet3.png");
  }
  show(selectedShrine) {
    fill(255);
    if (selectedShrine == 1) {
      image(
        this.coinPic,
        this.x - this.lacePic.width / 2,
        this.y - this.lacePic.height / 2
      );
    }
    if (selectedShrine == 2) {
      image(
        this.animalPic,
        this.x - this.animalPic.width / 2,
        this.y - this.animalPic.height / 2
      );
    }
    if (selectedShrine == 3) {
      image(
        this.lacePic,
        this.x - this.lacePic.width / 2,
        this.y - this.lacePic.height / 2
      );
    }
  }
  update() {
    this.y += this.vy;
  }

  remove() {
    return this.y >= windowHeight;
  }
}

//Mouse pressed logic
function mousePressed() {
  if (
    mouseX > 50 &&
    mouseX < 50 + arrow_L.width &&
    mouseY > height / 2 - arrow_L.height / 2 &&
    mouseY < height / 2 + arrow_L.height / 2
  ) {
    arrowPress.play();
    selectedShrine -= 1;
  }
  if (
    mouseX > width - 50 - arrow_R.width &&
    mouseX < width - 50 &&
    mouseY > height / 2 - arrow_R.height / 2 &&
    mouseY < height / 2 + arrow_R.height / 2
  ) {
    arrowPress.play();
    selectedShrine += 1;
  }
  runOnce = false;

  offeringBox1.mouseInteraction(mouseX, mouseY);
  offeringBox1.selectFlower(mouseX, mouseY);
}

//New page loading...
function shrineTP() {
  if (selectedShrine == 1) {
    window.location.href = "../HTML/coinShrine.html";
  }
  if (selectedShrine == 2) {
    window.location.href = "../HTML/stuffedShrine.html";
  }
  if (selectedShrine == 3) {
    window.location.href = "../HTML/personalShrine.html";
  }
}
