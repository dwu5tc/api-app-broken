// >750 range through multiple ajax calls; check returned location == within set boundary's coords
// hashtags only given for the caption (not the comments)
// fix landscape photos ***DONE
// phone touch events ***DONE
// more than 20 photos (pagination)
// hover information
// on click information and link
// refactor code; reduce redundancies with reusable methods
// custom google markerList
// select all + select none on filters
// load more gallery
// animations
// hashtag filter and location filter should be consistent in how they remove gallery items
// to the top button

// "use strict"; // breaks everything

var spots = {
	ig: {},
	google: {}
}

spots.google.API_KEY = "AIzaSyCqJcWODf8O1xW6F22voppWat2wRGcAJKM";
spots.ig.CLIENT_ID = " 9eabcfa6570c43c8bcbf0cba7afc004e";
spots.ig.CLIENT_SECRET = "3d40f599366c49bd88553122e89b65a0";
spots.ig.accessToken = "4734181.aeb44d4.23d517c9f493425cb68b37b5f8f2f6d1";
// spots.ig.accessToken = "2919590029.474fd20.2a6a5b3f2954456f8636a99578b0e981";
spots.google.map;
spots.google.searchBox;
spots.google.marker = null;
// spots.google.markersList = [];
spots.google.currLocation = {
	lat: null,
	lng: null
}
spots.ig.currLocationsList = [];
spots.ig.currHashtag = "";
spots.ig.currPosts = [];
spots.ig.currPostsLocations = [];
spots.ig.maxIndex = 0; 
spots.ig.breakpoint = 0;

spots.init = function() {
	spots.google.init();
	spots.ig.init();
}



// https://www.instagram.com/oauth/authorize/?client_id=474fd20394a148f09f488fc565b8ff5e&redirect_uri=http://localhost&response_type=token&scope=public_content+basic

https://api.instagram.com/v1/media/{media-id}?access_token=ACCESS-TOKEN
spots.getMediaInfoByID = function(id) {

}

// search-box animation: center to left align 
spots.addSearchBoxFocusListener = function() {
	// $(".input")
}

// https://api.instagram.com/v1/locations/search?lat=48.858844&lng=2.294351&access_token=ACCESS-TOKEN
spots.ig.getLocationsByCoords = function(lat, lng, distance) {
	return $.ajax({
		url: "https://api.instagram.com/v1/locations/search",
		method: "GET",
		dataType: "jsonp",
		data: {
			access_token: spots.ig.accessToken,
			lat: lat,
			lng: lng,
			distance: distance
		}
	});
}

spots.ig.getMediaByLocationID = function(id) {
	var endpoint = `https://api.instagram.com/v1/locations/${id}/media/recent`
	{
		return $.ajax({
			url: endpoint,
			method: "GET",
			dataType: "jsonp",
			data: {
				access_token: spots.ig.accessToken,
			}
		});
	}
}

spots.ig.init = function() 
{
	spots.ig.addFilterStateToggleListener();
	spots.ig.addHashtagSubmitListener();
	spots.ig.addLocationListener();
	spots.ig.addAppendOnScrollListener();
}

spots.google.init = function() 
{
	var mapTarget = $(".map-container");
	var searchBoxTarget = $(".map-view__search-box");
	var map = spots.google.map;
	var searchBox = spots.google.searchBox;
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
		clickableIcons: false,
		gestureHandling: "cooperative"
	});
	searchBox = new google.maps.places.SearchBox(searchBoxTarget[0]);
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(searchBoxTarget[0]);
	$(".map-view__search-box").attr("placeholder", "Search a Location");
	map.addListener("click", function(e) 
	{
		if ($(window).width() > 780) { // disble marker dropping on tablets/mobiles
			spots.google.placeMarker(e.latLng, map); 
		}
	});
	searchBox.addListener("places_changed", function() 
	{ // returns an array of places
		var searchResults = searchBox.getPlaces(); 
		spots.google.placeMarker(searchResults[0].geometry.location, map);
	});
	spots.google.stickyMap();
}

// place a marker and pan to it
// beginning of the chain
spots.google.placeMarker = function(latLng, map) {
	if (spots.google.marker != null) 
	{
		spots.google.marker.setMap(null);
	}
	spots.google.marker = new google.maps.Marker({
		position: latLng,
		map: map,
		animation: google.maps.Animation.DROPm,
		icon: {
			path: "M500,174.656c-93.768,0-170.056,76.288-170.056,170.063c0,88.456,141.752,256.208,157.92,275.04 c3.04,3.544,7.472,5.584,12.144,5.584s9.104-2.04,12.145-5.584c16.168-18.832,157.92-186.584,157.92-275.04 C670.064,250.944,593.768,174.656,500,174.656z M560.928,339.088c0,33.6-27.336,60.937-60.936,60.937 c-33.601,0-60.937-27.336-60.937-60.937c0-33.6,27.345-60.936,60.944-60.936S560.928,305.488,560.928,339.088z",
			fillColor: "#212121",
			fillOpacity: 1,
			scale: 0.08,
			size: new google.maps.Size(20, 30),
			anchor: new google.maps.Point(500, 625) // fixing the anchor point of the pin... IDK
		}
	});
	spots.google.currLocation.lat = latLng.lat();
	spots.google.currLocation.lng = latLng.lng();
	map.panTo(latLng);
	spots.ig.coordsToLocations();
}

