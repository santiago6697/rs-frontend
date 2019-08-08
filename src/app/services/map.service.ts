import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

import { GeoJson } from '../map';
import * as mapboxgl from 'mapbox-gl';

@Injectable()
export class MapService {
  marker: GeoJson

  constructor() {
    mapboxgl.accessToken = environment.mapbox.accessToken
  }


  getMarkers(): any {
    return this.marker
  }

  createMarker(data: GeoJson) {
    this.marker = data
    return this.marker
  }

  removeMarker($key: string) {
    // return this.db.object('/markers/' + $key).remove()
  }

}