import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

const cityLanguagePlugin: Plugin = {
  name: 'lg-nexus-city-language',
  enforce: 'pre',
  transform(code, id) {
    if (id.indexOf('/src/') === -1) return null
    if (id.indexOf('.ts') === -1 && id.indexOf('.tsx') === -1) return null

    const cleaned = code
      .split('RP-Geburtsdatum').join('Geburtsdatum')
      .split('gemütliche RP-Abende').join('gemütliche Abende')
      .split('RP-Charakter').join('Charakter')
      .split('IC-').join('')
      .split('OOC-').join('')

    if (cleaned === code) return null
    return { code: cleaned, map: null }
  },
}

export default defineConfig(({ command }) => ({
  plugins: [cityLanguagePlugin, react()],
  base: command === 'build' ? '/LG-Nexus/' : '/',
}))
