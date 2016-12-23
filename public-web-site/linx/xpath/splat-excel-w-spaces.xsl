<xsl:stylesheet 
	  xmlns:spi="http://tempuri.org/SPITestXMLSchema.xsd"
      xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	  xmlns:dtc="urn:http://tempuri.org/SPITestXMLSchema.xsd"
	  xmlns="urn:http://tempuri.org/SPITestXMLSchema.xsd"
      version="1.0">
<!-- indicates what our output type is going to be -->
<xsl:output method="text" />		
<xsl:strip-space elements="block"/>

<xsl:template match="/">
	TestName,<xsl:value-of select="/Root/TestParameters/TestName"/>
	state_name, <xsl:value-of select="/Root/TestParameters/CustomTestParameters/state_name"/>
	lob,<xsl:value-of select="/Root/TestParameters/CustomTestParameters/lob"/>,
	<xsl:for-each select="/Root/Page">
		<xsl:apply-templates/>
	</xsl:for-each>
</xsl:template>
<xsl:template match="Button">Button,<xsl:value-of select="./@name"/></xsl:template>
<xsl:template match="Select">Select <xsl:value-of select="./@name"/>,
	<xsl:for-each select="Case">
		<xsl:apply-templates/>
	</xsl:for-each>
</xsl:template>
<xsl:template match="SetFieldValue"><xsl:value-of select="./@name"/>,<xsl:value-of select="."/>
</xsl:template>
<xsl:template match="Function">Function,<xsl:value-of select="./@name"/>
</xsl:template>
<xsl:template match="AssertTextExists">Assert <xsl:value-of select="."/>,<xsl:value-of select="./@exists"/>
</xsl:template>
<!-- xsl:template match="text()">
		<xsl:value-of select="translate(. , $tab , '')"/>
	</xsl:template -->
</xsl:stylesheet>
