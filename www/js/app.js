angular.module("500WordsApp", ["ionic"])

.controller("MainController", function($scope, $ionicSideMenuDelegate, $ionicScrollDelegate, $timeout, Data) { 

	var index = 0;
	var MAXWORDS = 20;
	var masterList = [];
//	var currentWordList = [];
	var languageMode = [];
	languageMode["EN"] = "EN";
	languageMode["VN"] = "VN";

	$scope.categoryLists = ["Common Phrases", "Greetings", "Numbers", "Colors", "Date & Time"];

	$scope.wordList = [];
	$scope.currentWordList = [];

	$scope.vnMode = false;
	$scope.enMode = false;
	$scope.isSearchVisible = true;
	$scope.wordListLoaded = false;
	$scope.languageMode = languageMode["EN"];
	$scope.isEnglish = $scope.languageMode == languageMode["EN"];

	var promise = Data.get500Words();
	promise.then( function(wordList) { 
		masterList = sortAlphabetical(wordList);
		loadWords(0, masterList);
	});

	function loadWords(currentIndex, theList) {
		var tempArray = [];
		for(var i=currentIndex; i < MAXWORDS; i++) {
			tempArray.push(theList[i]);
		}
		$scope.wordList = tempArray;
		$scope.wordListLoaded = true;
		
		index = currentIndex + MAXWORDS;
		$scope.currentWordList = theList;
		$scope.$broadcast('scroll.infiniteScrollComplete');
	}
	function loadMoreWords() { 
		var tempArray = $scope.wordList;
		for(var i=index; i < MAXWORDS; i++) {
			tempArray.push($scope.currentWordList[i]);
		}
		$scope.wordList = tempArray;
		index += MAXWORDS;
		$scope.$broadcast('scroll.infiniteScrollComplete');
	}
	function sortAlphabetical(list) { 
		return list.sort(function(a,b) { return ((a.english > b.english) ? 1 : (a.english < b.english ? -1 : 0) ); });
	}

	$scope.hasMoreWords = function() { return index < $scope.currentWordList.length; }
	$scope.hasWords = function() { return $scope.wordList.length > 0; }
	$scope.toggleLanguageMode = function() { 
		$scope.languageMode = ($scope.languageMode == languageMode["EN"]) ? languageMode["VN"] : languageMode["EN"];
		$scope.isEnglish = $scope.languageMode == languageMode["EN"];
		performSearch($scope.searchText);
	}
	
	$scope.loadMoreWords = loadMoreWords;

	var timeout;
	$scope.handleChange = function() {
		$timeout.cancel(timeout);
		timeout = $timeout(function() { 
			performSearch($scope.searchText);
		}, 500)
	}

	$scope.search = function(searchText) {
		$timeout.cancel(timeout);
		performSearch(searchText);
	}

	function performSearch(text) {
		if(text == null || text.length <= 0) {
			loadWords(0, masterList);
			return;
		}

		$scope.currentWordList = [];
		var tempArray = [];
		var count = 0;

		for(var index in masterList) {
			var currentWord = ($scope.languageMode == languageMode["EN"]) ? masterList[index].english : masterList[index].vietnamese;
			if(currentWord.indexOf(text) >= 0) {
				$scope.currentWordList.push(masterList[index]);
				count++;
				if(count >= MAXWORDS && tempArray.length <= 0) { angular.copy($scope.currentWordList, tempArray); }
			}
		}

		if(tempArray.length <= 0) { tempArray = $scope.currentWordList; }
		angular.copy(tempArray, $scope.wordList);
		$ionicScrollDelegate.scrollTop();
	}

	$scope.toggleSearch = function() { $scope.isSearchVisible = !$scope.isSearchVisible }

//	$scope.toggleLeft = function() { $ionicSideMenuDelegate.toggleLeft(); }
//	$scope.toggleRight = function() { $ionicSideMenuDelegate.toggleRight(); }
})