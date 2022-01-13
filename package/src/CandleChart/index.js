import Loadable from '@7rulnik/react-loadable';

export default Loadable({
  loader: () => import('./candleChart' /* webpackChunkName: 'candleChart' */),
  loading: () => null
});
