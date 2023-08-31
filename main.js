const canvasEl = document.querySelector("canvas"),
    canvasCtx = canvasEl.getContext("2d"),
    gapX = 10

    const mouse = { x:0, y:0 }
    // objeto campo
    const field = {
      w: window.innerWidth,
      h: window.innerHeight,
      draw: function() {
      canvasCtx.fillStyle = "#000000"
      canvasCtx.fillRect(0, 0, this.w, this.h)
      }
    }

    // objeto linha central
    const lineCenter = {
      x: field.w / 2 - 15 / 2,
      y: 0,
      w: 15,
      h: window.innerHeight,
      draw: function() {
      canvasCtx.fillStyle = "#FFFFFF"
      canvasCtx.fillRect(this.x, this.y, this.w, this.h)
      }
    }

    // objeto raquete esquerda
    const leftPaddle = {
      x: gapX,
      y: 0,
      w: lineCenter.w,
      h: 200,
      _move: function() {
        this.y = mouse.y - this.h / 2
      },
      draw: function() {
      canvasCtx.fillRect(this.x, this.y, this.w, this.h)

      this._move()
      }
    }

    // objeto raquete direita
    const rightPaddle = {
      x: window.innerWidth - lineCenter.w - 10,
      y: 300,
      w: lineCenter.w,
      h: 200,
      speed: 2,
      _move: function() {
        if(this.y + this.h / 2 < ball.y + ball.r) {
          this.y += this.speed
        } else {
          this.y -= this.speed
        }
      },
      speedUp: function() {
        this.speed += 1
      },
      draw: function() {
      canvasCtx.fillRect(this.x, this.y, this.w, this.h)
      this._move()
      }
    }

    // objeto placar
    const score = {
      human: "0",
      computer: "0",
      increaseHuman: function() {
        this.human++
      },
      increaseComputer: function() {
        this.computer++
      },
      draw: function() {
      canvasCtx.font = "bold 72px Verdana"
      canvasCtx.textAlign = "center"
      canvasCtx.textBaseline = "top"
      canvasCtx.fillStyle = "#808080"
      canvasCtx.fillText(this.human, field.w / 4, 50)
      canvasCtx.fillText(this.computer, field.w / 4 + field.w / 2, 50)
      }
    }

    // objeto bola
    const ball = {
      x: 50,
      y: 50,
      r: 20,
      speed: 3,
      directionY: 1,
      directionX: 1,
      _calcPosition: function () {
        if(this.x > field.w - this.r - rightPaddle.w - gapX ) {
          if(this.y + this.r > rightPaddle.y && 
          this.y - this.r < rightPaddle.y + rightPaddle.h) {
            this.reverseX()
            this._speedUp()
          } else {
            score.increaseHuman()
            this._pointUp()
          }
        }

        if(this.x < this.r + leftPaddle.w + gapX) {
          if(this.y + this.r > leftPaddle.y && 
          this.y - this.r < leftPaddle.y + leftPaddle.h) {
            this.reverseX()
            this._speedUp()
          } else {
            score.increaseComputer()
            this._pointUp()
          }
        }

        if((this.y - this.r < 0 && this.directionY < 0) || 
        (this.y > field.h - this.r && this.directionY > 0)) {
          this.reverseY()
        }
      },
      reverseY: function() {
        this.directionY = this.directionY *= -1  
      },
      reverseX: function() {
        this.directionX = this.directionX *= -1  
      },
      _speedUp: function() {
        this.speed += 1
      },
      _pointUp: function() {
        rightPaddle.speedUp()
        this.speed = 3
        this.x = field.w / 2 
        this.y = field.h / 2 
      },
      _move: function() {
        this.x += this.directionX * this.speed
        this.y += this.directionY * this.speed
      },
      startAngle: 2 * Math.PI,
      draw: function() {
      canvasCtx.fillStyle = "#FFFFFF"
      canvasCtx.beginPath()
      canvasCtx.arc(this.x, this.y, this.r, this.startAngle, false)
      canvasCtx.fill()

      this._calcPosition()

      this._move()
      }
    }

    function setup() {
      canvasEl.width = canvasCtx.width = field.w
      canvasEl.height = canvasCtx.height = field.h
    }

    function draw() {
      // desenha o campo
      field.draw()

      // desenha a linha central
      lineCenter.draw()

      // desenha raquete esquerda
      leftPaddle.draw()

      // desenha raquete direita
      rightPaddle.draw()

      // desenha o placar
      score.draw()

      // desenha a bola
      ball.draw()

  }

    window.animateFrame = (function () {
      return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback) {
          return window.setTimeout(callback, 1000, 60)
        }
      )
    })() 

    window.setInterval(draw, 1000 / 60)

    function main () {
      animateFrame(main)
      draw()
    }

    setup()
    main()

    canvasEl.addEventListener("mousemove", function(e){
      mouse.x = e.pageX
      mouse.y = e.pageY
    })