import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages のサブパス配信に合わせて base を設定。
// 公開URL: https://yamadar.github.io/trpg-chara-image-organizer/
export default defineConfig({
  base: '/trpg-chara-image-organizer/',
  plugins: [react(), tailwindcss()],
})
