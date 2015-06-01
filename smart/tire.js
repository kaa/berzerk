function Tire(physics, details) {
    this.details = details = details || {};
    details.w = details.w || 0.8;
    details.h = details.h || 0.4;

    // Create the definition
    var definition = new b2BodyDef();
    definition.position = new b2Vec2(details.x || 0, details.y || 0);
    definition.userData = this;
    definition.type = b2Body.b2_dynamicBody;
  
    // Create the fixture
    var fixtureDef = new b2FixtureDef();
    fixtureDef.density = 1;
    fixtureDef.restitution = 0;
    fixtureDef.friction = 1;
    fixtureDef.shape = b2PolygonShape.AsBox(details.w, details.h);

    // Create the Body
    this.body = physics.world.CreateBody(definition);
    this.body.CreateFixture(fixtureDef);
    this.body.userData = this;

    this.power = 0;
    this.breakOn = false;
}    
Tire.prototype.draw = function(context) {
    var pos = this.body.GetPosition(),
        angle = this.body.GetAngle(),
        height = this.details.h,
        width = this.details.w;
    
    context.save();
    context.translate(pos.x, pos.y);
    context.rotate(angle);
    context.fillStyle = "green";
    context.fillRect(-width, -height, width*2, height*2);
    context.restore();
}
Tire.prototype.live = function() {
  var force = this.getLinearFriction();
  force.Add(new b2Vec2(this.power*150,0));
  this.body.ApplyForce(this.body.GetWorldVector(force), this.body.GetWorldCenter());

  var velocity = this.body.GetLinearVelocity();

  var skid = this.body.GetWorldVector(new b2Vec2(0,-1));
  skid.Multiply(b2Dot(skid,velocity));
  skid.Multiply(this.body.GetMass() * (this.breakOn ? 0.15 : 0.9 ));
  skid.NegativeSelf();
  this.body.ApplyImpulse(skid, this.body.GetWorldCenter());
}
Tire.prototype.getLinearFriction = function() {
  var velocity = this.body.GetLocalVector(
      this.body.GetLinearVelocity()
  );
  var rolling = new b2Vec2(0,0);
//  var rolling = velocity.Copy();
//  rolling.Multiply(-5);

  var breaking = new b2Vec2(0,0);
  if(this.breakOn) {
    breaking = new b2Vec2(1,0);
    breaking.Multiply(b2Dot(breaking,velocity));
    breaking.Multiply(-75);
  }
  rolling.Add(breaking);
  return rolling;
}