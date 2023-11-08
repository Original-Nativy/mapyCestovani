interface Coordinates {
    x: number
    y: number
}
export default Coordinates;


export interface Geometry {
    type: string;
    coordinates: number[][] | number[] | number[][][] | number[][][][];
}

export interface Properties {
    name: string;
    density: number;
    path: string;
}

export interface Feature {
    type: string;
    id: string;
    properties: Properties;
    geometry: Geometry;
}

export interface FeatureCollection {
    type: string;
    features: Feature[];
}

export interface FeatureMalay {
    type: string;
    properties: {
        name: string;
        cartodb_id: number;
        created_at: string;
        updated_at: string;
    };
    geometry: {
        type: string;
        coordinates: number[][][][];
    };
}

export interface AirportFeature {
    type: string;
    geometry: {
      type: string;
      coordinates: number[];
    };
    properties: {
      name: string | null;
      name_en: string | null;
      name_fr: string | null;
      iata: string | null;
      icao: string | null;
      wikipedia: string | null;
      wikidata: string | null;
      website: string | null;
      phone: string | null;
      operator: string | null;
      description: string | null;
      id: string | null;
      source: string[] | string | null  ;
      other_tags: string | null;
      country: string | null;
      country_code: string | null;
    };
  }

export interface AirportCollection {
    type: string;
    features: AirportFeature[];
  }


export interface AirportAllFeature {
    type: string;
    geometry: {
      type: string;
      coordinates: number[];
    };
    properties: {
      id: number;
      name_Air: string;
      city: string | null;
      country: string;
      code: string;
      code2: string;
      x: string;
      y: string;
      numero: number;
      column_10: number;
      column_11: string;
      continent: string;
    };
  }

export interface AirportsAll {
    type: string;
    features: AirportAllFeature[];
  }


