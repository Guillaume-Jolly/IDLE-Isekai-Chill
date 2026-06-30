import { publicAssetUrl } from './publicAssetUrl'

export type SplashSlide = {
  id: string
  image: string
  title: string
  caption: string
}

export const LOGIN_BACKGROUND = publicAssetUrl('splash/login-bg.png')

export const SPLASH_SLIDES: SplashSlide[] = [
  {
    id: 'village',
    image: publicAssetUrl('splash/splash-village.png'),
    title: 'Le Havre des Brumes',
    caption: 'Bâtissez votre village, produisez des ressources et débloquez de nouveaux lieux.',
  },
  {
    id: 'companions',
    image: publicAssetUrl('splash/splash-companions.png'),
    title: 'Liens et compagnons',
    caption: 'Tissez des relations, des conversations et des illustrations à chaque palier.',
  },
  {
    id: 'myrions',
    image: publicAssetUrl('splash/splash-myrions.png'),
    title: 'Chasse et Refuge',
    caption: 'Capturez des Myrions, soignez-les au refuge et explorez les biomes brumeux.',
  },
  {
    id: 'moon-farm',
    image: publicAssetUrl('splash/splash-moon-farm.png'),
    title: 'Chantier du havre',
    caption: 'Supervisez filons et récoltes sous la lune — progression idle cozy.',
  },
]

export const SPLASH_IMAGE_URLS = [LOGIN_BACKGROUND, ...SPLASH_SLIDES.map((slide) => slide.image)]
