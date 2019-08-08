import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ApiRequestService } from './services/api-request.service'
import * as mapboxgl from 'mapbox-gl';
import { MapService } from './services/map.service';
import { GeoJson, FeatureCollection } from './map';

import * as M from 'materialize-css';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'Recommender System';

  places: object = null;

  featuresForm = new FormGroup({
    Rpayment: new FormControl('1'),
    parking_lot: new FormControl('1'),
    alcohol: new FormControl('1'),
    dress_code: new FormControl('1'),
    accesibility: new FormControl('1'),
    price: new FormControl('1')
  });

  /// default settings
  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/outdoors-v9';
  lat = 19.4326;
  lng = -99.1332;
  message = 'Your location';

  // data
  source: any;
  marker: any;


  constructor(private service: ApiRequestService, private mapService: MapService) { }

  // TODO: CHANGE ONINIT TO BUTTON ACTION OR ANYTHING ALIKE TO PERFORM API REQUEST.
  ngOnInit() {
    this.service.loadPlaces(this.featuresForm.value).subscribe(response => this.places = response);
    M.AutoInit();
    this.initializeMap();
  }

  callApi() {
    let features = this.featuresForm.value;
    features.lat = this.lat;
    features.lng = this.lng;
    this.service.loadPlaces(features).subscribe(response => this.places = response);
  }

  private initializeMap() {
    /// locate the user
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        // this.lat = position.coords.latitude;
        // this.lng = position.coords.longitude;
        this.map.flyTo({
          center: [this.lng, this.lat]
        })
      });
    }

    this.buildMap()

  }
  buildMap() {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: 10,
      center: [this.lng, this.lat]
    });


    /// Add map controls
    this.map.addControl(new mapboxgl.NavigationControl());


    //// Add Marker on Click
    this.map.on('click', (event) => {
      const coordinates = [event.lngLat.lng, event.lngLat.lat]
      this.lng = event.lngLat.lng;
      this.lat = event.lngLat.lat;
      const newMarker = new GeoJson(coordinates, { message: this.message })
      this.mapService.createMarker(newMarker);
      if (!!this.map.getLayer('points')) this.removeMarker('points');
      this.addMarker();
    })


    /// Add realtime firebase data on map load
    this.map.on('load', (event) => {

      /// register source
      this.map.addSource('firebase', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      });

      /// get source
      this.source = this.map.getSource('firebase')

      /// subscribe to realtime database and set data source
      // this.marker.subscribe(markers => {
      //     let data = new FeatureCollection(markers)
      //     this.source.setData(data)
      // })

      /// create map layers with realtime data
      // this.map.addLayer({
      //   "id": "points",
      //   "type": "symbol",
      //   "source": {
      //     "type": "geojson",
      //     "data": {
      //       "type": "FeatureCollection",
      //       "features": [{
      //         "type": "Feature",
      //         "geometry": {
      //           "type": "Point",
      //           "coordinates": [this.lng, this.lat]
      //         },
      //         "properties": {
      //           "title": this.message,
      //           "icon": "monument"
      //         }
      //       }]
      //     }
      //   },
      //   "layout": {
      //     "icon-image": "{icon}-15",
      //     "text-field": "{title}",
      //     "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
      //     "text-offset": [0, 0.6],
      //     "text-anchor": "top"
      //   }
      // });

    })




  }
  /// Helpers

  addMarker() {
    this.map.addLayer({
      "id": "points",
      "type": "symbol",
      "source": {
        "type": "geojson",
        "data": {
          "type": "FeatureCollection",
          "features": [{
            "type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": [this.lng, this.lat]
            },
            "properties": {
              "title": this.message,
              "icon": "monument"
            }
          }]
        }
      },
      "layout": {
        "icon-image": "{icon}-15",
        "text-field": "{title}",
        "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
        "text-offset": [0, 0.6],
        "text-anchor": "top"
      }
    });
  }

  removeMarker(marker) {
    // this.mapService.removeMarker(marker.$key)
    this.map.removeLayer(marker);
    this.map.removeSource(marker);
  }

  flyTo(data: GeoJson) {
    this.map.flyTo({
      center: data.geometry.coordinates
    })
  }
}