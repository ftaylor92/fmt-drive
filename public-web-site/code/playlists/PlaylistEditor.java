/**
 * Usage:
 * Run in Eclipse or another Java IDE or
 * place this file into any folder
 * run javac PlaylistEditor.java
 * move *.class files into fmt sub folder of current directory
 * run java -cp . fmt.PlaylistEditor
 */
package fmt;

import java.awt.Dimension;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Enumeration;

import javax.swing.Box;
import javax.swing.DefaultListModel;
import javax.swing.JButton;
import javax.swing.JCheckBox;
import javax.swing.JFileChooser;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JList;
import javax.swing.JMenu;
import javax.swing.JMenuBar;
import javax.swing.JMenuItem;
import javax.swing.JScrollPane;
import javax.swing.JTextField;

/**
 * @author Frank Taylor
 *
 */
public class PlaylistEditor extends JFrame {

	private final JTextField parentDir= new JTextField("C:\\");
	private final JTextField substituteParentDir= new JTextField("/");
	private final JCheckBox isSubstituteParentDir= new JCheckBox("Substitute Parent Directory");	
	private final JCheckBox isUnix= new JCheckBox("Unix");
	private final DefaultListModel songsModel= new DefaultListModel();
	
	/**
	 * Constructor.  Creates Window.
	 **/
	public PlaylistEditor() {
		super("Help Test");
				
		setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		
		//Menu
		//File
		//	Save Playlist...
		//	Quit
		final JMenuBar menuBar= new JMenuBar();
		JMenu fileMenu= new JMenu("File");

		ActionListener saveAction= new ActionListener() {
			public void actionPerformed(ActionEvent song) {
				System.out.println("Save item hit: "+ PlaylistEditor.this.parentDir.getText());
				JFileChooser chooser= new JFileChooser();
				int option= chooser.showSaveDialog(PlaylistEditor.this);
				if(option == JFileChooser.APPROVE_OPTION) {
					try {
						PrintWriter writer= new PrintWriter(new BufferedWriter(new FileWriter(chooser.getSelectedFile(), true)));
						for(Enumeration songs= songsModel.elements(); songs.hasMoreElements();) {
							writer.println(songs.nextElement());
						}
						writer.flush();
					} catch(IOException ex) {
						System.err.println(ex);
					}
				}
			}
		};
		
		ActionListener addAction= new ActionListener() {
			private File lastDirectory= null;
			
			public void actionPerformed(ActionEvent e) {
				JFileChooser chooser= new JFileChooser();
				chooser.setCurrentDirectory(lastDirectory);
				int option= chooser.showOpenDialog(PlaylistEditor.this);
				if(option == JFileChooser.APPROVE_OPTION) {
					lastDirectory= chooser.getSelectedFile().getParentFile();
					String filePath= chooser.getSelectedFile().getAbsolutePath();
					if(isSubstituteParentDir.isSelected())	filePath= filePath.replace(parentDir.getText(), substituteParentDir.getText());
					if(isUnix.isSelected())	filePath= filePath.replace('\\', '/');
					PlaylistEditor.this.songsModel.addElement(filePath);
				}
			}
		};
		
		JMenuItem saveMenuItem= new JMenuItem("Save Playlist...");
		saveMenuItem.addActionListener(saveAction);
		
		JMenuItem quitMenuItem= new JMenuItem("Quit");
		quitMenuItem.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				System.exit(0);
			}
		});
		
		fileMenu.add(saveMenuItem);
		fileMenu.add(quitMenuItem);
		menuBar.add(fileMenu);
		setJMenuBar(menuBar);
		
		

		Box verticalBox= Box.createVerticalBox();
		
		//Pane
		//[] is Unix
		//[] Substitute Parent Dir
		//[__<Parent Dir>__] (Select)
		//[__<Replacement Dir>__]
		//
		//Songs:	(Add)
		//   _____________
		//   |           |
		//   |           |
		//   |           |
		//   _____________
		//
		// (Save>
		
		JButton parentDirButton= new JButton("select");
		parentDirButton.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				JFileChooser chooser= new JFileChooser();
				int option= chooser.showOpenDialog(PlaylistEditor.this);
				if(option == JFileChooser.APPROVE_OPTION) {
					PlaylistEditor.this.parentDir.setText(chooser.getSelectedFile().getParent());
				}
			}
		});
		
		JList songs= new JList(songsModel);
		
		JButton addSongButton= new JButton("add");
		addSongButton.addActionListener(addAction);
		

		JButton saveButton= new JButton("Save");
		saveButton.addActionListener(saveAction);
		
		//Add all to panes
		Box top= Box.createHorizontalBox();
		top.add(isUnix);
		top.add(isSubstituteParentDir);
		verticalBox.add(top);
		
		Box next= Box.createHorizontalBox();
		parentDir.setMaximumSize(new Dimension(200, 30));
		substituteParentDir.setMaximumSize(new Dimension(200, 30));
		next.add(new JLabel("parentDir:")); next.add(parentDir); next.add(parentDirButton);
		verticalBox.add(next);
		
		next= Box.createHorizontalBox();
		next.add(new JLabel("substituteDir:")); next.add(substituteParentDir);
		verticalBox.add(next);
		//
		next= Box.createHorizontalBox();
		next.add(new JLabel("Songs:"));	next.add(addSongButton);
		verticalBox.add(next);
		
		JScrollPane scrollPane= new JScrollPane(songs);
		next= Box.createHorizontalBox();
		next.add(scrollPane);
		verticalBox.add(next);
		
		next= Box.createHorizontalBox();
		next.add(saveButton);
		verticalBox.add(next);
		
		add(verticalBox);
		
		setSize(500, 700);
		
		pack();
		setVisible(true);
	}
	
	/**
	 * Main.
	 * @param args <no args>
	 */
	public static void main(String[] args) {
		PlaylistEditor app= new PlaylistEditor();
	}

	
}
