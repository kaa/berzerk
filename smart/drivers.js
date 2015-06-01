function NullDriver() {
}
NullDriver.prototype.drive = function(pos,dir,vel) {
  return {
    wheel: 0, // desired angle
    throttle: 0, // desired throttle
    breaks: false // apply breaks?
  };
}
function KeyboardDriver(options) {
  options = options || {};
  this.UP =  options.up || 38;
  this.DOWN = options.down || 40;
  this.LEFT = options.left || 37;
  this.RIGHT = options.right || 39;
  this.SPACE = options.space || 32;
}
KeyboardDriver.prototype.drive = function(pos,dir,vel) {
  var cmd = {
    wheel: 0, // desired angle
    throttle: 0, // desired throttle
    breaks: false // apply breaks?
  };
  if (keyboard[this.UP]) {
    cmd.throttle = 10;
  } else if (keyboard[this.DOWN]) {
    cmd.throttle = -4;
  }
  var turningAngle = 0.3;
  if (keyboard[this.LEFT]) {
    cmd.wheel = turningAngle;
  }
  if (keyboard[this.RIGHT]) {
    cmd.wheel = -turningAngle;
  }
  cmd.breaks = keyboard[this.SPACE];
  return cmd;
}

function WaypointDriver(options) {
  this.id = WaypointDriver.ix++;
  this.waypoints = options.waypoints || [];
  this.waypointIndex = options.startIndex || 0;
  this.state = this.driveToWaypointState(0);
}
WaypointDriver.ix = 1;
WaypointDriver.prototype.draw = function(context) {
    context.beginPath();
    context.fillStyle = "red";
    context.arc(this.ap.x,this.ap.y,5,0,Math.PI*2);
    context.closePath();
    context.fill();
}
WaypointDriver.prototype.driveToWaypointState = function(wpIndex) {
  var wp = this.waypoints[wpIndex % this.waypoints.length];
  return function(car) {
    var cp = car.getPosition().Copy();
    var dist = b2Dot(wp.n, new b2Vec2(cp.x-wp.p.x, cp.y-wp.p.y));
    if(dist<5) {
      return this.driveToWaypointState(wpIndex+1);
    }

    var ap = new b2Vec2(wp.n.y, -wp.n.x);
    ap.Multiply(b2Dot(ap, new b2Vec2(cp.x-wp.p.x,cp.y-wp.p.y)));
    ap.Add(wp.p);
    var cv = car.body.GetWorldVector({x:1,y:0});

    ap.Subtract(wp.p);
    ap.Multiply(0.75);
    ap.Add(wp.p);

    this.ap = ap;

    var d = Math.atan2(cv.y,cv.x)-Math.atan2(ap.y-cp.y, ap.x-cp.x);
    d = d >  Math.PI ? d-2*Math.PI : 
        d < -Math.PI ? Math.PI*2+d : 
        d; 
    return {
      wheel: d >  1.0 ?  0.5 :
             d >  0.2 ?  0.2 :
             d < -1.0 ? -0.5 :
             d < -0.2 ? -0.2 :
             0,
      throttle: 10,
      breaks: false
    }
  }
}
WaypointDriver.reverseFromWallState = function(recoverState) {
}

WaypointDriver.prototype.drive = function(car) {
  var res = this.state.apply(this, [car]);
  if(typeof(res)==="object")
    return res;
  this.state = res;
  return {
    throttle: 0,
    wheel: 0,
    breaks: false

  };
}
