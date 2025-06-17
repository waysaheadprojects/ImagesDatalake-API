import logo from './logo.svg';
import './App.css';
import AppRoutes from './routes';
import { InputDataQueryProvider, ResponseProvider } from './services/responsecontext';


function App() {
  return (
  <ResponseProvider>
    <InputDataQueryProvider>
 <AppRoutes />
 </InputDataQueryProvider>
  </ResponseProvider>
 );
}

export default App;
