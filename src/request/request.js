import Backendless from '../bundle'
import { ajaxForBrowser } from './request-for-browser'
import { ajaxForNode } from './request-for-node'

Backendless._ajax = function(config) {
  return Backendless.XMLHttpRequest ? ajaxForBrowser(config) : ajaxForNode(config)
}
