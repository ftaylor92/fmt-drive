import java.awt.image.*;

class Card
{
	final static byte sSPADES	=0;
	final static byte sHEARTS	=1;
	final static byte sDIAMONDS	=2;
	final static byte sCLUBS	=3;

	public	byte	eSuit;
	public	byte	iValue;
	private boolean	bShown;
	
	/*all=null by default
	Card()
	{
		iValue= 0;
		bShown= false;
	}*/
	
	public void Draw() {
	}
}
