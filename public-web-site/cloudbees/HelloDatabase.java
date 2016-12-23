package sample.hello.resources;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import javax.naming.*;
import javax.sql.*;
import java.sql.*;

 //see: http://www.ibm.com/developerworks/web/library/wa-aj-tomcat/index.html
//java.lang.ClassNotFoundException: com.sun.jersey.spi.container.servlet.ServletContainer
//java.lang.ClassNotFoundException: com.sun.jersey.spi.container.servlet.ServletContainer
@Path("/db")
public class HelloDatabase {
	  private Connection connect = null;
	  private Statement statement = null;
	  private PreparedStatement preparedStatement = null;
	  private ResultSet resultSet = null;
	  
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public String dbQuery() {
		String foo= "unfound";
		try {
			/*Context ctx = new InitialContext();
			DataSource ds = (DataSource)ctx.lookup("java:comp/env/jdbc/dailybalan-800");
			Connection conn = ds.getConnection();
			Statement stmt = conn.createStatement();
			ResultSet rst = stmt.executeQuery("select id, foo, bar from test.testdata");
			while(rst.next()) {
			 int id= rst.getInt(1);
			 foo= rst.getString(2);
			 int bar= rst.getInt(3);
			}
			conn.close();*/
			Class.forName("com.mysql.jdbc.Driver");
			  // Setup the connection with the DB
			  connect = DriverManager
			      .getConnection("jdbc:mysql://ec2-xxxx.amazonaws.com?"
			          + "user=yourDBUserName&password=yourDBPassword");

			  // Statements allow to issue SQL queries to the database
			  statement = connect.createStatement();
			  // Result set get the result of the SQL query
			  resultSet = statement
			      .executeQuery("select * from test.testdata");
			  
			  //writeResultSet(resultSet);
			  while (resultSet.next()) {
				  foo= resultSet.getString("foo");
			  }
			  resultSet.close();
			  statement.close();
			  connect.close();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			foo= e.getMessage();
		} catch (ClassNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			foo= e.getMessage();
		}
		return foo;
	}
}   

