var Car = function(physics, details) {
  this.details = details = details || {};

  // Create the definition
  var bodyDef, fixtureDef, jointDef;

  // Chassis
  bodyDef = new b2BodyDef();
  bodyDef.active = true;
  bodyDef.allowSleep = true;
  bodyDef.position = new b2Vec2(details.x, details.y);
  bodyDef.type = b2Body.b2_dynamicBody;
  bodyDef.userData = this;
  this.body = physics.world.CreateBody(bodyDef);
  fixtureDef = new b2FixtureDef();
  fixtureDef.density = 1;
  fixtureDef.restitution = 0;
  fixtureDef.friction = 0.15;
  fixtureDef.shape = b2PolygonShape.AsBox(2, 4);
  this.body.CreateFixture(fixtureDef);

  // Tires
  this.flTire = new Tire(physics, { x: -2, y:  3 });
  this.frTire = new Tire(physics, { x:  2, y:  3 });
  this.rlTire = new Tire(physics, { x: -2, y: -3 });
  this.rrTire = new Tire(physics, { x:  2, y: -3 });
  joinTire(this.rlTire, this);
  joinTire(this.rrTire, this);
  this.flJoint = joinTire(this.flTire, this);
  this.frJoint = joinTire(this.frTire, this);

  function joinTire(tire, car, type) {
    var jointDef = new Box2D.Dynamics.Joints.b2RevoluteJointDef();
    jointDef.bodyA = tire.body;
    jointDef.bodyB = car.body;
    jointDef.enableLimit = true;
    jointDef.lowerAngle = 0;
    jointDef.upperAngle = 0;
    jointDef.localAnchorA.Set(0, 0);
    jointDef.localAnchorB.Set(tire.details.x, tire.details.y);
    jointDef.collideConnected = false;
    return physics.world.CreateJoint(jointDef)
  }
};

Car.prototype.draw = function(context) {
  var pos = this.body.GetPosition();
  var angle = this.body.GetAngle();
  // Draw chassis
  context.save();
  context.translate(pos.x, pos.y);
  context.rotate(angle);
  context.fillStyle = "black";
  context.fillRect(-2, -4, 4, 8);
  context.restore();
}

Car.prototype.live = function() {
  if (keyboard[Keyboard.UP]) {
    this.rlTire.power = 15;
    this.rrTire.power = 15;
  } else if (keyboard[Keyboard.DOWN]) {
    this.rlTire.power = -4;
    this.rrTire.power = -4;
  } else {
    this.rlTire.power = 0;
    this.rrTire.power = 0;
  }
  this.rrTire.breakOn = this.rlTire.breakOn = keyboard[Keyboard.SPACE];

  var desiredAngle = 0; var turningAngle = 0.2;
  if (keyboard[Keyboard.LEFT]) {
    desiredAngle = turningAngle;
  }
  if (keyboard[Keyboard.RIGHT]) {
    desiredAngle = -turningAngle;
  }
  var currentAngle = this.flJoint.GetJointAngle()
  var newAngle = desiredAngle;
  this.flJoint.SetLimits(newAngle,newAngle);
  this.frJoint.SetLimits(newAngle,newAngle);

  var velocity = this.body.GetLocalVector(
    this.body.GetLinearVelocity()
  );
  var drag = velocity.Copy();
  drag.Multiply(-0.3 * drag.Length());
//  var t = velocity.Length();
//  velocity.Multiply(t*t);
//  velocity.Multiply(-0.001);
  this.body.ApplyForce(this.body.GetWorldVector(drag), this.body.GetWorldCenter());
}