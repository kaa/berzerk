var Game = function(element,scale,gravity) {
    var gravity = gravity || new b2Vec2(0,9.8);
    this.world = new b2World(gravity, true);
    this.element = element;
    this.context = element.getContext("2d");
    this.scale = scale || 30;
    this.dtRemaining = 0;
    this.stepAmount = 1/60;
};
Game.prototype.step = function (dt) {
    var obj;

    // Live objects
    for(obj = this.world.GetBodyList(); obj; obj = obj.GetNext()) {
        var actor = obj.GetUserData();
        if (actor && actor.live) actor.live(this.context);
    }

    this.world.Step(Math.min(dt,1/15),8,3)
    this.world.ClearForces();
    if (this.debugDraw) {
        this.context.clearRect(0, 0, this.element.width, this.element.height);
        this.context.save();
        this.context.translate(this.element.width/2, this.element.height/2);
        if(this.camera) {
          var cameraPosition = this.camera.body.GetPosition();
          this.context.translate(-cameraPosition.x*this.scale, -cameraPosition.y*this.scale);
        }
        this.world.DrawDebugData();
          this.context.restore();
    } else if(this.renderer) {
        this.renderer(this.world);
    } else {
        this.context.clearRect(0, 0, this.element.width, this.element.height);
        this.context.save();
        this.context.translate(this.element.width/2, this.element.height/2);
        this.context.scale(this.scale, this.scale);
        if(this.camera) {
          var cameraPosition = this.camera.body.GetPosition();
          this.context.translate(-cameraPosition.x, -cameraPosition.y);
        }
        for(obj = this.world.GetBodyList(); obj; obj = obj.GetNext()) {
            var actor = obj.GetUserData();
            if (actor && actor.draw) actor.draw(this.context);
        }
        this.context.restore();
    }
}
Game.prototype.debug = function() {
    this.debugDraw = new b2DebugDraw();
    this.debugDraw.SetSprite(this.context);
    this.debugDraw.SetDrawScale(this.scale);
    this.debugDraw.SetFillAlpha(0.3);
    this.debugDraw.SetLineThickness(1.0);
    this.debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
    this.world.SetDebugDraw(this.debugDraw);
};
