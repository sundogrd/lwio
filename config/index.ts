import defaultConfig from './default';
import devConfig from './dev';
import prodConfig from './prod';

type Config = typeof defaultConfig & typeof devConfig & typeof prodConfig;

// tslint:disable
const config: Config =
    process.env.NODE_ENV === 'production'
        ? {
              ...defaultConfig,
              ...prodConfig,
          }
        : {
              ...defaultConfig,
              ...devConfig,
          };
          
export default config;
