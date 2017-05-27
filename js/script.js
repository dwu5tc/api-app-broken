// https://developers.google.com/places/web-service/get-api-key
// limit IP addresses
// 

var myApp = {
	ig: {},
	google: {}
}

var lol;

myApp.google.API_KEY = "AIzaSyDnP_DNUIMP3V6yZlGWdLepItdtcmsnJEo";
myApp.ig.CLIENT_ID = " 9eabcfa6570c43c8bcbf0cba7afc004e";
myApp.ig.CLIENT_SECRET = "3d40f599366c49bd88553122e89b65a0";
myApp.ig.accessToken = "4734181.aeb44d4.23d517c9f493425cb68b37b5f8f2f6d1";
myApp.google.map;
myApp.google.searchBox;
myApp.google.currMarker = null;
myApp.google.markers = [];
myApp.google.currLocation = {
	lat: null,
	lng: null
}
myApp.ig.currLocationsList = [];

myApp.init = function() {
	myApp.test();
	myApp.google.init();
	myApp.ig.init();
}
 
// myApp.getIG = function(name, callback) {
// 	var endpoint = myApp.IG_BASE_URL + "/tags/" + name + "/media/recent?access_token=" + myApp_IG_CLIENT_ID;
// 	var getPosts = $.ajax({
// 		url: endpoint,
// 		dataType: "jsonp",
// 		type: "GET",
// 	});
// }

// https://www.instagram.com/oauth/authorize/?client_id=aeb44d4afdda4729b71cc508597b1ff2&redirect_uri=http://localhost&response_type=token&scope=basic+public_content+follower_list+comments+relationships+likes

myApp.test = function() {
	var tagName = "canada";
	var tagName2 = "visvim";
	// $.when(myApp.ig.searchByTagsRecent(tagName2))
	// 	.then(function(response) {
	// 		console.log(tagName2, response);
	// 	})
	// 	.catch(function(error) {
	// 		console.log(error);
	// 	});
	// $.when(myApp.ig.searchByTagsRecent(tagName, 1, "1334310321472510937_4734181", 11))
	// 	.then(function(response) {
	// 		console.log(tagName, response);
	// 	});

	/*
	$.when(myApp.ig.locationSearch(34.029746, -118.519660, 750))
		.then(function(response) {
			console.log("locseach resp", response);
		});
	$.when(myApp.ig.getMediaByLocationID("591016204"))
		.then(function(response) {
			
			// console.log("locsearchid resp", response);
			// console.log("slaksgjasg", response.data);
			response.data.forEach(function(post) {
				console.log("laksgjlaksjglaksjglkasjglkasjlgkajsljga");
				$(".ig-feed__gallery").append(`<div class="container">
					<div class="container__image">
					<img src="${post.images.standard_resolution.url}" alt="" class="">
					</div>
					</div>`);
			});
		});
		*/
}



/*
 *		TAG ENDPOINTS
 */

myApp.ig.searchByTagsRecent = function(...params) {
	var endpoint = "https://api.instagram.com/v1/tags/" + params[0] + "/media/recent";
	// console.log(endpoint);
	// console.log(params);
	if (params.length < 2) 
	{
		return $.ajax({
			url: endpoint,
			method: "GET",
			dataType: "jsonp",
			data: {
				access_token: myApp.ig.accessToken,
			}
		});
	}
	else if (params[1] == 1) 
	{
		return $.ajax({
			url: endpoint,
			method: "GET",
			dataType: "jsonp",
			data: {
				access_token: myApp.ig.accessToken,
				max_tag_id: params[2],
				count: params[3],
			}
		});
	}
	else if (params[1] == 0) 

	{
		return $.ajax({
			url: endpoint,
			method: "GET",
			dataType: "jsonp",
			data: {
				access_token: myApp.ig.accessToken,
				min_tag_id: params[2],
				count: params[3],
			}
		});
	}
}



myApp.search 

myApp.getPhoto = function(object) { 

}



