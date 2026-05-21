import { Routes } from '@angular/router';
import { PodcastList } from './pages/podcast-list/podcast-list';

export const PODCAST_ROUTES: Routes = [
  {
    path: '',
    component: PodcastList
  }
  // usaremos la ruta global de /contenido/:id
];