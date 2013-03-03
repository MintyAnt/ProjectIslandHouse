#pragma strict

//----------------------------------------------------------------------------//
class Entity extends MonoBehaviour
{
	// Public members //
	public var M_FirstState : State;
	
	// Private members //
	protected var mStateMachine : StateMachine;

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