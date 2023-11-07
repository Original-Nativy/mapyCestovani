import { createControlComponent } from '@react-leaflet/core'
import { malaysia } from '../geomaps/Malaysia';
import { indonesia } from '../geomaps/Indonesia';
import { thailand } from '../geomaps/Thailand';
import { philippines } from '../geomaps/Philippines';
import { vietnam } from '../geomaps/Vietnam';
import { taiwan } from '../geomaps/Taiwan';
import { hongkong } from '../geomaps/Hongkong';
import { maldives } from '../geomaps/Maldives';
import { uae } from '../geomaps/Uae';
import { israel } from '../geomaps/israel';

export const allCountriesFeatures ={
    'dataIndonesia': indonesia.features,
    'dataMalaysia': malaysia.features,
    'dataThailand': thailand.features,
    'dataPhilippines': philippines.features,
    'dataVietnam': vietnam.features,
    'dataTaiwan': taiwan.features,
    'dataHongkong': hongkong.features,
    'dataMaldives': maldives.features,
    'dataUae': uae.features,
    'dataIsrael': israel.features,
}

export const maps = {
    street: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    empty: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png',
  };

export const arrayOfCountries = [
    'Thailand',
    'Philippines',
    'Maldives',
    'Malaysia',
    'Taiwan',
    'Indonesia',
    'Vietnam',
    'United Arab Emirates',
    'Israel',
    'Hong Kong',
];