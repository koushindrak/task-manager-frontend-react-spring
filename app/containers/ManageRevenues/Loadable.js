/**
 *
 * Asynchronously loads the component for ManageRevenues
 *
 */

import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./index'),
  loading: () => null,
});
