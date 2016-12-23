package sample.hello.resources;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import javax.naming.*;
import javax.sql.*;
import java.sql.*;

 //see: http://www.ibm.com/developerworks/web/library/wa-aj-tomcat/index.html
@Path("/hello")
public class HelloResource {
	@GET
	@Produces(MediaType.TEXT_PLAIN)
	public String sayHello() {
		return "Hello Cloudbees\n";
	}
}   

