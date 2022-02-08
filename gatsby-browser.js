// export const onClientEntry = () => {
//   window.onload = () => {  // Very undependable. Fires before anything is rendered.
//     console.log('onClientEntry');
//   }
// }

import './src/styles/common/bulma.css'
import './src/styles/common/style.css'
import './src/styles/common/custom.css'
import './src/styles/common/util.css'

import littlefoot from 'littlefoot'
import 'littlefoot/dist/littlefoot.css'

export function onRouteUpdate() {
  littlefoot() // Pass any littlefoot settings here.
}

require("prismjs/themes/prism-solarizedlight.css")