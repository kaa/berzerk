var Game = function(canvas, gravity) {
    this.world = new Box2D.b2World(gravity || new Box2D.b2Vec2(0, 0), true);
    this.dtRemaining = 0;
    this.stepAmount = 1 / 60;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 75, canvas.width / canvas.height, 0.1, 1000 );
    this.camera.position.z = 15;
    this.renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: 1});
    this.renderer.setSize(canvas.width, canvas.height);
};
Game.prototype.step = function(dt,tm) {
    this.renderer.render(this.scene, this.camera);

    // Live objects
    this.world.ClearForces();
    for (var body = this.world.GetBodyList(); Box2D.getPointer(body); body = body.GetNext()) {
        var object = body.userData;
        if (object && object.live) {
            object.live();
        }
    }

    // Update mesh positions
    if(this.cameraTrack) {
        this.camera.position.x = this.cameraTrack.mesh.position.x;
        this.camera.position.y = this.cameraTrack.mesh.position.y;
    } else {
      this.camera.position.set(
        Math.cos(tm/800)*5,
        Math.cos(tm/700)*5,
        10
      );
    }

    // Step physics
    this.world.Step(1/60, 4, 3);

    for (var body = this.world.GetBodyList(); Box2D.getPointer(body); body = body.GetNext()) {
        var obj = body.userData;
        if (obj && obj.mesh) {
            var pos = body.GetPosition();
            var angle = body.GetAngle();
            obj.mesh.position.set(pos.get_x(), pos.get_y(), 0)
            obj.mesh.rotation.set(0,0,angle);
        }
    }
}
