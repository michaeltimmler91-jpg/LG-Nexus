import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

const cityLanguagePlugin: Plugin = {
  name: 'lg-nexus-city-language',
  enforce: 'pre',
  transform(code, id) {
    if (!id.endsWith('.ts') && !id.endsWith('.tsx')) return null

    const cleaned = code
      .replaceAll('RP-Geburtsdatum', 'Geburtsdatum')
      .replaceAll('gemütliche RP-Abende', 'gemütliche Abende')

    if (cleaned === code) return null
    return { code: cleaned, map: null }
  },
}

export default defineConfig(({ command }) => ({
  plugins: [cityLanguagePlugin, react()],
  base: command === 'build' ? '/LG-Nexus/' : '/',
}))
