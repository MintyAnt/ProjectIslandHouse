#pragma strict

//----------------------------------------------------------------------------//
class StateMachine
{
	// Members //
	private var mOwner : Entity = null;
	
	private var mCurrentState : State = null;
	private var mPreviousState : State = null;
	private var mGlobalState : State = null;
	
	// Methods //
	//----------------------------------------------------------------------------//
	function StateMachine(inOwner : Entity)
	{
		mOwner = inOwner;
	}
	
	//----------------------------------------------------------------------------//
	function Update()
	{
		if (mCurrentState != null)
			mCurrentState.Execute(mOwner);
			
		if (mGlobalState != null)
			mGlobalState.Execute(mOwner);
	}
	
	//----------------------------------------------------------------------------//
	function ChangeState(inNewState : State)
	{
		if (inNewState != null)
		{
			mPreviousState = mCurrentState;
			
			if (mCurrentState != null)
			{
				mCurrentState.Exit(mOwner);
				Debug.Log("Exiting state: " + mCurrentState);
			}
			
			mCurrentState = inNewState;
			
			mCurrentState.Enter(mOwner);
			
			Debug.Log("Entering state: " + inNewState);
		}
	}
}