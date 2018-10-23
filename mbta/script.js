function initMap() {
	var stations = {
		sstat: [{lat: 42.352271, lng: -71.05524200000001}, "South Station"],
		andrw: [{lat: 42.330154, lng: -71.057655}, "Andrew"],
		portr: [{lat: 42.3884, lng: -71.11914899999999}, "Porter Square"],
		harsq: [{lat: 42.373362, lng: -71.118956}, "Harvard Square"],
		jfk: [{lat: 42.320685, lng: -71.052391}, "JFK/UMass"],
		shmnl: [{lat: 42.31129, lng: -71.053331}, "Savin Hill"],
		pktrm: [{lat: 42.35639457, lng: -71.0624242}, "Park Street"],
		brdwy: [{lat: 42.342622, lng: -71.056967}, "Broadway"],
		nqncy: [{lat: 42.275275, lng: -71.029583}, "North Quincy"],
		smmnl: [{lat: 42.29312583, lng: -71.06573796000001}, "Shawmut"],
		davis: [{lat: 42.39674, lng: -71.121815}, "Davis"],
		alfcl: [{lat: 42.395428, lng: -71.142483}, "Alewife"],
		knncl: [{lat: 42.36249079, lng: -71.08617653}, "Kendall/MIT"],
		chmnl: [{lat: 42.361166, lng: -71.070628}, "Charles/MGH"],
		dwnxg: [{lat: 42.355518, lng: -71.060225}, "Downtown Crossing"],
		qnctr: [{lat: 42.251809, lng: -71.005409}, "Quincy Center"],
		qamnl: [{lat: 42.233391, lng: -71.007153}, "Quincy Adams"],
		asmnl: [{lat: 42.284652, lng: -71.06448899999999}, "Ashmont"],
		wlsta: [{lat: 42.2665139, lng: -71.0203369}, "Wollaston"],
		fldcr: [{lat: 42.300093, lng: -71.061667}, "Fields Corner"],
		cntsq: [{lat: 42.365486, lng: -71.103802}, "Central Square"],
		brntn: [{lat: 42.2078543, lng: -71.0011385}, "Braintree"]
	};

	var map = new google.maps.Map(document.getElementById('map'), {
		  center: stations["sstat"][0],
		  zoom: 10
	});

	var infoWindow = new google.maps.InfoWindow;

	for (var key in stations)
	{
		var marker = new google.maps.Marker({position: stations[key][0], map: map});
		var stationWindow = new google.maps.InfoWindow;

		google.maps.event.addListener(marker, 'click', (function(marker, key) {
	        return function() {
	        	request = new XMLHttpRequest();
	        	request.open("GET", "https://chicken-of-the-sea.herokuapp.com/redline/schedule.json?stop_id=place-" + key, true);

	        	request.send();
	        	var content = '';

	        	request.onreadystatechange = function() {
	        		if (request.readyState == 4 && request.status == 200) {
	        			theData = request.responseText;
	        			messages = JSON.parse(theData);
	        			content = content + stations[key][1] + '<br>Arrivals';

	        			for (i = 0; i < 39; i++) {
	        				content = content + '\xa0';
	        			}

	        			content +='Departures<br>';

	        			for (i = 0; i < messages.data.length; i++) {
	        				content = content + messages.data[i].attributes.arrival_time + '\xa0\xa0\xa0';
	        				content = content + messages.data[i].attributes.departure_time + '<br>';
	        			}
	        		}

	        		stationWindow.setContent(content);
	        	};

	            stationWindow.open(map, marker);
	        }
	    })(marker, key));
	}
	
	var redLineStations = [
		stations["alfcl"][0], stations["davis"][0], stations["portr"][0], stations["harsq"][0], 
		stations["cntsq"][0], stations["knncl"][0], stations["chmnl"][0], stations["pktrm"][0], 
		stations["dwnxg"][0], stations["sstat"][0], stations["brdwy"][0], 
		stations["andrw"][0], stations["jfk"][0]
	];

	var braintreeBranchStations = [
		stations["jfk"][0], stations["nqncy"][0], stations["wlsta"][0], stations["qnctr"][0], 
		stations["qamnl"][0], stations["brntn"][0]
	];

	var ashmontBranchStations = [
		stations["jfk"][0], stations["shmnl"][0], stations["fldcr"][0], stations["smmnl"][0], stations["asmnl"][0]
	];

	setPolyLine(map, redLineStations);
	setPolyLine(map, braintreeBranchStations);
	setPolyLine(map, ashmontBranchStations);
	

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			var currentPos = {
			lat: position.coords.latitude,
			lng: position.coords.longitude
		};
		var yourLocation = new google.maps.Marker({position: currentPos, map: map});
		map.setCenter(currentPos);
	}, function() {
		handleLocationError(true, infoWindow, map.getCenter());
	});
	} else {
		// Browser doesn't support Geolocation
		handleLocationError(false, infoWindow, map.getCenter());
	}
}

function setPolyLine(map, chosenStations) {
	var redLine = new google.maps.Polyline({
		path: chosenStations,
		geodesic: true,
		strokeColor: '#FF0000',
		strokeOpacity: 1.0,
		strokeWeight: 2
	});

	redLine.setMap(map);
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
	infoWindow.setPosition(pos);
	infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
	infoWindow.open(map);
}