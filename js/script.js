// >750 range through multiple ajax calls then checking returned location
	// if within boundaries
// hashtags only show up for caption
// fix landscape photos 

var myApp = {
	ig: {},
	google: {}
}

var lol;
var arg = [];

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
myApp.ig.currHashtag = null;
myApp.ig.currPosts = [];

myApp.init = function() {
	myApp.google.init();
	myApp.ig.init();
	myApp.test();
}

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

// https://api.instagram.com/v1/media/shortcode/D?access_token=ACCESS-TOKEN
myApp.mediaInfoByShortcode = function(shortcode) {

}

https://api.instagram.com/v1/media/{media-id}?access_token=ACCESS-TOKEN
myApp.mediaInfoByID = function(id) {

}

// https://api.instagram.com/v1/locations/search?lat=48.858844&lng=2.294351&access_token=ACCESS-TOKEN
myApp.ig.locationSearch = function(lat, lng, distance) {
	console.log("my.ig.locationSearch");
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

myApp.ig.init = function() 
{
	myApp.ig.addFilterListener();
	myApp.ig.addHashtagListener();
}

myApp.google.init = function() 
{
	var mapTarget = $(".map-container");
	var searchBoxTarget = $(".map-view__search-box");
	var map = myApp.google.map;
	var searchBox = myApp.google.searchBox;

	map = new google.maps.Map(mapTarget[0], 
	{
		center: 
		{
			lat: 43.648373, 
			lng: -79.397918
		},
		zoom: 14,
		disableDefaultUI: true,
		draggableCursor: "default"
	});

	searchBox = new google.maps.places.SearchBox(searchBoxTarget[0]);
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(searchBoxTarget[0]);
	$(".map-view__search-box").attr("placeholder", "Search a Location");

	map.addListener("click", function(e) 
	{
		myApp.google.placeMarker(e.latLng, map); 
	});

	searchBox.addListener("places_changed", function() 
	{ // returns an array of places
		var searchResults = searchBox.getPlaces(); 
		myApp.google.placeMarker(searchResults[0].geometry.location, map);
	});
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
	myApp.ig.pullContent();
}

myApp.ig.pullContent = function() {
	$(".ig-feed__gallery").empty();
	myApp.ig.currPosts = [];
	var currLocation = myApp.google.currLocation;
	if (currLocation.lat != null && currLocation.lng != null) 
	{
		var lat = currLocation.lat;
		var lng = currLocation.lng;
		$.when(myApp.ig.locationSearch(lat, lng, 750))
		.then(myApp.ig.updateCurrLocationsList);
	}
	// else
	// {
	// 	alert("No locations selected.");
	// }
}

myApp.ig.updateCurrLocationsList = function(response) {
	myApp.ig.currLocationsList = response.data;

	args = myApp.ig.currLocationsList.map(n => myApp.ig.getMediaByLocationID(n.id));

	$.when(...args)
	.then(function(...response) {
		console.log(response);
		for (var i = 0; i < response.length; i++) 
		{
			response[i][0].data.forEach(function(post) 
			{
				var tempObj = 
				{
					id: post.id,
					location: name,
					image: post.images.standard_resolution,
					likes: post.likes.count,
					comments: post.comments.count,
					// link: post.link,
					tags: post.tags,
					user: post.user.username,
					userPic: post.user.profile_picture
				};
				myApp.ig.currPosts.push(tempObj);
				console.log(tempObj);
			});
		}
		myApp.ig.updateGallery();
	});
}

myApp.ig.updateGallery = function() {
	if (myApp.ig.currHashtag != null) 
	{
		for (var i = 0; i < myApp.ig.currPosts.length; i++)
		if (myApp.ig.currPosts[i].tags.includes(myApp.ig.currHashtag)) 
		{
			$(".ig-feed__gallery").append(`<div class="container">
				<div class="container__image">
				<img src="${myApp.ig.currPosts[i].image.url}" alt="" class="">
				</div>
				</div>`);
		}
	}
	else 
	{
		for (var i = 0; i < myApp.ig.currPosts.length; i++) 
		{
			$(".ig-feed__gallery").append(`<div class="container">
				<div class="container__image">
				<img src="${myApp.ig.currPosts[i].image.url}" alt="" class="">
				</div>
				</div>`);
		}
	}
	
}

myApp.google.stickyMap = function() {
	var headerHeight = $("nav").height();
	var footerPosition = $("footer").offset().top;
	$(window).scroll(function() 
	{
		if (window.scrollY >= 0) 
		{
			$(".map-view").css("top", "initial");
			$(".map-view").css("bottom", 0);
			var expansionValue = window.scrollY;
			$(".map-container").css("height", `calc(100vh - 90px + ${expansionValue}px)`);
			if (window.scrollY >= headerHeight) 
			{
				$(".map-container").css("height", "calc(100vh)");
				if (window.scrollY >= footerPosition) 
				{
					console.log("hi");
				}
			}
		}
	});
}

myApp.ig.addFilterListener = function() {
	$(".filters-toggle").on("click", function() 
	{
		$(".filters").toggleClass("filters--visible");
		if ($(".filters").hasClass("filters--visible")) 
		{
			$(this).html(`<i class="fa fa-chevron-up" aria-hidden="true"></i></span>Location Filters</span>`);
		}
		else 
		{
			$(this).html(`<i class="fa fa-chevron-down" aria-hidden="true"></i><span>Location Filters</span>`);
		}
	});
}

myApp.ig.addHashtagListener = function() {
	$(".hashtag-search__submit").on("click", function(event) 
	{
		event.preventDefault();
		myApp.ig.currHashtag = $(".hashtag-search__field").val();

		if (myApp.ig.currHashtag.replace(/\s/g, '') == "") 
		{
			alert("Invalid hashtag.");
		}
		else 
		{
			$(".hashtag-search__field").val("");
			if ($(".hashtag-search__curr"))
			{
				$(".hashtag-search__curr").remove();
			}
			$(".hashtag-search").after(`<div class="hashtag-search__curr">
				<button><i class="fa fa-times" aria-hidden="true"></i></button><span>#${myApp.ig.currHashtag}
				</span></div>`);
			myApp.ig.updateGallery();
		}
	});

	$(".options-bar").on("click", ".hashtag-search__curr button", function() 
	{
		$(".hashtag-search__curr").remove();
		myApp.ig.currHashtag = null;
		myApp.ig.updateGallery();
	});
}

$(function() {
	myApp.init();
});