import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

import { GeoJson } from '../map';
import * as mapboxgl from 'mapbox-gl';

@Injectable()
export class MapService {

  constructor() {
    mapboxgl.accessToken = environment.mapbox.accessToken
  }


  getMarkers(): any {
    // return this.db.list('/markers')
  }

  createMarker(data: GeoJson) {
    // return this.db.list('/markers')
    //               .push(data)
  }

  removeMarker($key: string) {
    // return this.db.object('/markers/' + $key).remove()
  }

}