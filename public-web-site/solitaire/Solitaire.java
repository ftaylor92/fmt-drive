import java.applet.*;
import java.awt.*;
import java.awt.image.*;


public class Solitaire extends Applet
{
	Image backImage;
	//Deck mCards;
	GifPict gp;
	
	public void init()
	{
		backImage=this.getImage(this.getDocumentBase(),"images/cardback.gif");
		gp= new GifPict();
		gp.backImage=this.getImage(this.getDocumentBase(),"images/cardback.gif");
	}

/*	public static void main(String[] args)
	{
		GifPict gp= new GifPict();
		gp.init();
		Graphics g= new Graphics();
		g.create(10,10,40,40);
		gp.paint(g);
		System.out.println("Hello, Brooklyn");
		backImage= getImage(getCodeBase(), "cardback.gif");
		//backImage =this.getImage(this.getDocumentBase(),"cardback.gif");
	}
	
	Solitaire()
	{	
	}*/

  public void paint(Graphics g) {
    this.setBackground(Color.black);
    g.drawImage(gp.backImage, 0, 0, this);
    //gp.paint(g);
  }  // paint
}
