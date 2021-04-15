<xsl:stylesheet version = "1.0" xmlns:xsl = "http://www.w3.org/1999/XSL/Transform">
<xsl:param name="fileName"/>
<xsl:param name="fileCount"/>
<xsl:template match = "project">
	<xsl:variable name="newline"><xsl:text>&#xa;</xsl:text></xsl:variable>

	<xsl:if test="$fileCount=1">
		<xsl:value-of select="$newline" />
		<xsl:text>## NAnt script</xsl:text>
		<xsl:value-of select="$newline" />
		<xsl:text>The entry point for any automated script in CRT is NAnt script. The script is responsible for CI/CD flow and can be treated as main bus for scripts and tool in the repository. There are several files that logically divide the script:</xsl:text>
		<xsl:value-of select="$newline" />
		<xsl:value-of select="$newline" />
		<xsl:text>Nant script source file | Target name | Description</xsl:text>
		<xsl:value-of select="$newline" />
		<xsl:text>--- | --- | ---</xsl:text>
	</xsl:if>

	<xsl:for-each select = "target">
		<xsl:value-of select="$newline" />
		<xsl:choose>
			<xsl:when test="position()=1">
				<xsl:value-of select="$fileName" />
			</xsl:when>
			<xsl:otherwise>
				<xsl:text>-</xsl:text>
			</xsl:otherwise>
		</xsl:choose>
		<xsl:text> | </xsl:text>
		<xsl:value-of select = "@name"/>
		<xsl:text> | </xsl:text>
		<xsl:value-of select = "@description"/>
	</xsl:for-each>
</xsl:template>
</xsl:stylesheet>