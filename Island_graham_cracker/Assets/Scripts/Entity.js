#pragma strict

//----------------------------------------------------------------------------//
class Entity extends MonoBehaviour
{
	// Public members //
	public var M_FirstState : State;
	public var M_ObjectToGoTo : Transform;
	
	// Private members //
	protected var mHeading : Vector2;
	protected var mSide : Vector2;
	
	protected var mStateMachine : StateMachine;

	// Accessors
	function GetHeading() { return mHeading; }
	function GetSide() { return mSide; }
	function GetPosition2D() { return Vector2(transform.position.x, transform.position.z); }

	//----------------------------------------------------------------------------//
	function Start()
	{
		mStateMachine = new StateMachine(this);
		mStateMachine.ChangeState(new StateShittyWander());//M_FirstState);
	}
	
	//----------------------------------------------------------------------------//
	function Update()
	{
		mStateMachine.Update();
	}
}