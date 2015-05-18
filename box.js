var Box = function(physics, details) {
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
  fixtureDef.shape = b2PolygonShape.AsBox(1, 1);
  this.body.CreateFixture(fixtureDef);
};

Box.prototype.draw = function(context) {
  var pos = this.body.GetPosition();
  var angle = this.body.GetAngle();
  // Draw chassis
  context.save();
  context.translate(pos.x, pos.y);
  context.rotate(angle);
  context.fillStyle = "black";
  context.fillRect(-0.5, -0.5, 1, 1);
  context.restore();
}

Box.prototype.live = function() {
  var impulse = new b2Vec2(0,0);
  if(keyboard[Keyboard.UP])
    impulse.Add(new b2Vec2(0,-1));
  if(keyboard[Keyboard.RIGHT])
    impulse.Add(new b2Vec2(1,0));
  if(keyboard[Keyboard.DOWN])
    impulse.Add(new b2Vec2(0,1));
  if(keyboard[Keyboard.LEFT])
    impulse.Add(new b2Vec2(-1,0));
  this.body.ApplyImpulse(this.body.GetWorldVector(impulse),this.body.GetWorldCenter());
}