import mapboxgl from 'mapbox-gl';
const mapToken = process.env.MAPBOX_TOKEN as string;

class MapService {
    private readonly mapToken: string;

    constructor(mapToken: string) {
        this.mapToken = mapToken;
        mapboxgl.accessToken = mapToken;
    }

    createMap(home: string) {
        const homeGrd = JSON.parse(home);
        const map = new mapboxgl.Map({
            container: 'map', // container ID
            style: 'mapbox://styles/mapbox/light-v10', // style URL
            center: homeGrd.geometry.coordinates, // starting position [lng, lat]
            zoom: 9, // starting zoom
        });

        map.addControl(new mapboxgl.NavigationControl());

        new mapboxgl.Marker()
            .setLngLat(homeGrd.geometry.coordinates)
            .setPopup(
                new mapboxgl.Popup({ offset: 25 })
                    .setHTML(`<h3>${homeGrd.title}</h3><p>${homeGrd.location}</p>`)
            )
            .addTo(map);
    }
}

// Example usage:
const mapService = new MapService(mapToken);
 // @ts-ignore
mapService.createMap(home);