// https://api.instagram.com/v1/media/search?lat=48.858844&lng=2.294351&access_token=ACCESS-TOKEN
myApp.mediaSearchByCoordinates = function(lat, lng, dst) {

}

// https://api.instagram.com/v1/media/shortcode/D?access_token=ACCESS-TOKEN
myApp.mediaInfoByShortcode = function(shortcode) {

}

https://api.instagram.com/v1/media/{media-id}?access_token=ACCESS-TOKEN
myApp.mediaInfoByID = function(id) {

}

// https://api.instagram.com/v1/locations/search?lat=48.858844&lng=2.294351&access_token=ACCESS-TOKEN
myApp.ig.locationSearch = function(lat, lng, distance) {
	return $.ajax({
		url: "https://api.instagram.com/v1/locations/search",
		method: "GET",
		dataType: "jsonp",
		data: {
			access_token: myApp.ig.accessToken,
			lat: lat,
			lng: lng,
			distance: distance
		}
	});
}

myApp.ig.updateLocationsList = function(obj) {
	myApp.ig.currLocationsList = obj.data;
}

myApp.ig.getMediaByLocationIDs = function(...params) {
	var endpoint = `https://api.instagram.com/v1/locations/${params[0]}/media/recent`
	// console.log(this.name, "endpoint", endpoint);
	// console.log(this.name, "params", params);
	if (params.length < 2) 
	{
		return $.ajax({
			url: endpoint,
			method: "GET",
			dataType: "jsonp",
			data: {
				access_token: myApp.ig.accessToken,
			}
		});
	}
	else if (params[1] == 1) 
	{
		return $.ajax({
			url: endpoint,
			method: "GET",
			dataType: "jsonp",
			data: {
				access_token: myApp.ig.accessToken,
				max_tag_id: params[2],
				count: params[3],
			}
		});
	}
	else if (params[1] == 0) 
	{
		return $.ajax({
			url: endpoint,
			method: "GET",
			dataType: "jsonp",
			data: {
				access_token: myApp.ig.accessToken,
				min_tag_id: params[2],
				count: params[3],
			}
		});
	}
}



myApp.ig.getMediaByLocationID = function(...params) {
	var endpoint = `https://api.instagram.com/v1/locations/${params[0]}/media/recent`
	// console.log(this.name, "endpoint", endpoint);
	// console.log(this.name, "params", params);
	if (params.length < 2) 
	{
		return $.ajax({
			url: endpoint,
			method: "GET",
			dataType: "jsonp",
			data: {
				access_token: myApp.ig.accessToken,
			}
		});
	}
	else if (params[1] == 1) 
	{
		return $.ajax({
			url: endpoint,
			method: "GET",
			dataType: "jsonp",
			data: {
				access_token: myApp.ig.accessToken,
				max_tag_id: params[2],
				count: params[3],
			}
		});
	}
	else if (params[1] == 0) 
	{
		return $.ajax({
			url: endpoint,
			method: "GET",
			dataType: "jsonp",
			data: {
				access_token: myApp.ig.accessToken,
				min_tag_id: params[2],
				count: params[3],
			}
		});
	}
}

myApp.ig.init = function() {
	myApp.ig.addFilterListener();
}

myApp.google.init = function() {
	var mapTarget = $(".map-container");
	var searchBoxTarget = $(".map-view__search-box");
	var map = myApp.google.map;
	var searchBox = myApp.google.searchBox;

	map = new google.maps.Map(mapTarget[0], {
		center: {
			lat: 43.648373, 
			lng: -79.397918
		},
		zoom: 14,
		disableDefaultUI: true,
		draggableCursor: "default"
	});

	searchBox = new google.maps.places.SearchBox(searchBoxTarget[0]);
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(searchBoxTarget[0]);

	map.addListener("click", function(e) {
		myApp.google.placeMarker(e.latLng, map); 
		// console.log(myApp.google.currLocation);
	});

	searchBox.addListener("places_changed", function() { // returns an array of places
		var searchResults = searchBox.getPlaces(); 
		myApp.google.placeMarker(searchResults[0].geometry.location, map);
		// console.log(myApp.google.currLocation);
	});

	myApp.google.addContentRefreshEventListener();
	myApp.google.stickyMap();
}