// takes google coordinates and maps them to ig locations
spots.ig.coordsToLocations = function() {
	spots.ig.currPosts = []; // reset/clear the array
	var currLocation = spots.google.currLocation;
	if (currLocation.lat != null && currLocation.lng != null) 
	{
		var lat = currLocation.lat;
		var lng = currLocation.lng;
		$.when(spots.ig.getLocationsByCoords(lat, lng, 750))
		.then(spots.ig.updateCurrLocationsList);
	}
}

// consolidates all of the media from each of the 20 
spots.ig.updateCurrLocationsList = function(response) {
	spots.ig.currLocationsList = response.data;
	args = spots.ig.currLocationsList.map(n => spots.ig.getMediaByLocationID(n.id));
	$.when(...args)
	.then(function(...response) {
		console.log(response); // array of response objects 
		for (var i = 0; i < response.length; i++) 
		{
			if (response[i][0].data == undefined) { continue; } // some response objects will have no data; returns error code 400 "this location does not exist"
			response[i][0].data.forEach(function(post) 
			{
				var postObj = 
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
				spots.ig.currPosts.push(postObj);
			});
		}
		spots.ig.maxIndex = 0;
		spots.ig.updateGallery();
	});
}

// append a single post with proper image positioning relative to its container
spots.ig.appendPost = function(item) {
	$(".ig-feed__gallery").append(`<div class="container">
		<div class="container__image">
		<img src="${item.image.url}" alt="Instagram Post" class="gallery-item" id="${item.id}" data-location="${item.location}">
		</div>
		</div>`);
	if (item.image.width > item.image.height) 
	{
		var w = item.image.width/item.image.height*100;
		var t = (item.image.width-item.image.height)/2/item.image.width*100;
		$(`#${item.id}`).css("width", `${w}%`);
		$(`#${item.id}`).css("max-width", "999%");
		$(`#${item.id}`).css("transform", `translateX(-${t}%)`);
	}
	else if (item.image.width < item.image.height)
	{
		var t = (item.image.height-item.image.width)/2/item.image.height*100;
		$(`#${item.id}`).css("transform", `translateY(-${t}%)`);
	}
	if (!(spots.ig.currPostsLocations.includes(item.location)))
	{
		spots.ig.currPostsLocations.push(item.location);
		$(".filters").append(`<li><button class="location location--selected">${item.location}</button></li>`)
	}
}

// clear everything
spots.ig.resetGallery = function() {
	$(".ig-feed__gallery .container").remove();
	$(".filters").empty();
}

// update the gallery
spots.ig.updateGallery = function() {
	if (spots.ig.maxIndex == 0) 
	{
		spots.ig.resetGallery();
	}
	var i = spots.ig.maxIndex;
	if (spots.ig.currHashtag != "") 
	{
		for (i ; i < spots.ig.maxIndex+9; i++) // !!! check edge cases here and next block !!!
		{
			if (i > spots.ig.currPosts.length) { break; } // cannot display more than the number of available posts
			if (spots.ig.currPosts[i].tags.includes(spots.ig.currHashtag)) 
			{
				// console.log(i, breakpoint, spots.ig.maxIndex, spots.ig.currPosts);
				spots.ig.appendPost(spots.ig.currPosts[i]);
			}
		}
		spots.ig.maxIndex += i;
	}
	else 
	{
		for (i; i < spots.ig.maxIndex+9; i++) 
		{
			
			if (i > spots.ig.currPosts.length) { break; } // cannot display more than the number of available posts
			// console.log(i, spots.ig.breakpoint, spots.ig.maxIndex, spots.ig.currPosts);
			spots.ig.appendPost(spots.ig.currPosts[i]);
		}
		spots.ig.maxIndex += i;
	}
	spots.ig.checkNoContent();
}

// checks if the ig gallery is empty
spots.ig.checkNoContent = function() {
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

// stickies the google map
spots.google.stickyMap = function() {
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

// append more posts on scroll
spots.ig.addAppendOnScrollListener = function() {
	$(window).scroll(function() {
		if ($(window).scrollTop()+$(window).height() > $(document).height()-5) {
			if (spots.ig.currPosts.length > 0 || spots.ig.maxIndex < spots.ig.currPosts.length)
			{
				spots.ig.updateGallery();
			}
		}
	});
}

// hide and unhide the filters
spots.ig.addFilterStateToggleListener = function() {
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

// 
spots.ig.addHashtagSubmitListener = function() {
	$(".hashtag-search__submit").on("click touchstart", function(event) 
	{
		event.preventDefault();
		spots.ig.currHashtag = $(".hashtag-search__field").val();

		if (spots.ig.currHashtag.replace(/\s/g, '') == "") 
		{
			alert("Invalid hashtag.");
		}
		else 
		{
			$(".hashtag-search__field").val("");
			$(".hashtag-search__curr").html(`<button><i class="fa fa-times" aria-hidden="true"></i></button>
				<span>#${spots.ig.currHashtag}</span>`);
			spots.ig.updateGallery();
		}
	});

	$(".options-bar").on("click touchstart", ".hashtag-search__curr button", function(event) 
	{
		event.preventDefault();
		$(".hashtag-search__curr").html("N/A");
		spots.ig.currHashtag = "";
		spots.ig.updateGallery();
	});
}

spots.ig.addLocationStateToggleListener = function() {
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
	spots.init();
});