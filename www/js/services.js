angular.module("500WordsApp")

.factory("Data", function($q, $http) { 
	return new function() {
		this.get500Words = function() { 
			var deferred = $q.defer();
			$http({method: 'GET', url: '500words.json'}).
			success(function(data, status, headers, config) {
				deferred.resolve(data);
			}).
			error(function(data, status, headers, config) {
				deferred.resolve("Error: " + status);
			});

			return deferred.promise;
		}
	}
})

