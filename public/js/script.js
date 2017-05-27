(function () {
    'use strict';

    angular.module('app', [
        'ui.materialize',
        'ui.router',
        'ngResource',
        'satellizer',
        'ngFileUpload',
        'ngMaterial',
        'ngAnimate'
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
                    url: '^',
                    controller: 'LayoutController as vm',
                    templateUrl: 'views/layouts/main.html',
                })
                 .state('main.feed', {
                    url: '/feed',
                    controller: 'FeedController as vm',
                    templateUrl: 'views/partials/feed.html',
                })
                .state('main.place', {
                    url: '/feed/:placeId',
                    controller: 'FeedPlaceController as vm',
                    templateUrl: 'views/partials/feedPlace.html',
                })
                //Rota perfil usuario
                .state('main.profile', {
                    url: '/profile',
                    controller: 'ProfileController as vm',
                    templateUrl: 'views/partials/profile.html',
                })
                //Rota perfil Company
                .state('main.profileCompany', {
                    url: '/profileCompany',
                    controller: 'ProfileCompanyController as vm',
                    templateUrl: 'views/partials/profileCompany.html',
                })
                //rotas de evento
                .state('main.event', {
                    url: '^/event',
                    template: '<ui-view/>',
                })
                .state('main.event.list',{
                    url: '/list',
                    controller: 'AllEventsController as vm',
                    templateUrl: 'views/partials/event/allEvents.html',
                })
                .state('main.event.edit', {
                    url: '/edit/:eventId',
                    controller: 'EventEditController as vm',
                    templateUrl: 'views/partials/event/editEvent.html',
                })
                .state('main.event.create', {
                    url: '/create',
                    controller: 'EventController as vm',
                    templateUrl: 'views/partials/event/event.html',
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
            // baseApiUrl: "http://localhost:3000/api"
            baseApiUrl: "https://nuflow.herokuapp.com/:3000/api"
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
            login,
            register,
            getPhoto,
            getById,
            getPhotoCompany,
            logout
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

         function getById(id) {
            return $http.post(`${config.baseApiUrl}/auth/getById`, {id})
                .then((result) => {
                    return result.data;
                }, (error) => {
                    return error;
                });
        };

        function getPhotoCompany(id) {
            return $http.post(`${config.baseApiUrl}/auth/photoCompany`, {id})
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

    Events.$inject = ['$http', 'config', 'Upload'];

    function Events($http, config, Upload) {
        var service = {
            getById: getById,
            getAll: getAll,
            post: post,
            put:put,
            uploadBanner: uploadBanner,
            getBanner: getBanner,
        };

        return service;

        function getById(eventId) {
            return $http.get(`${config.baseApiUrl}/event/${eventId}`);
        };

        function getAll() {
            return $http.get(`${config.baseApiUrl}/event`);
        };

        function post(event) {
            return $http.post(`${config.baseApiUrl}/event`, event);
        };

        function put(id, event){
            return $http.put(`${config.baseApiUrl}/event`, {id, event});
        };

        function getBanner(eventId) {
           return $http.post(`${config.baseApiUrl}/event/banner`, {banner: eventId});
        };

        function uploadBanner(id, banner) {
            return Upload.upload({
                url: `${config.baseApiUrl}/event/uploadBanner`,
                data: {
                    file: banner,
                    id: id
                }
            });
        };
    }
})();
(function () {
    'use strict';

    angular
        .module('app')
        .factory('Navigation', Navigation);

    Navigation.$inject = ['$http', 'config'];

    function Navigation($http, config ) {
        var service = {
            get: get
        };

        return service;

        ////////////////
        function get() {
            return $http.get(config.baseApiUrl + '/navigation');
        };
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
            return $http.post(`${config.baseApiUrl}/user/updateProfile`, profile);
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
        .factory('ProfileCompany', ProfileCompany);

    ProfileCompany.$inject = ['$http', 'config', 'Upload'];

    function ProfileCompany($http, config, Upload) {
        var service = {
            getProfileCompany,
            updateProfileCompany,
            uploadPhoto,
            sendComment
        };

        return service;

        ////////////////
        function getProfileCompany() {
            return $http.get(config.baseApiUrl + '/company/ProfileCompany');
        };

        function updateProfileCompany(ProfileCompany) {
            return $http.post(`${config.baseApiUrl}/company/updateProfileCompany`, ProfileCompany);
        };

        function uploadPhoto(photo){
            return Upload.upload({
                url: `${config.baseApiUrl}/auth/uploadPhoto`,
                data: { file: photo }
            });
        }

        function sendComment(id, comment, rating){
            return $http.post(`${config.baseApiUrl}/company/comments`, {id, comment, rating});
        };
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
            getById: getById
        };
        return service;

        ////////////////

        function searchLocations(location){
            return $http.post(`${config.baseApiUrl}/search/places`, location);
        };

        function getById(placeId) {
            return $http.get(`${config.baseApiUrl}/search/places/${placeId}`);
        }
    }
})();

(function () {
  'use strict';

  angular
    .module('app')
    .component('balada', {
      templateUrl: 'components/html/balada.component.html',
      controller: BaladaController,
      bindings: {
        id: '=',
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
        description: '=',
      },
    }).directive('starRating', starRating);

  BaladaController.$inject = ['ProfileCompany'];
  function BaladaController(ProfileCompany) {
    var $ctrl = this;
    $ctrl.isReadonly = true;
    $ctrl.distance = 0;
    $ctrl.comment = null;
    $ctrl.sendRating = 1;

    $ctrl.sendComment = function() {
      ProfileCompany.sendComment($ctrl.id, $ctrl.comment, $ctrl.sendRating)
      .then(result => {
        console.log(result);
      });
    };

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
            <i class="material-icons">star</i>
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
            scope.onRatingSelect = () =>({
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

	NavigationController.$inject = ['$state','auth','$rootScope', 'Navigation'];
	function NavigationController($state, auth, $rootScope, Navigation) {
		var $ctrl = this;

		$ctrl.nav = {
			button: null,
			path: '',
			profile: null
		};

		$ctrl.user = {
			name: null,
			email: null,
			picture: null
		};
		$ctrl.path = () => {
			$state.go(`${$ctrl.nav.path}`);
		};
		$ctrl.profile = () => {
			$state.go(`${$ctrl.nav.profile}`);
		};

		$ctrl.logout = ()=>{
			auth.logout();
			$rootScope.$emit('forbidden');
		};

		function getProfile() {
			auth.getPhoto().then(photo => {
				$ctrl.user.picture = photo;
			});
		};
		
		function getNavigation(){
			Navigation.get().then(nav => {
				$ctrl.nav.button = nav.data.button;
				$ctrl.nav.path = nav.data.path;
				$ctrl.nav.profile = nav.data.profile;
			});
		}
		$ctrl.$onInit = function() { 
			getProfile();
			getNavigation();
		};
		$ctrl.$onChanges = function(changesObj) {
		};
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

        vm.post = post;
        vm.delete = deleted;
        getAll();

        function getAll() {
            Events.getAll().then(events => {
               return getBanners(events.data);
            }).then(dataEvents => vm.events = dataEvents);
        };

        function getBanners(dataEvents) {
            var defer = $q.defer();
            dataEvents.map(event => {
                Events.getBanner(event.banner).then(banner => {
                    event.banner = banner.data;
                });
                defer.resolve(dataEvents);
            });
            return defer.promise;
        };

        function post() {
            $state.go('main.event.create');
        }
        
        function deleted(id){
            alert(id);
        }
    }
})();
(function () {
    'use strict';
    angular
        .module('app')
        .controller('EventController', EventController);

    EventController.$inject = ['$state', 'Events', '$timeout'];

    function EventController($state, Events, $timeout) {
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

        vm.post = post;
        vm.uploadBanner = uploadBanner;

        function post() {
            Events.post(vm.event).then(event => {
                if (event.data.token === null) {
                    $state.go('main.event');
                } else {
                    vm.event.id = event.data.eventId;
                    vm.showEvent = false;
                    vm.showBanner = true;
                }
            });
        }

        function uploadBanner() {
            Events.uploadBanner(vm.event.id, vm.event.file).then(() => {
                Materialize.toast('Banner Enviado com sucesso', 3000);
                $timeout($state.go('main.event.list'), 4000);
            });
        }
    }
})();
(function () {
    'use strict';
    angular
        .module('app')
        .controller('EventEditController', EventEditController);

    EventEditController.$inject = ['$state', 'Events', '$stateParams', '$timeout'];

    function EventEditController($state, Events, $stateParams, $timeout) {
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

        vm.put = put;
        vm.uploadBanner = uploadBanner;

        getById();

        function getById() {
            var eventId = $stateParams.eventId;
            Events.getById(eventId).then(event => {
                vm.event.name = event.data.name;
                vm.event.type = event.data.type;
                vm.event.dateEvent = event.data.dateEvent;
                vm.event.price = event.data.price;
                vm.event.description = event.data.description;
                vm.event.artists = event.data.artists;
                Events.getBanner(event.data.banner).then(banner => {
                    vm.event.banner = banner.data;
                });
            });
        };

        function put() {
            if (vm.event.banner != null) {
                vm.event.banner = null;
                vm.event.file = null;
            }
            Events.put($stateParams.eventId, vm.event).then((result) => {
                    Materialize.toast('Evento Atualizado com sucesso', 3000);
                    $timeout($state.go('main.event.list'), 4000);
                    // getById();
                },
                (err) => {
                    Materialize.toast(err.message, 3000);
                });
        };

        function uploadBanner() {
            Events.uploadBanner($stateParams.eventId, vm.event.file).then((eventBanner) => {
                Events.getBanner(eventBanner.data).then(banner => {
                    vm.event.banner = banner.data;
                });
                Materialize.toast('Banner Atualizado com sucesso', 3000);
                $timeout($state.go('main.event.list'), 4000);
            });
        }
    }
})();
(function ($) {
    'use strict';

    angular
        .module('app')
        .controller('FeedController', FeedController);

    FeedController.$inject = ['$state', 'Search', 'auth', '$q', '$scope'];

    function FeedController($state, Search, auth, $q, $scope) {
        var vm = this;
        vm.locations = null;
        vm.radius = 10;
        vm.distance = 0;
        vm.location = null;
        vm.changeRadius = function changeRadius() {
            makeLocation();
        }

        if (navigator.geolocation) {
           makeLocation();
        } else {
            alert("Geolocation is not supported by this browser.");
        };
        async function makeLocation() {
            navigator.geolocation
            .getCurrentPosition((position) => {
                vm.location = [position.coords.latitude, position.coords.longitude];
                let raio = angular.copy(vm.radius);
                vm.distance = raio /= 100;
                let find = {
                    location: vm.location,
                    radius: vm.distance,
                    keyword: ''
                    };
                Search.searchLocations(find)
                    .then((result) => {
                        return getPhotoCompany(result.data);
                    })
                    .then(data => {
                        data.map(location => {
                            if(location.days.length === 7) {
                                location.days = ['domingo à domingo'];
                            }
                        })
                        vm.locations = data;
                    });
                function getPhotoCompany(companies){
                    var defer = $q.defer();
                        companies.map(company => {
                            auth.getPhotoCompany(company._id)
                            .then(picture => {
                                company.photos[0] = picture
                            });
                            defer.resolve(companies);
                        });
                    return defer.promise;
                } 
    });
    }
    }
})(jQuery);
(function ($) {
    'use strict';

    angular
        .module('app')
        .controller('FeedPlaceController', FeedPlaceController);

    FeedPlaceController.$inject = ['$stateParams', 'Search', 'auth', '$q', 'Events'];

    function FeedPlaceController($stateParams, Search, auth, $q, Events) {
        var vm = this;
        vm.place = null;
        vm.events = null;

        getById();

        function getById() {
            var placeId = $stateParams.placeId;
            Search.getById(placeId)
              .then(place => {
                return getPhotoCompany(place.data);
            })
            .then(data => {
                if (data.days.length === 7) {
                    data.days = ['domingo à domingo'];
                }
                vm.place = data;
                getAllEvents();
            });
        
        };

         function getPhotoCompany(company) {
            var defer = $q.defer();
            auth.getPhotoCompany(company._id)
                .then(picture => {
                    company.photos[0] = picture;
                    defer.resolve(company);
                });
            return defer.promise;
        }


        function getAllEvents() {
            Events.getAll().then(events => {
               return getBanners(events.data);
            }).then(dataEvents => vm.events = dataEvents);
        };

        function getBanners(dataEvents) {
            var defer = $q.defer();
            dataEvents.map(event => {
                Events.getBanner(event.banner).then(banner => {
                    event.banner = banner.data;
                });
                defer.resolve(dataEvents);
            });
            return defer.promise;
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

	ProfileCompanyController.$inject = ['$state', 'ProfileCompany', 'auth'];

	function ProfileCompanyController($state, ProfileCompany, auth) {
		var vm = this;
		vm.company = {
			name: null,
			email: null,
			photos: null,
			adress: null,
			location: [-23.5868979,-46.9796286],
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
			description: null,
		};

		vm.uf = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA',
		 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN','RS','RO','RR','SC','SP','SE','TO'];

		vm.getProfileCompany = getProfileCompany;
		vm.updateProfileCompany = updateProfileCompany;
		vm.uploadPhoto = uploadPhoto;

		getProfileCompany();

		function getProfileCompany() {
			ProfileCompany.getProfileCompany().then(company => {
				vm.company.name = company.data.name;
				vm.company.email = company.data.email;
				vm.company.photos = company.data.photo;
				vm.company.adress = company.data.adress;
				vm.company.rating = company.data.rating;
				vm.company.mapsUrl = company.data.mapsUrl;
				vm.company.country = company.data.country;
				vm.company.uf = company.data.uf;
				vm.company.reviews = company.data.reviews;
				vm.company.phone = company.data.phone;
				vm.company.days = company.data.days;
				vm.company.drinkPrice = company.data.drinkPrice;
				vm.company.site = company.data.site;
				vm.company.description = company.data.description;

				auth.getPhoto().then(photo => {
					if (photo.status != 404) {
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
