function Track(game, details) {
  var bodyDef = new b2BodyDef();
  bodyDef.type = b2Body.b2_staticBody;
  bodyDef.position = new b2Vec2(details.x || 0, details.y || 0);
  this.body = game.world.CreateBody(bodyDef);
  this.body.SetUserData(this);
  fixtures = details.fixtures
  for(var i=0; i<fixtures.length;i++) {
    var fixtureDef = new b2FixtureDef();
    fixtureDef.density = 2;
    fixtureDef.friction = 0.15;
    fixtureDef.restitution = 0;
    fixtureDef.shape = new b2PolygonShape();
    var polygon = fixtures[i].polygon.vertices;
    var vertices = [];
    for(var j=0; j<polygon.x.length; j++) {
      var vec = new b2Vec2(polygon.x[j],polygon.y[j]);
      vec.Multiply(40);
      vec.Add(new b2Vec2(20,30));
      vertices.push(vec);
    }
    fixtureDef.shape.SetAsArray(vertices, vertices.length);
    this.body.CreateFixture(fixtureDef);
  }
}    
Track.prototype.draw = function(context) {
    var pos = this.body.GetPosition(),
        angle = this.body.GetAngle();

    context.save();
    context.translate(pos.x, pos.y);
    context.rotate(angle);
    context.fillStyle = "green";
    var fixture = this.body.GetFixtureList();
    while(fixture) {
      var shape = fixture.GetShape();
      var vertices = shape.GetVertices();
      context.beginPath();
      context.moveTo(vertices[0].x,vertices[0].y);
      for(var i=1; i<vertices.length; i++)
        context.lineTo(vertices[i].x,vertices[i].y);
      context.closePath();
      context.fill();
      fixture = fixture.GetNext();
    }
    context.restore();
}