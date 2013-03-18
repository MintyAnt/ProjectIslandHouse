#pragma strict

//----------------------------------------------------------------------------//
class Enemy extends Entity
{
	protected var mVelocity : Vector2 	= Vector2.zero;
	protected var mMass : float			= 1.0f;
	protected var mMaxSpeed : float		= 5.0f;
	protected var mMaxForce : float		= 10.0f;
	protected var mMaxTurnRate : float	= 10.0f;
	
	protected var mSteering : SteeringBehaviors;
	
	// Accessors
	function GetVelocity() { return mVelocity; }
	function GetMass() { return mMass; }
	function GetMaxSpeed() { return mMaxSpeed; }
	function GetMaxForce() { return mMaxForce; }
	function GetMaxTurnRate() { return mMaxTurnRate; }
	
	//----------------------------------------------------------------------------//
	function Start()
	{
		super.Start();
		mSteering = SteeringBehaviors();
		mSteering.Initialize(this);
		
		mSteering.EnableComponent(eSteeringComponent.Seek);
		mSteering.EnableComponent(eSteeringComponent.Arrive);
		
		var destination : Vector2 = Vector2(M_ObjectToGoTo.position.x, M_ObjectToGoTo.position.z);
		mSteering.SetSeekPoint(destination);
		mSteering.SetArrivePoint(destination);
	}
	
	//----------------------------------------------------------------------------//
	function Update()
	{
		//super.Update();
		
		var destination : Vector2 = Vector2(M_ObjectToGoTo.position.x, M_ObjectToGoTo.position.z);
		mSteering.SetSeekPoint(destination);
		mSteering.SetArrivePoint(destination);
		
		// Get the steering force from the current steering type.
		// Should be in Newtons - kg * m/s^2
		var steeringForce : Vector2 = mSteering.Calculate();
		
		Debug.Log("Steering force: " + steeringForce + " Newtons");
		
		/*
			F = M * A	=	Newtons (kg * m/s^2) = kg * m/s^2
			A = F / M	=	m/s^2 = (kg * m/s^2) / kg
						=	m/s^2 = m/s^2
			
		*/
		var acceleration : Vector2 = steeringForce / mMass;
		
		/*
			V = A * s
			m/s = m/s^2 * s(but its ms)
			m/s = m/s
		*/
		mVelocity += (acceleration * Time.deltaTime);
		
		// Don't exceed our max speed.
		mVelocity = Vector2.ClampMagnitude(mVelocity, mMaxSpeed);
		
		// update the position
		var velocityWithTime : Vector2 = mVelocity * Time.deltaTime;
		
		var currentPos : Vector3 = transform.position;
		var vectorToAdd : Vector3 = Vector3(velocityWithTime.x, 0, velocityWithTime.y);
		
		currentPos += vectorToAdd;
		transform.position = currentPos;
		
		// Update the heading if the velocity is > 0
		if (mVelocity.sqrMagnitude > 0.000000001f)
		{
			mHeading = mVelocity;
			mHeading.Normalize();
			
			// Grab some vector that is perpendicular.
			mSide = Vector2Perpendicular(mHeading);
		}
		
	}
	
	//----------------------------------------------------------------------------//
	function Vector2Perpendicular(inVector2 : Vector2) : Vector2
	{
		var newVector : Vector2 = Vector2(-inVector2.y, inVector2.x);
		return newVector;
	}
}