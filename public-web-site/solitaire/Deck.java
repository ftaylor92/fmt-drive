import java.util.Random;

class Deck
{
	Card[] aCards;
	
	Deck()
	{
		/* Maybe Use lazy calculations ?*/
		aCards= new Card[52];
		
		byte c= 0;
		for(byte val=0; val <= 13; val++)
		{
			for(byte suit= Card.sSPADES; suit <= Card.sCLUBS; suit++)
			{
				aCards[c].iValue= val;
				aCards[c].eSuit= suit;
				c++;
			}
		}
	}
	
	public void Shuffle()
	{
		Random	RNG= new Random(361);
		long r= RNG.nextInt();
		
		RNG= null;
	}
}
