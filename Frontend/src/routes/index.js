import { useRoutes } from 'react-router-dom';
import routes from './routes';

function AppRoutes() {
  return useRoutes(routes);
}

export default AppRoutes;
