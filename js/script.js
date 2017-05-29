// >750 range through multiple ajax calls; check returned location == within set boundary's coords
// hashtags only given for the caption (not the comments)
// fix landscape photos 
// phone touch events
// more than 20 photos (pagination)
// hover information
// on click information and link
// refactor code; reduce redundancies with reusable methods
// custom google markers

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
myApp.ig.currHashtag = "";
myApp.ig.currPosts = [];
myApp.ig.currPostsLocations = [];

myApp.init = function() {
	myApp.google.init();
	myApp.ig.init();
}

https://api.instagram.com/v1/media/{media-id}?access_token=ACCESS-TOKEN
myApp.getMediaInfoByID = function(id) {

}

// https://api.instagram.com/v1/locations/search?lat=48.858844&lng=2.294351&access_token=ACCESS-TOKEN
myApp.ig.getLocationsByCoords = function(lat, lng, distance) {
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
	myApp.ig.addLocationListener();
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
		draggableCursor: "default",
		clickableIcons: false
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
	// myApp.ig.getContent();
}

myApp.ig.getContent = function() {
	myApp.ig.currPosts = [];
	var currLocation = myApp.google.currLocation;
	if (currLocation.lat != null && currLocation.lng != null) 
	{
		var lat = currLocation.lat;
		var lng = currLocation.lng;
		$.when(myApp.ig.getLocationsByCoords(lat, lng, 750))
		.then(myApp.ig.updateCurrLocationsList);
	}
}

myApp.ig.updateCurrLocationsList = function(response) {
	myApp.ig.currLocationsList = response.data;

	args = myApp.ig.currLocationsList.map(n => myApp.ig.getMediaByLocationID(n.id));

	$.when(...args)
	.then(function(...response) {
		console.log(response); // array of response objects 
		for (var i = 0; i < response.length; i++) 
		{
			if (response[i][0].data == undefined) { continue; } // some response objects will have no data; returns error code 400 "this location does not exist"
			response[i][0].data.forEach(function(post) 
			{
				var tempObj = 
				{
					id: post.id,
					location: post.location.name,
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
	$(".ig-feed__gallery .container").remove();
	$(".filters").empty();
	myApp.ig.currPostsLocations = [];
	if (myApp.ig.currHashtag != "") 
	{
		
		for (var i = 0; i < myApp.ig.currPosts.length; i++)
		if (myApp.ig.currPosts[i].tags.includes(myApp.ig.currHashtag)) 
		{
			$(".ig-feed__gallery").append(`<div class="container">
				<div class="container__image">
				<img src="${myApp.ig.currPosts[i].image.url}" alt="Instagram Post" class="gallery-item" id="${myApp.ig.currPosts[i].id}" data-location="${myApp.ig.currPosts[i].location}">
				</div>
				</div>`);
			if (!(myApp.ig.currPostsLocations.includes(myApp.ig.currPosts[i].location)))
			{
				myApp.ig.currPostsLocations.push(myApp.ig.currPosts[i].location);
				$(".filters").append(`<li><button class="location location--selected">${myApp.ig.currPosts[i].location}</button></li>`)
			}
		}
	}
	else 
	{
		for (var i = 0; i < myApp.ig.currPosts.length; i++) 
		{
			$(".ig-feed__gallery").append(`<div class="container">
				<div class="container__image">
				<img src="${myApp.ig.currPosts[i].image.url}" alt="Instagram Post" class="gallery-item" id="${myApp.ig.currPosts[i].id}" data-location="${myApp.ig.currPosts[i].location}">
				</div>
				</div>`);
			if (!(myApp.ig.currPostsLocations.includes(myApp.ig.currPosts[i].location)))
			{
				myApp.ig.currPostsLocations.push(myApp.ig.currPosts[i].location);
				$(".filters").append(`<li><button class="location location--selected">${myApp.ig.currPosts[i].location}</button></li>`)
			}
		}
	}
	var targets = $(".gallery-item");
	var count = 0;
	for (var i = 0; i < targets.length; i++) 
	{
		if ($(targets[i]).parent().parent().css("display") == "none") 
		{
			count++;
		}
	}
	if (targets.length == 0 || count == targets.length) { $(".no-content").css("visibility", "visible"); }
	else { $(".no-content").css("visibility", "hidden"); }
}

myApp.google.stickyMap = function() {
	var headerHeight = $("nav").height();
	var footerPosition = $("footer").offset().top;
	$(window).scroll(function() 
	{
		if (window.scrollY >= 0) 
		{
			if ($(window).width() > 780) 
			{
				$(".map-view").css("top", "initial");
				$(".map-view").css("bottom", 0);
				var expansionValue = window.scrollY;
				$(".map-container").css("height", `calc(100vh - 90px + ${expansionValue}px)`);
				if (window.scrollY >= headerHeight) 
				{
					$(".map-container").css("height", "calc(100vh)");
				}
			}
		}
	});
}

myApp.ig.addFilterListener = function() {
	$(".filters-toggle").on("click touchstart", function(event) 
	{
		event.preventDefault();
		$(".filters").toggleClass("filters--visible");
		if ($(".filters").hasClass("filters--visible")) 
		{
			$(this).html(`<i class="fa fa-chevron-up" aria-hidden="true"></i><span>Location Filters</span>`);
		}
		else 
		{
			$(this).html(`<i class="fa fa-chevron-down" aria-hidden="true"></i><span>Location Filters</span>`);
		}
	});
}

myApp.ig.addHashtagListener = function() {
	$(".hashtag-search__submit").on("click touchstart", function(event) 
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
			$(".hashtag-search__curr").html(`<button><i class="fa fa-times" aria-hidden="true"></i></button>
				<span>#${myApp.ig.currHashtag}</span>`);
			myApp.ig.updateGallery();
		}
	});

	$(".options-bar").on("click touchstart", ".hashtag-search__curr button", function(event) 
	{
		event.preventDefault();
		$(".hashtag-search__curr").html("N/A");
		myApp.ig.currHashtag = "";
		myApp.ig.updateGallery();
	});
}

myApp.ig.addLocationListener = function() {
	$(".filters").on("click touchstart", ".location", function(event) 
	{
		event.preventDefault();
		$(this).toggleClass("location--selected");
		var filter = $(this).html();
		var targets = $(".gallery-item");

		// could shorten maybe
		if ($(this).hasClass("location--selected")) 
		{
			for (var i = 0; i < targets.length; i++) 
			{
				if ($(targets[i]).data("location") == filter) 
				{
					$(targets[i]).parent().parent().css("display", "block");
				}
			}
		}
		else 
		{
			for (var i = 0; i < targets.length; i++) 
			{
				if ($(targets[i]).data("location") == filter) 
				{
					$(targets[i]).parent().parent().css("display", "none");
				}
			}
		}
		var count = 0;
		for (var i = 0; i < targets.length; i++) 
		{
			if ($(targets[i]).parent().parent().css("display") == "none") 
			{
				count++;
			}
		}
		if (count == targets.length) { $(".no-content").css("visibility", "visible"); }
		else { $(".no-content").css("visibility", "hidden"); }
	});
}

$(function() {
	myApp.init();
});