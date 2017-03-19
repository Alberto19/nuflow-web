(function () {
    'use strict';

    angular.module('app', [
        'ui.materialize',
        'ui.router',
        'ngResource',
        'satellizer'
        ])
        .config(['$httpProvider',($httpProvider)=>{
            // Add http interceptors
            $httpProvider.interceptors.push('authInterceptor');
        }])
        .run(['$rootScope', '$state', 'authData', ($rootScope, $state, authData)=> {
            // Page changed event
            $rootScope.$on('$stateChangeStart', (event, next, current)=> {
                let token = authData.getToken();

                if (!token && next.name != 'login') {
                    event.preventDefault();
                    $state.go('login');
                }
            });

            // Global forbidden event
            $rootScope.$on('forbidden', ()=> {
                // Force redirect to login again
                $state.go('login');
            });
        }]);
})();

(function () {
    'use strict';

    angular
        .module('app')
        .config(['$locationProvider', '$stateProvider', '$urlRouterProvider', ($locationProvider, $stateProvider, $urlRouterProvider)=> {
            // Use URLs without hash
            $locationProvider.html5Mode(true);

            // Login routes
            $stateProvider
                .state({
                    name:'login',
                    url: '/',
                    controller: 'LoginController as vm',
                    templateUrl: 'views/layouts/login.html'
                })
                .state({
                    name:'register',
                    url: '/cadastro',
                    controller: 'RegisterController as vm',
                    templateUrl: 'views/layouts/register.html'
                })

                // Home routes
                .state('main', {
                    abstract: true,
                    url: '',
                    controller: 'LayoutController as vm',
                    templateUrl: 'views/layouts/main.html',
                })
                 .state('main.feed', {
                    url: '/feed',
                    controller: 'FeedController as vm',
                    templateUrl: 'views/partials/feed.html',
                })

        }]);
})();

(function () {
    'use strict';

    angular
        .module('app')
        .factory('config', config);

    function config() {
        return {
            // baseApiUrl: "https://nuflow.herokuapp.com/api"
            baseApiUrl: "http://localhost:3000/api"
        };
    }
})();

(function () {
    'use strict';

    angular
        .module('app')
        .factory('auth', auth);

    auth.$inject = ['$http', 'authData', 'config'];

    function auth($http, authData, config) {
        var service = {
            login: login,
            register: register,
            logout: logout
        };

        return service;

        ////////////////
        function login(user) {
            return $http.post(config.baseApiUrl + '/user/login',user)
            .then((data) =>{
                    var loginData = data.data;
                    authData.parseData(loginData);
                    return loginData;
                },
                 (error)=>{
                      if(error.status == 404){
                          Materialize.toast(error.data, 3000);
                     }
                     if(error.status == 401){
                         Materialize.toast(error.data, 3000);
                     }
                     return error;
                });
        }

        function register(user) {
            return $http.post(config.baseApiUrl + '/user/cadastrar', user)
            .then((data)=> {
                    var loginData = data.data;
                    authData.parseData(loginData);
                },(error)=> {
                    if(error.status == 500){
                         Materialize.toast(error.data, 3000);
                         return error;
                     }
                });
        }

        function logout() {
            authData.clearData();
        }
    }
})();
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
(function () {
    'use strict';

    angular
        .module('app')
        .factory('authInterceptor', authInterceptor);

    authInterceptor.$inject = ['$rootScope', '$q', 'authData'];

    function authInterceptor($rootScope, $q, authData) {
        var service = {
            request: request,
            responseError: responseError
        };

        return service;

        ////////////////

        function request(config) {
            var token = authData.getToken();

            // Inject API token on all requests
            if (token) {
                config.headers['x-access-token'] = token;
            }

            return config;
        }

        function responseError(response) {
            // Forbidden response
            if (response.status == 403) {
                // Remove login data
                authData.clearData();

                // Emit global forbidden event
                $rootScope.$emit('forbidden');
            }

            return $q.reject(response);
        }
    }
})();
(function () {
    'use strict';

    angular
        .module('app')
        .factory('Desejo', Desejo);

    Desejo.$inject = ['$http', 'config'];

    function Desejo($http, config) {
        var service = {
            getDesejos: getDesejos,
            cadastrar:cadastrar,
            getDesejo:getDesejo,
            editar:editar,
            deletar:deletar
        };

        return service;

        ////////////////
        function getDesejos() {
            return $http.get(config.baseApiUrl + '/desejo');
        };
        function cadastrar(desejo){
            return $http.post(config.baseApiUrl + '/desejo/create', desejo);
        };
        function getDesejo(desejo) {
            return $http.get(config.baseApiUrl + '/desejo/edit/' + desejo);
        }
        function editar(desejo) {
            return $http.post(config.baseApiUrl + '/desejo/editar/', desejo);
        }
        function deletar(desejo) {
            return $http.post(config.baseApiUrl + '/desejo/delete/' + desejo);
        }
    }
})();

