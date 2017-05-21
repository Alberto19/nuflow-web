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