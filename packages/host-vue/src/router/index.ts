import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { init, loadRemote } from '@module-federation/runtime';

// init({
//   name: 'hostApp',
//   remotes: [
//     {
//       name: 'remoteReactComponents',
//       entry: 'http://localhost:4173/assets/remoteEntry.js',
//     },
//   ],
// });
// const loadComponent = async function () {
//   const a = await loadRemote(`remoteReactComponents/Home`)
//   console.log('a =>' , a );
// }
// loadComponent()
// const component = import('http://localhost:4173/assets/remoteEntry.js').then(m => {
//   console.log(m.get('./Home'))
//   return m.get('./Home')
// }).then(m => {
//   m().Home
//   console.log('  m().Home=>' ,   m());
// })
// console.log('component =>' , component );
const remotesMap = {
  'home': {url: 'http://localhost:4173/assets/remoteEntry.js', format: 'esm'},
};
const loadJS = (url, fn) => {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.onload = fn;
  script.src = url;
  document.getElementsByTagName('head')[0].appendChild(script);
};
const scriptTypes = ['var'];
const importTypes = ['esm', 'systemjs'];
const metaGet = name => __federation_import(name);
const webpackGet = name => metaGet(name).then(module => () => module?.default ?? module);
const shareScope = {
  'vue': {
    '3.2.23': {
      metaGet: () => metaGet('./__federation_shared_vue.js'),
      get: () => webpackGet('./__federation_shared_vue.js'),
      loaded: 1
    }
  },
  'vuex': {
    '4.0.2': {
      metaGet: () => metaGet('./__federation_shared_vuex.js'),
      get: () => webpackGet('./__federation_shared_vuex.js'),
      loaded: 1
    }
  }
};

async function __federation_import(name) {
  return import(name);
}

const __federation__ = {
  ensure: async (remoteId) => {
    const remote = remotesMap[remoteId];
    if (!remote.inited) {
      if (scriptTypes.includes(remote.format)) {
        // loading js with script tag
        return new Promise(resolve => {
          const callback = () => {
            if (!remote.inited) {
              remote.lib = window[remoteId];
              remote.lib.init(shareScope);
              remote.inited = true;
            }
            resolve(remote.lib);
          };
          loadJS(remote.url, callback);
        });
      } else if (importTypes.includes(remote.format)) {
        // loading js with import(...)
        return new Promise(resolve => {
          import(/* @vite-ignore */ remote.url).then(lib => {
            if (!remote.inited) {
              lib.init(shareScope);
              remote.lib = lib;
              remote.lib.init(shareScope);
              remote.inited = true;
            }
            resolve(remote.lib);
          });
        })
      }
    } else {
      return remote.lib;
    }
  }
};
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      children: [
        {
          path: '/about',
          name: 'about',
          // route level code-splitting
          // this generates a separate chunk (About.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import('../views/AboutView.vue')
        },
        {
          path: '/sub-child',
          name: 'SubChild',
          component: () => {
            return __federation__
            .ensure("home")
            .then((remote) => remote.get("./Home").then((factory) => factory()))
          }
        },
        {
          path: '/sub-child2',
          name: 'SubChild2',
          component: () => {
            return __federation__
            .ensure("home")
            .then((remote) => remote.get("./About").then((factory) => factory()))
          }
        }
      ]
    },
    
  ]
})

export default router
