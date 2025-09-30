import { configure } from 'mobx';
import ReactDOM from 'react-dom/client';
import { AuthWrapper } from './app/AuthWrapper';
import { AnalyticsInitializer } from './utils/analytics';
import './styles/index.scss';

// Configure MobX to handle multiple instances in production builds and disable strict mode warnings
configure({
    isolateGlobalState: true,
    enforceActions: 'never',
    computedRequiresReaction: false,
    reactionRequiresObservable: false,
    observableRequiresReaction: false,
    disableErrorBoundaries: true,
});

AnalyticsInitializer();

ReactDOM.createRoot(document.getElementById('root')!).render(<AuthWrapper />);
