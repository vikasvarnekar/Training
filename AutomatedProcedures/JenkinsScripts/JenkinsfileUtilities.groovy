def create(nantEnvironmentVariables = [:]) {
	def self = [
		nantEnvironmentVariables: nantEnvironmentVariables
	]

	self.getCustomCredentialId = { credentialsId ->
		def customCredentialIdsMap = [
			'Innovator.License.String': env.InnovatorLicenseStringSecretTextId ?: 'InnovatorLicense12',
			'MSSQL.Innovator.Password': env.CustomMssqlInnovatorPasswordCredentialId,
			'MSSQL.SA.Password': env.CustomMssqlSaPasswordCredentialId,
			'MSSQL.Innovator.Regular.Password': env.CustomMssqlInnovatorRegularPasswordCredentialId,
			'MSTeamsWebHook': env.CustomMSTeamsWebHookCredentialId
		]

		return customCredentialIdsMap[credentialsId] ?: credentialsId
	}

	self.putCredentialToBindingsIfValid = { credential, credentialBindings ->
		def doAdd = false
		def credentialVariableName = credential.variable ?: credential.usernameVariable
		credential.credentialsId = self.getCustomCredentialId(credential.credentialsId)
		try {
			withCredentials([credential]) {
				def credentialVariableValue = env[credentialVariableName] ?: env[self.getCustomCredentialId(credentialVariableName)]
				doAdd = (credentialVariableValue != null) && credentialVariableValue != ''
			}
		}
		catch (org.jenkinsci.plugins.credentialsbinding.impl.CredentialNotFoundException e) {
			doAdd = false
		}
		finally {
			if (doAdd) {
				credentialBindings.add(credential)
			}
		}
		return doAdd
	}

	self.addNantEnvironmentVariable = { name, value ->
		self.nantEnvironmentVariables.put(name, value)
	}

	self.getNantEnvironmentVariableArray = {
		def nantPropertyToJenkinsParametersMap = [
			'Innovator.License.Type': 'LicenseType',
			'Innovator.Activation.Key': 'LicenseActivationKey',
			'Innovator.License.Key': 'LicenseKey'
		]
		nantPropertyToJenkinsParametersMap.each { nantPropertyName, jenkinsParameter ->
			// Do not prioritize jenkins parameter over environment
			// since we tend to not use custom jenkins naming
			if (!env[nantPropertyName] && env[jenkinsParameter]) {
				self.addNantEnvironmentVariable(nantPropertyName, env[jenkinsParameter])
			}
		}

		return self.nantEnvironmentVariables.collect { name, value -> "${name}=${value}" }
	}

	self.runNantTargets = { targetList, doReturnStatus ->
		def exitCode = 0
		def environmentVariablesForNant = self.getNantEnvironmentVariableArray()
		def nantTargetsString = targetList.join(' ')

		withEnv(environmentVariablesForNant) {
			exitCode = bat returnStatus: doReturnStatus ?: false, encoding: 'UTF-8', script: """
				call AutomatedProcedures\\BatchUtilityScripts\\SetupExternalTools.bat
				%PathToNantExe% -buildfile:AutomatedProcedures\\NantScript.xml ${nantTargetsString}
			"""
		}

		return exitCode
	}

	self.createCopy = {
		return create(self.nantEnvironmentVariables.clone())
	}

	return self
}

return create()