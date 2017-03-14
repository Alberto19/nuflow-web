(function () {
	'use strict';

	angular
		.module('app')
		.factory('authData', authData);

	authData.$inject = [];

	function authData() {
		/** Cached Instances **/
		var cachedToken = null;

		/* Service */
		var service = {
			parseData: parseData,
			clearData: clearData,

			getToken: getToken,
			setToken: setToken,
		};

		return service;

		////////////////

		/* Login Data */
		function parseData(data) {
			setToken(data.token);
		}

		function clearData() {
			setToken();
		}

		/* API Token - Value */
		function getToken() {
			if (!cachedToken) {
				var value = localStorage.getItem('token');
				cachedToken = value ? value : null;
			}

			return cachedToken;
		}

		function setToken(token) {
			cachedToken = token;

			if (token) {
				localStorage.setItem('token', token);
			}else{
			localStorage.removeItem('token');
			}

		}
	}
})();