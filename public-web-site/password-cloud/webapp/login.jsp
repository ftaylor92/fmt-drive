<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0//EN">

<html>
<head>
<title>Login Page for Examples</title>
<body bgcolor="white">
	<!-- form method="GET" action="j_security_check"> -->
	<form method="GET" action="login">
		<table>
			<tr>
				<th align="right">Username:</th>
				<td align="left"><input type="text" name="j_username"></td>
			</tr>
			<tr>
				<th align="right">Password:</th>
				<td align="left"><input type="password" name="j_password"></td>
			</tr>
			<tr>
				<!-- input type="hidden" name="role_name" value="user" / -->
				<input type="hidden" name="site_name" value="password-site" />
				<td align="right"><input type="submit" value="LogIn"></td>
				<td align="left"><input type="reset"></td>
			</tr>
		</table>
	</form>
</body>
</html>