(function () {
    'use strict';

    angular
        .module('app')
        .factory('Search', Search);

    Search.$inject = ['$http', 'config'];

    function Search($http, config) {
        var service = {
            searchLocations: searchLocations,
        };
        return service;

        ////////////////

        function searchLocations(location){
            return $http.post(config.baseApiUrl + '/search/places', location);
        };
    }
})();

(function() {
'use strict';

	// Usage:
	// 
	// Creates:
	// 

	angular
		.module('app')
		.component('balada', {
			templateUrl:'components/html/balada.component.html',
			controller: BaladaController,
			bindings: {
				name: '=',
				adress: '=',
				phone: '=',
				rating: '=',
				site: '=',
				mapsUrl: '=',
				days: '=',
				reviews: '=',
				photos: '=',
			},
		});

	//NavigationController.$inject = ['dependency1'];
	function BaladaController() {
		var $ctrl = this;
		

		////////////////

		$ctrl.$onInit = function() { };
		$ctrl.$onChanges = function(changesObj) { };
		$ctrl.$onDestory = function() { };
	}
})();
(function() {
'use strict';

	// Usage:
	// 
	// Creates:
	// 

	angular
		.module('app')
		.component('navigation', {
			templateUrl:'components/html/navigation.component.html',
			controller: NavigationController,
			bindings: {
				show: '=',
			},
		});

	NavigationController.$inject = ['auth','$rootScope'];
	function NavigationController(auth, $rootScope) {
		var $ctrl = this;

		$ctrl.logout = ()=>{
			auth.logout();
			$rootScope.$emit('forbidden');
		}
		

		////////////////

		$ctrl.$onInit = function() { };
		$ctrl.$onChanges = function(changesObj) { };
		$ctrl.$onDestory = function() { };
	}
})(jQuery);
(function () {
	'use strict';
	angular
		.module('app')
		.component('search', {
			templateUrl: 'components/html/search.component.html',
			controller: SearchController,
			bindings: {
				Binding: '=',
			},
		});

	function SearchController() {
		var $ctrl = this;


		////////////////

		$ctrl.$onInit = function () {};
		$ctrl.$onChanges = function (changesObj) {};
		$ctrl.$onDestory = function () {};
	}
})();
(function () {
    'use strict';

    angular
        .module('app')
        .controller('FeedController', FeedController);

    FeedController.$inject = ['$state', 'Search'];

    function FeedController($state, Search) {
        var vm = this;
        vm.locations = null;
        vm.radius = 4000;

        if (navigator.geolocation) {
            navigator
                .geolocation
                .getCurrentPosition((position) => {
                    vm.location = [position.coords.latitude, position.coords.longitude];
                    vm.radius /= 6371;
                    let find = {
                        location: vm.location,
                        radius: vm.radius,
                        keyword: 'C'
                    };
                    Search.searchLocations(find).then(
                        (result) => {
                            console.log(result);
                            vm.locations = result.data;
                        },
                        () => {

                        }
                    );
                });
        } else {
            alert("Geolocation is not supported by this browser.");
        };
    }
})();
(function () {
    'use strict';

    angular
        .module('app')
        .controller('LayoutController', LayoutController);

    LayoutController.$inject = ['auth', '$state'];

    function LayoutController(auth, $state) {
        var vm = this;

        vm.logout = logout;
        vm.desejos = desejos;

        function logout() {
            auth.logout();
            $state.go('login');
        }
        function desejos() {
            $state.go('login');
        }
       
    }
})();

(function () {
    'use strict';

    angular
        .module('app')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$state', 'auth'];

    function LoginController($state, auth) {
        var vm = this;
        vm.user = {
            email: null,
            password: null
        }

        vm.login = login;
        ////////////////

        function login() {
            auth.login(vm.user).then(
                (result) => {
                    if(result.status != 401 && result.status != 404){
                    $state.go('main.feed');    
                    }
                });
        }
    }
})();
(function () {
	'use strict';

	angular
		.module('app')
		.controller('RegisterController', RegisterController);

	RegisterController.$inject = ['auth', '$state'];
	function RegisterController(auth, $state) {
		var vm = this;
		vm.user = {
			email: null,
			password:null,
			genre:null
		};
		vm.register = register;

		function register() {
			auth.register(vm.user)
				.then((response) =>{
					if(response.status != 500){
					$state.go('main.feed');
					}
				});
		};
	}
})();
//# sourceMappingURL=script.js.map
