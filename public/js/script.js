(function () {
    'use strict';

    angular.module('app', [
        'ui.materialize',
        'ui.router',
        'ngResource',
        'satellizer',
        'ngFileUpload'
        ])
        .config(['$httpProvider',($httpProvider)=>{
            // Add http interceptors
            $httpProvider.interceptors.push('authInterceptor');
        }])
        .run(['$rootScope', '$state', 'authData', ($rootScope, $state, authData)=> {
            // Page changed event
            $rootScope.$on('$stateChangeStart', (event, next, current)=> {
                let token = authData.getToken();

                var regex = new RegExp("[^(init)]\.[a-zA-Z]+");
                console.log(next.name.replace(regex, ""));

                if (!token && next.name.replace(regex, next.name) == 'main.*') {
                    event.preventDefault();
                    $state.go('init.login');
                }
            });

            // Global forbidden event
            $rootScope.$on('forbidden', ()=> {
                // Force redirect to login again
                $state.go('init.login');
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
                    abstract: true,
                    name:'init',
                    url: '',
                    templateUrl: 'views/layouts/init.html'
                })
            $stateProvider
                .state({
                    name:'init.login',
                    url: '/',
                    controller: 'LoginController as vm',
                    templateUrl: 'views/layouts/login.html'
                })
                .state({
                    name:'init.regiterUser',
                    url: '/cadastro',
                    controller: 'RegisterController as vm',
                    templateUrl: 'views/layouts/register.html'
                })
                .state({
                    name:'init.registerCompany',
                    url: '/cadastroCompany',
                    controller: 'RegisterCompanyController as vm',
                    templateUrl: 'views/layouts/registerCompany.html'
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
                .state('main.profile', {
                    url: '/profile',
                    controller: 'ProfileController as vm',
                    templateUrl: 'views/partials/profile.html',
                })
                .state('main.profileCompany', {
                    url: '/profileCompany',
                    controller: 'ProfileCompanyController as vm',
                    templateUrl: 'views/partials/profileCompany.html',
                })
                .state('main.event', {
                    url: '/event',
                    controller: 'EventController as vm',
                    templateUrl: 'views/partials/event.html',
                })
                .state('main.events', {
                    url: '/events',
                    controller: 'AllEventsController as vm',
                    templateUrl: 'views/partials/allEvents.html',
                })
                .state('main.test', {
                    url: '/test',
                    controller: 'TestController as vm',
                    templateUrl: 'views/partials/test.html',
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
            getPhoto: getPhoto,
            logout: logout
        };

        return service;

        ////////////////
        function login(auth) {
            return $http.post(`${config.baseApiUrl}/auth/login`, auth)
                .then(result => {
                        var loginData = result.data;
                        authData.parseData(loginData);
                        return loginData;
                    },
                    (error) => {
                        if (error.status == 404) {
                            Materialize.toast(error.data, 3000);
                        }
                        if (error.status == 401) {
                            Materialize.toast(error.data, 3000);
                        }
                        return error;
                    });
        };

        function register(user) {
            return $http.post(`${config.baseApiUrl}/auth/cadastrar`, user)
                .then((result) => {
                    var registerData = result.data;
                    authData.parseData(registerData);
                    return result.data;
                }, (error) => {
                    return error;
                });
        };

        function getPhoto() {
            return $http.get(`${config.baseApiUrl}/auth/photo`)
                .then((result) => {
                    return result.data;
                }, (error) => {
                    return error;
                });
        };


        function logout() {
            authData.clearData();
        };
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
        .factory('Events', Events);

    Events.$inject = ['$http', 'config', 'Upload', '$q'];

    function Events($http, config, Upload, $q) {
        var service = {
            getEventById: getEventById,
            createEvent: createEvent,
            updateEvent: updateEvent,
            uploadBanner: uploadBanner,
            getBanner: getBanner,
            getAllEvents: getAllEvents,
        };

        return service;

        ////////////////
        function getEventById() {
            return $http.get(`${config.baseApiUrl}/event/:id`);
        };

        function createEvent(event) {
            return $http.post(`${config.baseApiUrl}/event`, event);
        };

        function updateEvent(event) {
            return $http.put(`${config.baseApiUrl}/event/update`, event);
        };

        function getBanner(eventId) {
            var defer = $q.defer()
            debugger
            $http.post(`${config.baseApiUrl}/event/banner`, {
                id: eventId
            }).then(res => {
                debugger
                defer.resolve(res);
            });
            return defer.promise;
        };

        function uploadBanner(id, banner) {
            debugger
            return Upload.upload({
                url: `${config.baseApiUrl}/event/uploadBanner`,
                data: {
                    file: banner,
                    id: id
                }
            });
        }

        function getAllEvents() {
            return $http.get(`${config.baseApiUrl}/event`);
        }
    }
})();
(function () {
    'use strict';

    angular
        .module('app')
        .factory('Profile', Profile);

    Profile.$inject = ['$http', 'config', 'Upload'];

    function Profile($http, config, Upload) {
        var service = {
            getProfile: getProfile,
            updateProfile: updateProfile,
            uploadPhoto: uploadPhoto
        };

        return service;

        ////////////////
        function getProfile() {
            return $http.get(config.baseApiUrl + '/user/profile');
        };

        function updateProfile(profile) {
            debugger
            return $http.post(`${config.baseApiUrl}/user/updateProfile`, profile);
        };

        function uploadPhoto(photo){
            return Upload.upload({
                url: `${config.baseApiUrl}/auth/uploadPhoto`,
                data: { file: photo }
            });
        }
        // function getProfile(Profile) {
        //     return $http.get(config.baseApiUrl + '/Profile/edit/' + Profile);
        // }
        // function editar(Profile) {
        //     return $http.post(config.baseApiUrl + '/Profile/editar/', Profile);
        // }
        // function deletar(Profile) {
        //     return $http.post(config.baseApiUrl + '/Profile/delete/' + Profile);
        // }
    }
})();
(function () {
    'use strict';

    angular
        .module('app')
        .factory('ProfileCompany', ProfileCompany);

    ProfileCompany.$inject = ['$http', 'config', 'Upload'];

    function ProfileCompany($http, config, Upload) {
        var service = {
            getProfileCompany: getProfileCompany,
            updateProfileCompany: updateProfileCompany,
            uploadPhoto: uploadPhoto
        };

        return service;

        ////////////////
        function getProfileCompany() {
            return $http.get(config.baseApiUrl + '/company/ProfileCompany');
        };

        function updateProfileCompany(ProfileCompany) {
            debugger
            return $http.post(`${config.baseApiUrl}/company/updateProfileCompany`, ProfileCompany);
        };

        function uploadPhoto(photo){
            return Upload.upload({
                url: `${config.baseApiUrl}/auth/uploadPhoto`,
                data: { file: photo }
            });
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

(function () {
  'use strict';

  // Usage:
  // 
  // Creates:
  // 

  angular
    .module('app')
    .component('balada', {
      templateUrl: 'components/html/balada.component.html',
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
        locationuser: '=',
        location: '=',
      },
    }).directive('starRating', starRating);

  //NavigationController.$inject = ['dependency1'];
  function BaladaController() {
    var $ctrl = this;
    $ctrl.isReadonly = true;
    $ctrl.distance = 0;

    // alert($ctrl.locationuser);
    // let lat1 = $ctrl.locationuser[0];
    // let lon1 = $ctrl.locationuser[1];
    // let lat2 = $ctrl.location[0];
    // let lon2 = $ctrl.location[1];
    

    function distancia() {
      var R = 6371;
      var dLat = ($ctrl.location[0] - $ctrl.locationuser[0]) * (Math.PI / 180);
      var dLon = ($ctrl.location[1] - $ctrl.locationuser[1]) * (Math.PI / 180);
      var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos($ctrl.location[0] * (Math.PI / 180)) * Math.cos($ctrl.location[0] * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = R * c;
      $ctrl.distance = Math.floor(d);
    };


    ////////////////

    $ctrl.$onInit = function () {
      distancia();
    };
    $ctrl.$onChanges = function (changesObj) {};
    $ctrl.$onDestory = function () {};
  }

  function starRating() {
    return {
      restrict: 'EA',
      template: `<ul class="star-rating" ng-class="{readonly: readonly}">
          <li ng-repeat="star in stars" class="star" ng-class="{filled: star.filled}" ng-click="toggle($index)">
            <i class="material-icons">stars</i>
          </li>
        </ul>`,
      scope: {
        ratingValue: '=ngModel',
        max: '=?', // optional (default is 5)
        onRatingSelect: '&?',
        readonly: '=?'
      },
      link: function (scope, element, attributes) {
        if (scope.max == undefined) {
          scope.max = 5;
        }

        function updateStars() {
          scope.stars = [];
          for (var i = 0; i < scope.max; i++) {
            scope.stars.push({
              filled: i < scope.ratingValue
            });
          }
        };
        scope.toggle = function (index) {
          if (scope.readonly == undefined || scope.readonly === false) {
            scope.ratingValue = index + 1;
            scope.onRatingSelect({
              rating: index + 1
            });
          }
        };
        scope.$watch('ratingValue', function (oldValue, newValue) {
          if (newValue) {
            updateStars();
          }
        });
      }
    };
  }
})();
(function($) {
'use strict';
	angular
		.module('app')
		.component('navigation', {
			templateUrl:'components/html/navigation.component.html',
			controller: NavigationController,
			bindings: {
				show: '=',
			},
		});

	NavigationController.$inject = ['auth','$rootScope', 'Profile', 'ProfileCompany'];
	function NavigationController(auth, $rootScope, Profile, ProfileCompany) {
		var $ctrl = this;
		$ctrl.getProfile = getProfile;
		$ctrl.user = {
			name: null,
			email: null,
			picture: null
		};

		$ctrl.logout = ()=>{
			auth.logout();
			$rootScope.$emit('forbidden');
		};
		// if(localStorage.getItem('token') != null){
		// $ctrl.getProfile();
		// }

		function getProfile() {
			Profile.getProfile().then(user => {
				$ctrl.user.email = user.data.email;
				$ctrl.user.name = user.data.name;
				$ctrl.user.picture = user.data.picture;
			});
		};


		

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
            .controller('AllEventsController', AllEventsController);

        AllEventsController.$inject = ['$state', 'Events', '$q'];

        function AllEventsController($state, Events, $q) {
            var vm = this;
            vm.events = null;

            vm.createEvent = createEvent;
            getEvents();

            function getEvents() {
                Events.getAllEvents().then(events => {
                    debugger
                    getBanners(events.data).then(dataEvents => {
                        debugger
                        vm.events = dataEvents;
                    })
                });
            };

            function getBanners(dataEvents) {
                var events = [];
                var defer = $q.defer();
                dataEvents.map(event => {
                    Events.getBanner(event._id).then(banner => {
                        debugger
                        event.banner = banner.data;
                        defer.resolve(dataEvents);
                    });
                });
            return defer.promise;
            };

        function createEvent() {
            $state.go('main.event');
        }
    }
})();
(function () {
    'use strict';
    angular
        .module('app')
        .controller('EventController', EventController);

    EventController.$inject = ['$state', 'Events'];

    function EventController($state, Events) {
        var vm = this;
        vm.event = {
            name: null,
            type: null,
            dateEvent: new Date(),
            price: null,
            description: null,
            artists: null,
            banner: null,
            checkIn: null,
            file: null,
            id: null,
        };
        vm.showEvent = true;
        vm.showBanner = false;

        var days = 15;
        vm.date = {
            month: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
            monthShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
            weekdaysFull: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sabado'],
            weekdaysLetter: ['D', 'S', 'T', 'Q', 'QU', 'SE', 'Sab'],
            disable: [false, 1, 7],
            today: 'Hoje',
            clear: 'Limpar',
            close: 'Fechar',
            minDate: (new Date(vm.event.dateEvent.getTime() - (1000 * 60 * 60 * 24 * days))).toISOString(),
            maxDate: (new Date(vm.event.dateEvent.getTime() + (1000 * 60 * 60 * 24 * days))).toISOString(),
        };

        vm.onStart = function () {};
        vm.onRender = function () {};
        vm.onOpen = function () {};
        vm.onClose = function () {};
        vm.onSet = function () {};
        vm.onStop = function () {};

        vm.getEvent = getEvent;
        vm.createEvent = createEvent;
        vm.updateEvent = updateEvent;
        vm.uploadBanner = uploadBanner;

        // getEvent();

        function createEvent() {
            Events.createEvent(vm.event).then(event => {
                if (event.data.token === null) {
                    $state.go('main.event');
                } else {
                    vm.event.id = event.data.eventId;
                    vm.showEvent = false;
                    vm.showBanner = true;
                }
            });
        }

        function getEvent() {
            Events.getEvent().then(event => {
                vm.event.name = event.data.name;
                vm.event.type = event.data.type;
                vm.event.dateEvent = event.data.dateEvent;
                vm.event.price = event.data.price;
                vm.event.description = event.data.description;
                vm.event.artists = event.data.artists;
                vm.event.checkIn = event.data.checkIn;
                Events.getBanner().then(banner => {
                    vm.event.banner = banner;
                });
            });
        };

        function updateEvent() {
            if (vm.event.banner != null) {
                vm.event.banner = null;
                vm.event.file = null;
            }
            Events.updateEvent(vm.event).then((result) => {
                    Materialize.toast(result.message, 3000);
                },
                (err) => {
                    Materialize.toast(err.message, 3000);
                });
        };

        function uploadBanner() {
            Events.uploadBanner(vm.event.id, vm.event.file).then(() => {
                Events.getBanner(vm.event.id).then(banner => {
                    vm.event.banner = banner.data;
                });
                Materialize.toast('Banner Atualizado com sucesso', 3000);
            });
        }

    }
})();
(function ($) {
    'use strict';

    angular
        .module('app')
        .controller('FeedController', FeedController);

    FeedController.$inject = ['$state', 'Search'];

    function FeedController($state, Search) {
        var vm = this;
        vm.locations = null;
        vm.radius = 90000;
        vm.location = null;

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
})(jQuery);
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
        vm.auth = {
            email: null,
            password: null
        }

        vm.login = login;
        ////////////////

        function login() {
            auth.login(vm.auth)
                .then((result) => {
                    if (result.status != 401 && result.status != 404) {
                        debugger
                        if(result.auth.type === 'user'){
                            if (result.auth.completed === false) {
                                $state.go('main.profile');
                            } else {
                                $state.go('main.feed');
                            }
                        }else{
                             if (result.auth.completed === false) {
                                $state.go('main.profileCompany');
                            } else {
                                $state.go('main.feed');
                            }
                        }
                    }
                });
        }
    }
})();
(function () {
	'use strict';

	angular
		.module('app')
		.controller('ProfileController', ProfileController);

	ProfileController.$inject = ['$state', 'Profile', 'auth'];

	function ProfileController($state, Profile, auth) {
		var vm = this;
		vm.user = {
				email: null,
				genre: null,
				location: null,
				picture: null,
				file: null,
				age: null,
				preference: null,
				name: null
			},

			vm.getProfile = getProfile;
		vm.updateProfile = updateProfile;
		vm.uploadPhoto = uploadPhoto;

		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition((position) => {
				vm.user.location = [position.coords.latitude, position.coords.longitude];
			});
		};

		getProfile();

		function getProfile() {
			Profile.getProfile().then(user => {
				vm.user.name = user.data.name;
				vm.user.email = user.data.email;
				vm.user.genre = user.data.genre;
				vm.user.age = user.data.age;
				vm.user.preference = user.data.preference;
				auth.getPhoto().then(photo => {
					vm.user.picture = photo;
				});
			});
		};

		function updateProfile() {
			if (vm.user.picture != null) {
				vm.user.picture = null;
				vm.user.file = null;
			}
			Profile.updateProfile(vm.user).then(() => {
					Materialize.toast('Cadastro Atualizado com sucesso', 3000);
					$state.go('main.feed');
				},
				(err) => {
					Materialize.toast('Erro ao Atualizar Cadastro', 3000);
				});
		};

		function uploadPhoto() {
			Profile.uploadPhoto(vm.user.file).then(() => {
				auth.getPhoto().then(photo => {
					vm.user.picture = photo;
				});
				Materialize.toast('Imagem Atualizada com sucesso', 3000);
			});
		}

	}
})();
(function () {
	'use strict';

	angular
		.module('app')
		.controller('ProfileCompanyController', ProfileCompanyController);

	ProfileCompanyController.$inject = ['$state','ProfileCompany', 'auth'];

	function ProfileCompanyController($state, ProfileCompany, auth) {
		var vm = this;
		vm.company = {
				name: null,
				email: null,
				photos: null,
				adress: null,
				location: null,
				rating: null,
				mapsUrl: null,
				country: null,
				uf: null,
				reviews: null,
				phone: null,
				days: null,
				drinkPrice: null,
				site: null,
				file: null,
				picture: null,
			};

		vm.getProfileCompany = getProfileCompany;
		vm.updateProfileCompany = updateProfileCompany;
		vm.uploadPhoto = uploadPhoto;

		getProfileCompany();

		function getProfileCompany() {
			ProfileCompany.getProfileCompany().then(company => {
				vm.company.name  = company.data.name;
				vm.company.email  = company.data.email;
				vm.company.photos = company.data.photo;
				vm.company.adress = company.data.adress;
				vm.company.rating = company.data.rating;
				vm.company.mapsUrl = company.data.mapsUrl;
				vm.company.county = company.data.country;
				vm.company.uf = company.data.uf;
				vm.company.reviews = company.data.reviews;
				vm.company.phone = company.data.phone;
				vm.company.days = company.data.days;
				vm.company.drinkPrice = company.data.drinkPrice;
				vm.company.site = company.data.site;

				auth.getPhoto().then(photo => {
					if(photo.status != 404){
					vm.company.picture = photo;
					}
				});
			});
		};

		function updateProfileCompany() {
			if (vm.company.picture != null) {
				vm.company.picture = null;
				vm.company.photos = null;
				vm.company.file = null;
			}
			debugger
			ProfileCompany.updateProfileCompany(vm.company).then(() => {
				Materialize.toast('Cadastro Atualizado com sucesso', 3000);
					 $state.go('main.feed');
				},
				(err) => {
					Materialize.toast('Erro ao Atualizar Cadastro', 3000);
				});
		};

		function uploadPhoto() {
			ProfileCompany.uploadPhoto(vm.company.file).then(() => {
				auth.getPhoto().then(photo => {
					vm.company.picture = photo;
				});
				Materialize.toast('Imagem Atualizada com sucesso', 3000);
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
			password: null,
			genre: null,
			type: 'user',
		};
		vm.register = register;

		function register() {
			if (vm.user.genre === null) {
				vm.user.genre = 'masculino';
			}
			auth.register(vm.user)
				.then(result => {
					if (result.status != 500) {
						$state.go('main.profile');
					} else {
						Materialize.toast(result.data, 3000);
					}
				});
		};
	}
})();
(function () {
	'use strict';

	angular
		.module('app')
		.controller('RegisterCompanyController', RegisterCompanyController);

	RegisterCompanyController.$inject = ['auth', '$state'];

	function RegisterCompanyController(auth, $state) {
		var vm = this;
		vm.company = {
			email: null,
			password: null,
			type: 'company',
		};
		vm.registerCompany = registerCompany;

		function registerCompany() {
			auth.register(vm.company)
				.then(result => {
					if (result.status != 500) {
						$state.go('main.profileCompany');
					} else {
						Materialize.toast(result.data, 3000);
					}
				});
		};
	}
})();
(function ($) {
    'use strict';

    angular
        .module('app')
        .controller('TestController', TestController);

    TestController.$inject = [];

    function TestController() {
        var vm = this;



    }
})(jQuery);


//# sourceMappingURL=script.js.map
