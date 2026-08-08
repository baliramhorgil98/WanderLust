    // let mapToken=mapToken;
    // console.log(mapToken);
    mapboxgl.accessToken=mapToken;

    const map = new mapboxgl.Map({
        container: 'map', // container ID
        center: listing.geometry.coordinates, // starting position [longitude, latitude]. Note that lat must be set between -90 and 90
        zoom: 9 // starting zoom
    });

    // Create a default Marker and add it to the map.
    const marker = new mapboxgl.Marker({color:'red'})
        .setLngLat(listing.geometry.coordinates) //this long and lat if of Listing.geometry.coordinates
        .setPopup(new mapboxgl.Popup({offset: 25}) // add popups
        .setHTML(
            `<h4>${listing.title}</h4><p>Exact Location will be provided after booking</p>`))
        .addTo(map);