import { Route } from '@tanstack/react-router'
import { rootRoute } from './root'
import PreviewPage from '../pages/PreviewPage'

export const previewRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/preview/$username',
  component: PreviewPage,
})
