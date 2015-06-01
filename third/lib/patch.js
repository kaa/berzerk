Box2D.Dynamics.b2Body.prototype.ApplyAngularImpulse = function(impulse) {
    if (this.IsAwake() == false) {
        this.SetAwake(true);
    }
    this.m_angularVelocity += this.m_invI * impulse;
};

var b2Vec2 = Box2D.Common.Math.b2Vec2;
var b2BodyDef = Box2D.Dynamics.b2BodyDef;
var b2Body = Box2D.Dynamics.b2Body;
var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
var b2Fixture = Box2D.Dynamics.b2Fixture;
var b2World = Box2D.Dynamics.b2World;
var b2MassData = Box2D.Collision.Shapes.b2MassData;
var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;

function toRad(deg) {
	return (360 / (2*Math.PI)) * deg;
}