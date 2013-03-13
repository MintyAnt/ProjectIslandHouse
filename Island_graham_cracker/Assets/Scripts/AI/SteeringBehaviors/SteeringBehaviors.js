
//----------------------------------------------------------------------------//
public enum eSteeringComponent
{
	// Usin dem bits to allow multiple states to be enabled
	//at once, with a single variable.
	Seek = 0x00000,
	Flee = 0x00002,
	Arrive = 0x00004
}

//----------------------------------------------------------------------------//
public enum eDeceleration
{
	Fast = 1,
	Normal = 2,
	Slow = 3
}

//----------------------------------------------------------------------------//
class SteeringBehaviors
{
	// Variables
	private var mOwner : Entity;
	private var mSteeringForce : Vector2;
	private var mSteeringFlags : eSteeringComponent = 0;

	private var mSeekPoint : Vector2;
	private var mFleePoint : Vector2;
	private var mArrivePoint : Vector2;
	private var mDeceleration : eDeceleration = eDeceleration.Normal;
	
	private var mWeightSeek : float = 1.0f;
	private var mWeightFlee : float = 1.0f;
	private var mWeightArrive : float = 1.0f;
	
	// Accessors
	function IsComponentEnabled(inComponentType : eSteeringComponent) : boolean { return ((mSteeringFlags & inComponentType) == inComponentType); }
	function SetSeekPoint(inSeekPoint : Vector2) { mSeekPoint = inSeekPoint; }
	function SetArrivePoint(inArrivePoint : Vector2) { mArrivePoint = inArrivePoint; }
	function SetArriveSpeed(inArriveSpeed : eDeceleration) { mDeceleration = inArriveSpeed; }
	
	// Mutators
	function EnableComponent(inComponentType : eSteeringComponent) { mSteeringFlags |= inComponentType; Debug.Log("Enabling " + inComponentType); }
	function DisableComponent(inComponentType : eSteeringComponent)
	{ 
		if (IsComponentEnabled(inComponentType))
			mSteeringFlags  ^= inComponentType;
	}
	
	
	//----------------------------------------------------------------------------//
	function Initialize(inOwner : Entity)
	{
		mOwner = inOwner;
	}
	
	//----------------------------------------------------------------------------//
	function Calculate() : Vector2
	{
		// Reset the steering force.
		mSteeringForce.Set(0, 0);
		
		var calculatedForce : Vector2;
		var bIsRoomForMoreForce : boolean;
		
		// Add in prioritized steering forces.
		if (IsComponentEnabled(eSteeringComponent.Seek))
		{
			Debug.Log("Seeking");
			calculatedForce = Seek(mSeekPoint) * mWeightSeek;
			
			bIsRoomForMoreForce = AccumulateForceCheck(mSteeringForce, calculatedForce);
			mSteeringForce = AccumulateForce(mSteeringForce, calculatedForce);
			if (!bIsRoomForMoreForce)
				return mSteeringForce;
		}
		
		if (IsComponentEnabled(eSteeringComponent.Flee))
		{
			Debug.Log("Fleeing");
			calculatedForce = Flee(mFleePoint) * mWeightFlee;
			
			bIsRoomForMoreForce = AccumulateForceCheck(mSteeringForce, calculatedForce);
			mSteeringForce = AccumulateForce(mSteeringForce, calculatedForce);
			if (!bIsRoomForMoreForce)
				return mSteeringForce;
		}
		
		if (IsComponentEnabled(eSteeringComponent.Arrive))
		{
			Debug.Log("Ariving");
			calculatedForce = Arrive(mArrivePoint, mDeceleration) * mWeightArrive;
			
			bIsRoomForMoreForce = AccumulateForceCheck(mSteeringForce, calculatedForce);
			mSteeringForce = AccumulateForce(mSteeringForce, calculatedForce);
			if (!bIsRoomForMoreForce)
				return mSteeringForce;
		}
		
		return mSteeringForce;
	}
	
	//----------------------------------------------------------------------------//
	function AccumulateForceCheck(inRunningTotal : Vector2, inForceToAdd : Vector2) : boolean
	{
		// Whats the total length?
		var magnitudeSoFar : float = inRunningTotal.magnitude;
		
		// What's the remaining length?
		var magnitudeRemaining : float = mOwner.GetMaxForce() - magnitudeSoFar;
		if (magnitudeRemaining <= 0.0f)
		{
			return false; // No more room in our running force.
		}
		return true;
	}
	//----------------------------------------------------------------------------//
	function AccumulateForce(inRunningTotal : Vector2, inForceToAdd : Vector2) : Vector2
	{
		// Whats the total length?
		var magnitudeSoFar : float = inRunningTotal.magnitude;
		
		// What's the remaining length?
		var magnitudeRemaining : float = mOwner.GetMaxForce() - magnitudeSoFar;
		if (magnitudeRemaining <= 0.0f)
		{
			return inRunningTotal; // No more room in our running force.
		}
		
		// Determine how much more is needed to add.	
		var magnitudeToAdd : float = inForceToAdd.magnitude;
		if (magnitudeToAdd < magnitudeRemaining)
		{
			// There is room for the full force.
			inRunningTotal += inForceToAdd;
		}
		else
		{
			// Add what force remains by cutting down the force and multiplying the delta magnitude.
			var remainingForce : Vector2 = inForceToAdd;
			remainingForce.Normalize();
			remainingForce *= magnitudeRemaining;
			
			inRunningTotal += remainingForce;
		}
		
		return inRunningTotal;
	}
	
	//----------------------------------------------------------------------------//
	function Seek(inTargetPosition : Vector2) : Vector2
	{
		var targetHeading : Vector2 = inTargetPosition - mOwner.GetPosition2D();
		targetHeading.Normalize();
		
		var desiredVelocity : Vector2 = targetHeading * mOwner.GetMaxSpeed();
		
		return (desiredVelocity - mOwner.GetVelocity());
	}
	
	//----------------------------------------------------------------------------//
	function Flee(inFleePosition : Vector2) : Vector2
	{
		var desiredVelocity : Vector2 = mOwner.GetPosition2D() - inFleePosition;
		desiredVelocity.Normalize();
		desiredVelocity *= mOwner.GetMaxSpeed();
		
		return (desiredVelocity - mOwner.GetVelocity());
	}
	
	//----------------------------------------------------------------------------//
	function Arrive(inTargetPosition : Vector2, inDeceleration : eDeceleration) : Vector2
	{
		var vectorToTarget : Vector2 = inTargetPosition - mOwner.GetPosition2D();
		
		var distanceToTarget : float = vectorToTarget.magnitude;
		
		if (distanceToTarget > 0)
		{
			// eDecel is an int, use this to get it more precise.
			var DECELERATION_TWEAKER : float  = 0.3f;
			
			var speedAsInt : int = inDeceleration;
			var speedToTarget : float = speedAsInt;
			speedToTarget *= DECELERATION_TWEAKER;
			speedToTarget = distanceToTarget / speedToTarget;
			
			// Clamp speed to max speed
			speedToTarget = Mathf.Min(speedToTarget, mOwner.GetMaxSpeed());
			
			var desiredVelocity : Vector2 = vectorToTarget * speedToTarget / distanceToTarget;
			
			return (desiredVelocity - mOwner.GetVelocity());
		}
		
		return Vector2.zero;
	}
	
	//----------------------------------------------------------------------------//
	function Pursuit(inEvader) : Vector2
	{
		
	}
}