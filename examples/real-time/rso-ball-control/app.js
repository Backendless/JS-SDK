(function() {
  const API_HOST = 'http://api.backendless.com';
  const APP_ID = 'A81AB58A-FC85-EF00-FFE4-1A1C0FEADB00';
  const API_KEY = 'ADA9D269-A164-316C-FFB7-BEE08BD61B00';

  const BALL_NAME = 'BallObject'
  const BALL_RATIO = 0.25; // 25% of width or height
  const BALL_POSITION_KEY = 'LocationCoeficients'

  if (!APP_ID || !API_KEY) {
    alert(
      'Missing application ID or secret key arguments. ' +
      'Login to Backendless Console, ' +
      'select your app and get the ID and key from the Manage > App Settings screen. ' +
      'Copy/paste the values into the Backendless.initApp call located in app.js'
    );
  }

  Backendless.serverURL = API_HOST;
  Backendless.initApp(APP_ID, API_KEY);

  class Ball {
    constructor(court) {
      this.court = court

      this.$el = $(
        '<svg id="ball" width="60px" height="60px">' +
        '  <circle id="sd" class="medium" cx="50%" cy="50%" r="50%" fill="#343a40" stroke="lightblue" stroke-width="0.5%" />' +
        '  <image x="4%" y="0%" width="92%" height="100%" xlink:href="https://backendless.com/wp-content/themes/backendless/img/logo.png"></image>' +
        '</svg>'
      );

      this.$el.draggable({
        containment: 'parent',
        drag       : (e, ui) => this.onBallMove(ui.position),
        start      : (e, ui) => this.onBallMoveStart(ui.position),
        stop       : (e, ui) => this.onBallMoveStop(ui.position),
      });

      this.toggleMovingState(false)
      this.updateSize();
    }

    activate() {
      this.court.rso
        .get(BALL_POSITION_KEY)
        .then(position => {
          position = position || {}

          this.moveBallTo(position.coefX || 0.5, position.coefY || 0.5);

          if (!this.court.$workspace.has(this.$el).length) {
            this.court.$workspace.append(this.$el);
          }
        })
    }

    updateSize() {
      const { width, height } = this.court.getWorkspaceSize()
      const ballSize = Math.min(width, height) * BALL_RATIO

      this.maxXPosition = width - ballSize
      this.maxYPosition = height - ballSize

      this.$el.attr({
        width : ballSize + 'px',
        height: ballSize + 'px',
      })

      this.updatePosition();
    }

    updatePosition() {
      this.$el.css({
        left : this.ratioToPosition(this.x, this.maxXPosition),
        top: this.ratioToPosition(this.y, this.maxYPosition),
      })
    }

    moveBallTo(x, y) {
      this.x = x
      this.y = y

      if (!this.moving) {
        this.updatePosition();
      }
    }

    toggleMovingState(moving) {
      this.moving = moving

      this.$el.toggleClass('moving', this.moving)
    }

    positionToRatio(position, maxPosition) {
      if (position <= 0) {
        return 0
      }

      if (position >= maxPosition) {
        return 1
      }

      return position / maxPosition
    }

    ratioToPosition(ratio, maxPosition) {
      return Math.min(Math.max(ratio, 0), 1) * maxPosition
    }

    onBallMove(position) {
      this.court.rso.set(BALL_POSITION_KEY, {
        coefX: this.positionToRatio(position.left, this.maxXPosition),
        coefY: this.positionToRatio(position.top, this.maxYPosition),
      })
    }

    onBallMoveStart(position) {
      this.toggleMovingState(true)
    }

    onBallMoveStop(position) {
      this.toggleMovingState(false)
    }
  }

  class Court {
    constructor(selector, ballName) {
      this.rso = Backendless.SharedObject.connect(ballName);
      this.rso.addConnectListener(() => this.onConnect());
      this.rso.addChangesListener(data => this.onRSOChange(data))

      this.connected = false;
      this.connecting = true;

      this.$el = $('<div class="court"/>');
      this.$el.appendTo(selector);

      this.$controls = $(`<div class="controls"><span class="ball-name">Ball: ${ballName}</span></div>`);
      this.$controls.appendTo(this.$el);

      this.$connectBtn = $('<button type="button" class="btn btn-primary btn-sm"/>');
      this.$connectBtn.appendTo(this.$controls);
      this.$connectBtn.on('click', () => this.toggleConnection());

      this.updateConnectBtn();

      this.$workspace = $('<div class="workspace"/>');
      this.$workspace.appendTo(this.$el);

      $(window).on('resize', () => this.onResize());

      this.updateSize();

      this.ball = new Ball(this);
    }

    onConnect() {
      this.connected = true;
      this.connecting = false;

      this.updateConnectBtn();

      this.ball.activate();
    }

    onRSOChange({ key, data }){
      if (key === BALL_POSITION_KEY) {
        this.ball.moveBallTo(data.coefX, data.coefY);
      }
    }

    toggleConnection() {
      if (!this.connected) {
        this.connecting = true;

        this.rso.connect()
        this.rso.addConnectListener(() => this.onConnect());
        this.rso.addChangesListener(data => this.onRSOChange(data))

      } else {
        this.rso.disconnect();

        this.connected = false;
      }

      this.updateConnectBtn();
    }

    updateConnectBtn() {
      if (this.connecting) {
        this.$connectBtn.text('Connecting...');

      } else {
        this.$connectBtn.text(this.connected ? 'Disconnect' : 'Connect');
      }
    }

    onResize() {
      this.updateSize()

      this.ball.updateSize()
    }

    updateSize() {
      this.workspaceWidth = this.$workspace.width()
      this.workspaceHeight = this.$workspace.height()
    }

    getWorkspaceSize() {
      return {
        width : this.workspaceWidth,
        height: this.workspaceHeight,
      }
    }

  }

  new Court('#court-container-1', BALL_NAME);
  new Court('#court-container-2', BALL_NAME);
})()
