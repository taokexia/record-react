import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import styleImport from 'vite-plugin-style-import'
import pxtorem from 'postcss-pxtorem';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh(), styleImport(
    {
      libs: [
        {
          libraryName: 'zarm',
          esModule: true,
          resolveStyle: (name) => {
            return `zarm/es/${name}/style/css`;
          }
        }
      ]
    }
  )],
  css: {
    modules: {
      localsConvention: 'dashesOnly'
    },
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      }
    },
    postcss: {
      plugins: [
        pxtorem({
          rootValue: 37.5,
          propList: ['*'],
          selectorBlackList: ['.norem'] // 过滤掉.norem-开头的class，不进行rem转换
        })
      ]
    }
  },
  server: {
    proxy: {
      '/api': {
        // 当遇到 /api 路径时，将其转换成 target 的值
        target: 'http://api.chennick.wang/api/',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '') // 将 /api 重写为空
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // src 路径
      'utils': path.resolve(__dirname, 'src/utils') // src 路径
    }
  }
})
