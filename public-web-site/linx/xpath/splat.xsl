<xsl:stylesheet 
	  xmlns:spi="http://tempuri.org/SPITestXMLSchema.xsd"
      xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	  xmlns:dtc="urn:http://tempuri.org/SPITestXMLSchema.xsd"
	  xmlns="urn:http://tempuri.org/SPITestXMLSchema.xsd"
      version="1.0">

<!-- indicates what our output type is going to be -->
<xsl:output method="html" />		
	
	<xsl:template match="/">
	
		<html>
	
			<head>
				
				<title>Script for <xsl:value-of select="/Root/TestParameters/TestName"/></title>
				
			</head>
			
			<body>
				1) TestName= <xsl:value-of select="/Root/TestParameters/TestName"/><br/>

				2) state_name= <xsl:value-of select="/Root/TestParameters/CustomTestParameters/state_name"/><br/>
				3) lob= <xsl:value-of select="/Root/TestParameters/CustomTestParameters/lob"/><br/>

				<xsl:for-each select="/Root/Page">
					<xsl:apply-templates/>
				</xsl:for-each>
				

			</body>
	
		</html>
	
	</xsl:template>
	
	  <xsl:template match="Button">
		Click Button: <xsl:value-of select="./@name"/><br/>
	  </xsl:template>
	  <xsl:template match="Select">
		Select <xsl:value-of select="./@name"/><br />
		<xsl:for-each select="Case">
			<xsl:apply-templates/>
		</xsl:for-each>
	  </xsl:template>
	  <xsl:template match="SetFieldValue">
		Enter value into <xsl:value-of select="./@name"/>: <xsl:value-of select="."/><br/>
	  </xsl:template>
	  <xsl:template match="Function">
		Function: <xsl:value-of select="./@name"/><br/>
	  </xsl:template>
	  <xsl:template match="AssertTextExists">
		Assert <xsl:value-of select="."/>: <xsl:value-of select="./@exists"/><br/>
	  </xsl:template>
</xsl:stylesheet>
