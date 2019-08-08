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
    lat = 37.75;
    lng = -122.41;
    message = 'Hello World!';
  
    // data
    source: any;
    markers: any;
  

  constructor(private service: ApiRequestService, private mapService: MapService) {}

  // TODO: CHANGE ONINIT TO BUTTON ACTION OR ANYTHING ALIKE TO PERFORM API REQUEST.
  ngOnInit() { 
    this.service.loadPlaces(this.featuresForm.value).subscribe(response => this.places = response);
    M.AutoInit();
    this.markers = this.mapService.getMarkers()
    this.initializeMap()
  }

  callApi() {
    this.service.loadPlaces(this.featuresForm.value).subscribe(response => this.places = response);
  }

  private initializeMap() {
    /// locate the user
    if (navigator.geolocation) {
       navigator.geolocation.getCurrentPosition(position => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
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
      zoom: 13,
      center: [this.lng, this.lat]
    });


    /// Add map controls
    this.map.addControl(new mapboxgl.NavigationControl());


    //// Add Marker on Click
    this.map.on('click', (event) => {
      const coordinates = [event.lngLat.lng, event.lngLat.lat]
      const newMarker   = new GeoJson(coordinates, { message: this.message })
      this.mapService.createMarker(newMarker)
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
      // this.markers.subscribe(markers => {
      //     let data = new FeatureCollection(markers)
      //     this.source.setData(data)
      // })

      /// create map layers with realtime data
      this.map.addLayer({
        id: 'firebase',
        source: 'firebase',
        type: 'symbol',
        layout: {
          'text-field': '{message}',
          'text-size': 24,
          'text-transform': 'uppercase',
          'icon-image': 'rocket-15',
          'text-offset': [0, 1.5]
        },
        paint: {
          'text-color': '#f16624',
          'text-halo-color': '#fff',
          'text-halo-width': 2
        }
      })

    })


  

}
  /// Helpers

  removeMarker(marker) {
    this.mapService.removeMarker(marker.$key)
  }

  flyTo(data: GeoJson) {
    this.map.flyTo({
      center: data.geometry.coordinates
    })
  }
}