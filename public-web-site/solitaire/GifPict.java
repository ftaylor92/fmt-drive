import java.applet.*;
import java.awt.*;
import java.awt.image.*;

public class GifPict extends Applet {

  Image backImage;
 
  public void init() {
    backImage =this.getImage(this.getDocumentBase(),"images/cardback.gif");
  }

  public void paint(Graphics g) {
    this.setBackground(Color.black);
    g.drawImage(backImage, 0, 0, this);
  }  // paint
} //GIF
