import * as throng from 'throng'
import { fetchRedesSettings, subscription } from './features/settings'


throng({
  workers: 1,
  start: async (id) => {
    console.log(`Started worker ${id}`)

    try {
      const data = await fetchRedesSettings()
      const widgets = []
      data.forEach(rede => widgets.push(...rede.widgets))

      console.log('Widgets to watch:', widgets)
      await subscription(widgets)
    } catch (err) {
      console.error('throng err: '.red, err)
    }

    process.on('SIGTERM', function() {
      console.log(`Worker ${id} exiting`)
      console.log('Cleanup here')
      process.exit()
    })
  }
 })