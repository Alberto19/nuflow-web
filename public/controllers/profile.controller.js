(function () {
	'use strict';

	angular
		.module('app')
		.controller('ProfileController', ProfileController);

	ProfileController.$inject = ['$state','Profile'];

	function ProfileController($state, Profile) {
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
				vm.user.picture = user.data.picture;
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
				Profile.getProfile().then(user => {
					vm.user.picture = user.data.picture;
				});
				Materialize.toast('Imagem Atualizada com sucesso', 3000);
			});
		}

	}
})();