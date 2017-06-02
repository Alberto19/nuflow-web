(function ($) {
    'use strict';

    angular
        .module('app')
        .controller('FeedPlaceController', FeedPlaceController);

    FeedPlaceController.$inject = ['$stateParams', 'Search', 'auth', '$q', 'Events', 'Favorite'];

    function FeedPlaceController($stateParams, Search, auth, $q, Events, Favorite ) {
        var vm = this;
        vm.place = null;
        vm.events = null;
        vm.like = like;
        vm.check = false;
        vm.favorite = false;
        vm.checkIn = checkIn;

        function checkIn(eventId) {
        vm.check = !vm.check;
        const data = {
            companyId: $stateParams.placeId,
            favorite: vm.favorite,
            check: vm.check,
            eventId
        };
        Favorite.postFavorite(data)
            .then(() => {
                Materialize.toast('CheckFeito', 3000);
            })
        }


        function like(eventId){
            vm.favorite = !vm.favorite;
            const data = {
                companyId: $stateParams.placeId,
                favorite: vm.favorite,
                check: vm.check,
                eventId
            };
            Favorite.postFavorite(data)
                .then(() => {
                    Materialize.toast('Evento Favoritado', 3000);
                })
        }
       

        function getFavorite() {
        var tes = new Promise((res, rej) => {
        Favorite.get()
            .then((events) => {
            events.data.map(favo => {
            vm.events.map(even => {
                if (favo.eventId === even._id) {
                    vm.check = true;
                    vm.favorite = true;
                    res(vm.check)
                } 
                })
            });
        });
        });
    tes.then(() => {
        console.log('a')
    })
    }

        getById()
        .then(() => getFavorite());
     
        function getById() {
            var placeId = $stateParams.placeId;
           return Search.getById(placeId)
              .then(place => {
                return getPhotoCompany(place.data);
            })
            .then(data => {
                vm.place = data;
                return getAllEvents();
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
            Events.getAllParam($stateParams.placeId).then(events => {
                return getBanners(events.data);
            }).then(dataEvents => {
                vm.events = dataEvents
            });
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