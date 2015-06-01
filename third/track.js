function Track(game, details) {
  details = details || {};
  details.w = details.w || 1;
  details.h = details.h || 1;
  details.x = details.x || 0;
  details.y = details.y || 0;

  this.mesh = window.meshes["track"].clone();
  this.mesh.scale.set(30,30,10);
  game.scene.add(this.mesh);
  var bodyDef = new Box2D.b2BodyDef();
  bodyDef.set_linearDamping(2);
  bodyDef.set_angularDamping(2);
  bodyDef.set_allowSleep(true);
  bodyDef.set_position(new Box2D.b2Vec2(details.x, details.y));
  bodyDef.set_type(Box2D.b2_staticBody);
  this.body = game.world.CreateBody(bodyDef);
  this.body.userData = this;
  var fixtureDef = new Box2D.b2FixtureDef();
  fixtureDef.set_density(1);
  fixtureDef.set_restitution(0.1);
  fixtureDef.set_friction(0);
  var shape = new Box2D.b2PolygonShape();
  shape.SetAsBox(details.w/2, details.h/2);
  fixtureDef.set_shape(shape);
  this.body.CreateFixture(fixtureDef);
};