myApp.google.placeMarker = function(latLng, map) {
	if (myApp.google.currMarker != null) 
	{
		myApp.google.currMarker.setMap(null);
	}
	myApp.google.currMarker = new google.maps.Marker({
		position: latLng,
		map: map
	});
	myApp.google.currLocation.lat = latLng.lat();
	myApp.google.currLocation.lng = latLng.lng();
	map.panTo(latLng);
	myApp.google.updateContent();
}

myApp.google.updateContent = function() {
	var currLocation = myApp.google.currLocation;
	if (currLocation.lat != null && currLocation.lng != null) 
	{
		var lat = currLocation.lat;
		var lng = currLocation.lng;
		$.when(myApp.ig.locationSearch(lat, lng, 750))
		.then(function(resLocations) {
			myApp.ig.currLocationsList = resLocations.data;
			var locationsList = myApp.ig.currLocationsList;
			$(".ig-feed__gallery").empty();
			for (var i = 0; i < locationsList.length/2; i++) 
			{
				console.log(locationsList[i].name)
				$.when(myApp.ig.getMediaByLocationID(locationsList[i].id))
				.then(function(resMedia) {
					if (resMedia.data != null) 
					{
						resMedia.data.forEach(function(post) {
							$(".ig-feed__gallery").append(`<div class="container">
								<div class="container__image">
								<img src="${post.images.standard_resolution.url}" alt="" class="">
								</div>
								</div>`);
						});
					}
				});
			}
		});
	}
}

/*

myApp.google.addContentRefreshEventListener = function() {
	// console.log("LWITJ@(U@(U($JOGIEJOIG@JO$TIJ@#");
	$(".content-refresh").on("click", function() {
		// console.log("hihihihihihihi");
		var currLocation = myApp.google.currLocation;
		if (currLocation.lat != null && currLocation.lng != null) {
			var lat = currLocation.lat;
			var lng = currLocation.lng;
			// myApp.ig.locationSearch(lat, lng, 750).then(getMediaByLocationIDs())
			// console.log("made it here");
			$.when(myApp.ig.locationSearch(lat, lng, 750))
			.then(function(resLocations) {
				myApp.ig.currLocationsList = resLocations.data;
				var locationsList = myApp.ig.currLocationsList;
				console.log("FIRST RESPONSE!!!", resLocations)
				$(".ig-feed__gallery").empty();
				for (var i = 0; i < locationsList.length/2; i++) {
					console.log(locationsList[i].name)
					$.when(myApp.ig.getMediaByLocationID(locationsList[i].id))
					.then(function(resMedia) {
						// console.log("locsearchid resp", response);
						// console.log("slaksgjasg", response.data);
						console.log("RESPONSERESPONSE", resMedia);
						if (resMedia.data != null) {
							resMedia.data.forEach(function(post) {
								// console.log("laksgjlaksjglaksjglkasjglkasjlgkajsljga");
								$(".ig-feed__gallery").append(`<div class="container">
									<div class="container__image">
									<img src="${post.images.standard_resolution.url}" alt="" class="">
									</div>
									</div>`);
							});
						}
						else {
							console.log(i);
							console.log(locationsList[i]);
							console.log(locationsList[0]);
							console.log("no data for", locationsList[i].name)
							// console.log(response);
							// console.log(response.data);
							// alert("No posts");
						}
					});
				}
			});
			// $.when(myApp.ig.getMediaByLocationID("212920998"))
			// 	.then(function(response) {
			// 		// console.log("locsearchid resp", response);
			// 		// console.log("slaksgjasg", response.data);
			// 		response.data.forEach(function(post) {
			// 			// console.log("laksgjlaksjglaksjglkasjglkasjlgkajsljga");
			// 			$(".ig-feed__gallery").append(`<div class="container">
			// 				<div class="container__image">
			// 				<img src="${post.images.standard_resolution.url}" alt="" class="">
			// 				</div>
			// 				</div>`);
			// 		});
			// 	});
		}
	});
} */

