import { configure } from 'mobx';
import ReactDOM from 'react-dom/client';
import { AuthWrapper } from './app/AuthWrapper';
import { AnalyticsInitializer } from './utils/analytics';
import './styles/index.scss';

// Configure MobX to handle multiple instances in production builds
configure({ isolateGlobalState: true });

AnalyticsInitializer();

ReactDOM.createRoot(document.getElementById('root')!).render(<AuthWrapper />);
