//-------------------------------------------------------------------------------------------
// OFFERING BOX
//-------------------------------------------------------------------------------------------
class offeringBox {
  constructor(width, height) {
    this.img = loadImage("../Assets/offering_box_final.png");
    this.xpos = width - 77;
    this.ypos = height - 490;
    this.isOpen = false;
    this.open = loadSound("../Assets/drawer_open.wav");
    this.close = loadSound("../Assets/drawer_close.wav");
    this.key = loadSound("../Assets/key.mp3");
    var totalDisplay = 500;
    this.selectedFlower = 0;
    this.availableFlowers = [
      loadImage("../Assets/flowerBox/flower1.png"),
      loadImage("../Assets/flowerBox/flower2.png"),
      loadImage("../Assets/flowerBox/flower3.png"),
      loadImage("../Assets/flowerBox/flower4.png"),
      loadImage("../Assets/flowerBox/flower5.png"),
    ];
    this.userFlowers = [];
  }
  draw() {
    image(this.img, this.xpos, this.ypos);

    //Open/close drawing logic
    if (this.isOpen)
      for (var i = 0; i < this.availableFlowers.length; i++) {
        image(
          this.availableFlowers[i],
          this.xpos + 180,
          this.ypos + 110 + 75 * i
        );
      }
    if (this.isOpen && this.xpos >= width - this.img.width - 2) {
      this.xpos -= 4;
    }
    if (this.isOpen == false && this.xpos <= width - 78) {
      this.xpos += 4;
    }

    //Draws flowers
    for (var i = 0; i < this.userFlowers.length; i++) {
      this.userFlowers[i].draw();
    }
  }
  mouseInteraction(mouseX, mouseY) {
    if (mouseX > this.xpos && mouseY > this.ypos) {
      this.isOpen = true;
      this.open.play();
    }
    if (this.isOpen && (mouseX < this.xpos || mouseY < this.ypos)) {
      this.isOpen = false;
      this.close.play();
    }
    for (var i = 0; i < this.userFlowers.length; i++) {
      this.userFlowers[i].fixFlower();
    }
  }
  selectFlower(mouseX, mouseY) {
    if (this.isOpen && mouseX >= this.xpos + 180 && mouseY >= this.ypos + 110) {
      // Calculate the selectedFlower based on mouseY position
      this.selectedFlower = Math.floor((mouseY - this.ypos - 110) / 75);

      // Ensure selectedFlower stays within bounds
      if (this.selectedFlower < 0) {
        this.selectedFlower = 0;
      } else if (this.selectedFlower >= 5) {
        this.selectedFlower = 4;
      }

      this.userFlowers.push(
        new newFlower(
          mouseX,
          mouseY,
          this.availableFlowers,
          this.selectedFlower
        )
      );
      this.key.play();
    }
  }
}

//Creation of flower for user
class newFlower {
  constructor(mouseX, mouseY, availableFlowers, selectedFlower) {
    this.xpos = mouseX;
    this.ypos = mouseY;
    this.img = availableFlowers[selectedFlower];
    this.isFixed = false;
  }
  draw() {
    if (this.isFixed == false) {
      this.xpos = mouseX;
      this.ypos = mouseY;
    }
    image(
      this.img,
      this.xpos - this.img.width / 2,
      this.ypos - this.img.height / 2
    );
  }
  fixFlower() {
    //Sticks flower when mouse clicked
    //console.log("flower stuck!");
    if (this.isFixed == false) {
      this.isFixed = true;
    }
  }
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