// myApp.google.stickyMap = function() {
// 	var initialOffset = $(".map-container").offset().top;
// 	var headerHeight = $("nav").height();
// 	// $bottom = $containerHeight + $(".sticky-container").offset().top;
// 	// $maxPoint = $containerHeight - $(".social-media").height();
// 	$(window).scroll(function() {
// 		if ($(window).scrollTop() >= 0)
// 		{
// 			var expansionValue = $(window).scrollTop();
// 			$(".map-container").css("height", `calc(100vh - 60px + ${expansionValue}px)`);
// 			if ($(window).scrollTop() >= headerHeight)
// 			{
// 				var adjustmentDistance = $(window).scrollTop()-headerHeight;
// 				$(".map-container").css("transform", `translate3d(0px, ${adjustmentDistance}px, 0px)`);
// 				$(".map-container").css("height", "calc(100vh)");
// 			}
// 			else
// 			{
// 				$(".map-container").css("transform", `translate3d(0px, 0px, 0px)`);
// 			}
// 		}
// 	});
// }

// myApp.google.stickyMap = function() {
// 	var initialOffset = $(".map-container").offset().top;
// 	var headerHeight = $("nav").height();
// 	// $bottom = $containerHeight + $(".sticky-container").offset().top;
// 	// $maxPoint = $containerHeight - $(".social-media").height();
// 	$(window).scroll(function() {
// 		if (window.scrollY >= 0)
// 		{
// 			var expansionValue = window.scrollY;
// 			$(".map-container").css("height", `calc(100vh - 60px + ${expansionValue}px)`);
// 			if (window.scrollY >= headerHeight)
// 			{
// 				var adjustmentDistance = window.scrollY-headerHeight;
// 				$(".map-container").css("transform", `translate3d(0px, ${adjustmentDistance}px, 0px)`);
// 				$(".map-container").css("height", "calc(100vh)");
// 			}
// 			else
// 			{
// 				$(".map-container").css("transform", `translate3d(0px, 0px, 0px)`);
// 			}
// 		}
// 	});
// }

myApp.google.stickyMap = function() {
	var headerHeight = $("nav").height();
	var footerPosition = $("footer").offset().top;
	$(window).scroll(function() {
		if (window.scrollY >= 0)
		{
			var expansionValue = window.scrollY;
			$(".map-container").css("height", `calc(100vh - 60px + ${expansionValue}px)`);
			if (window.scrollY >= headerHeight)
			{
				$(".map-container").css("height", "calc(100vh)");
				if (window.scrollY >= footerPosition) {
					console.log("hi");
				}
			}
		}
	});
}

myApp.ig.addFilterListener = function() {
	$(".filters-toggle").on("click", function() {
		$(".filters").toggleClass("filters--visible");
		if ($(".filters").hasClass("filters--visible")) {
			$(this).html("Hide Location Filters");
		}
		else {
			$(this).html("Show Location Filters");
		}
	});
}



		// if ($(window).scrollTop() >= $offset) {
		// 	if ($(window).scrollTop() >= $bottom) {
		// 		$(".social-media").css({transform: "translate(0px,"+$maxPoint+"px)"});
		// 	}else{
		// 		$scroll = $(window).scrollTop() - $offset;
		// 		$(".social-media").css({transform: "translate(0px,"+$scroll+"px)"});
		// 	}
		// }else{
		// 	$(".social-media").css({transform: "translate(0px,0px)"});
		// }

$(function() {
	
});


// https://api.instagram.com/v1/locations/{location-id}/media/recent?access_token=ACCESS-TOKEN
myApp.locationRecent = function() {
	
}

// https://api.instagram.com/v1/tags/{tag-name}/media/recent?access_token=ACCESS-TOKEN

// myApp.popular = function() {

// }

// myApp.tagByName = function () {
// 	this.
// }

$(function() {
	myApp.init();
});