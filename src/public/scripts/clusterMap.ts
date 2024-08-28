import mapboxgl from 'mapbox-gl';
// import dotenv from "dotenv";
// dotenv.config()

class ClusterMap {
  private readonly mapToken: string;
  private readonly containerId: string;
  private readonly style: string;
  private readonly center: [number, number];
  private readonly zoom: number;
  private readonly homes: any;

  constructor(mapToken: string, containerId: string, style: string, center: [number, number], zoom: number, homes: any) {
    this.mapToken = mapToken;
    this.containerId = containerId;
    this.style = style;
    this.center = center;
    this.zoom = zoom;
    this.homes = homes;
    mapboxgl.accessToken = this.mapToken;
  }

  public renderMap(): void {
    const map = new mapboxgl.Map({
      container: this.containerId,
      style: this.style,
      center: this.center,
      zoom: this.zoom,
    });

    map.addControl(new mapboxgl.NavigationControl());

    map.on('load', () => {
      map.addSource('homes', {
        type: 'geojson',
        data: this.homes,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
      });

      map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'homes',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': ['step', ['get', 'point_count'], '#4fc3f7', 10, '#29B6F6', 30, '#0288D1'],
          'circle-radius': ['step', ['get', 'point_count'], 15, 10, 20, 30, 40],
        },
      });

      map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'homes',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': ['get', 'point_count_abbreviated'],
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12,
        },
      });

      map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'homes',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': '#11b4da',
          'circle-radius': 4,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff',
        },
      });

      map.on('click', 'clusters', (e) => {
        const features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
        const clusterId = features[0].properties?.cluster_id;
        // map.getSource('homes').getClusterExpansionZoom(clusterId, (err: any, zoom: any) => {
        //   if (err) return;
        //   map.easeTo({ center: features[0].geometry.coordinates, zoom });
        // });
      });

      map.on('click', 'unclustered-point', (e: any) => {
        const { popUpMarkup } = e.features[0].properties;
        const coordinates = e.features[0].geometry.coordinates.slice();
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
      
        new mapboxgl.Popup().setLngLat(coordinates).setHTML(popUpMarkup).addTo(map);
      });

      map.on('mouseenter', 'clusters', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'clusters', () => {
        map.getCanvas().style.cursor = '';
      });
    });
  }
}

// Usage:
// const mapToken = process.env.MAPBOX_TOKEN as string;
const containerId = 'cluster-map';
const style = 'mapbox://styles/mapbox/dark-v11';
const center = [-103.5917, 40.6699];
const zoom = 3;
// const homes = {} // Replace this with your GeoJSON data
//@ts-ignore
const clusterMap = new ClusterMap(mapToken, containerId, style, center as [number, number], zoom, homes);
export default clusterMap.renderMap();
