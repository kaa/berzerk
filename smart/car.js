var Car = function(physics, details) {
  this.details = details = details || {};
  this.driver = this.details.driver || new NullDriver();

  // Chassis
  var bodyDef = new b2BodyDef();
  bodyDef.active = true;
  bodyDef.allowSleep = true;
  bodyDef.position = new b2Vec2(details.x, details.y);
  bodyDef.type = b2Body.b2_dynamicBody;
  bodyDef.userData = this;
  this.body = physics.world.CreateBody(bodyDef);
  var fixtureDef = new b2FixtureDef();
  fixtureDef.density = 1;
  fixtureDef.restitution = 0.2;
  fixtureDef.friction = 0.05;
  fixtureDef.shape = b2PolygonShape.AsBox(4 , 2);
  this.body.CreateFixture(fixtureDef);

  // Tires
  this.flTire = new Tire(physics, { x:  3, y: -2 });
  this.frTire = new Tire(physics, { x:  3, y:  2 });
  this.rlTire = new Tire(physics, { x: -3, y: -2 });
  this.rrTire = new Tire(physics, { x: -3, y:  2 });
  joinTire(this.rlTire, this);
  joinTire(this.rrTire, this);
  this.flJoint = joinTire(this.flTire, this);
  this.frJoint = joinTire(this.frTire, this);

  function joinTire(tire, car) {
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
  if(this.driver.draw)
    this.driver.draw(context);
  context.translate(pos.x, pos.y);
  context.rotate(angle);
  context.fillStyle = "black";
  context.fillRect(-4, -2, 8, 4);
  context.restore();
}

Car.prototype.getPosition = function() {
  return this.body.GetPosition().Copy();
};
Car.prototype.getDirection = function() {
  return this.body.GetAngle();
}
Car.prototype.getVelocity = function() {
  return this.body.GetLinearVelocity();
}

Car.prototype.live = function() {
  var cmd = this.driver.drive(this);
  this.rlTire.power = cmd.throttle;
  this.rrTire.power = cmd.throttle;
  this.rrTire.breakOn = cmd.breaks;
  this.rlTire.breakOn = cmd.breaks;
  this.flJoint.SetLimits(cmd.wheel,cmd.wheel);
  this.frJoint.SetLimits(cmd.wheel,cmd.wheel);

  var velocity = this.body.GetLocalVector(
    this.body.GetLinearVelocity()
  );
  var drag = velocity.Copy();
  drag.Multiply(-0.3 * drag.Length());
  this.body.ApplyForce(this.body.GetWorldVector(drag), this.body.GetWorldCenter());
}