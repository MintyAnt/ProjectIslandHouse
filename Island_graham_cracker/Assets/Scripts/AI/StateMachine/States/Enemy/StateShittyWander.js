#pragma strict


//----------------------------------------------------------------------------//
class StateShittyWander extends State
{
	// Members //
	private var mCurrentDestination : Vector3;
	
	// Methods //
	//----------------------------------------------------------------------------//
	function Enter(inEntity : Entity)
	{
		// Choose a new destination
		mCurrentDestination = inEntity.transform.position + new Vector3(Random.Range(-4, 4), 0, Random.Range(-4, 4));
	}
	
	//----------------------------------------------------------------------------//
	function Execute(inEntity: Entity) 
	{
		// Head towards the destination by our speed.
		var position = inEntity.transform.position;
		var heading = mCurrentDestination - position;
		heading.Normalize();
		position += (heading * 0.1f);
		inEntity.transform.position = position;
		
		if (Vector3.Distance(mCurrentDestination, position) <= 1.0f)
		{
			mCurrentDestination = position + new Vector3(Random.Range(-4, 4), 0, Random.Range(-4, 4));
		}
	}
	
	//----------------------------------------------------------------------------//
	function Exit(inEntity : Entity) 
	{
	
	}
}