<%@ page language="java" import="java.sql.*"%>
<html>
<body>
<%
Class.forName("com.mysql.jdbc.Driver"); //.newInstance();


Connection connect=null;
ResultSet resultSet=null;
Statement statement=null;

try{
String url="jdbc:mysql://ec2-xxxxxxute-1.amazonaws.com?user=yourDBUsername&password=yourDBPassword";

int i=1;
connect=DriverManager.getConnection(url);
statement=connect.createStatement();
resultSet=statement.executeQuery("select * from test.testdata");
//writeResultSet(resultSet);
while (resultSet.next()) {
%>
<%=resultSet.getString("foo")%>
<%
}
resultSet.close();
statement.close();
connect.close();
}catch(Exception e){
	System.out.println(e.getMessage());
}
%>
</body>
</html>
