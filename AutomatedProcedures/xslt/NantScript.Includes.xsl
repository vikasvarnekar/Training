<xsl:stylesheet version = "1.0" xmlns:xsl = "http://www.w3.org/1999/XSL/Transform">
<xsl:param name="fileName"/>
<xsl:param name="fileCount"/>
<xsl:template match = "project">
	<xsl:variable name="newline"><xsl:text>&#xa;</xsl:text></xsl:variable>

	<xsl:if test="$fileCount=1">
		<xsl:value-of select="$newline" />
		<xsl:value-of select="$newline" />
		<xsl:text>## Include files:</xsl:text>
		<xsl:value-of select="$newline" />
		<xsl:text>There are several include files. They help to store utility scripts and scripts taken from outer source. Files automatically included by the main script when it starts. There are following include files:</xsl:text>
		<xsl:value-of select="$newline" />
		<xsl:value-of select="$newline" />
		<xsl:text>Nant script include file | Description</xsl:text>
		<xsl:value-of select="$newline" />
		<xsl:text>--- | ---</xsl:text>
	</xsl:if>

	<xsl:value-of select="$newline" />
	<xsl:value-of select="$fileName" />
	<xsl:text> | </xsl:text>
	<xsl:value-of select = "description"/>
</xsl:template>
</xsl:stylesheet>