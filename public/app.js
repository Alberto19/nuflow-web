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
