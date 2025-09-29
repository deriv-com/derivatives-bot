import { BrowserRouter } from 'react-router-dom';
import { mockStore, StoreProvider } from '@/hooks/useStore';
import { mock_ws } from '@/utils/mock';
import { useDevice } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';
import MenuContent from '../menu-content';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isDesktop: false })),
}));

describe('MenuContent Component', () => {
    const mock_store = mockStore(mock_ws as any);

    // Mock client as logged in to show Hub link
    mock_store.client.is_logged_in = true;

    const wrapper = ({ children }: { children: React.ReactNode }) => (
        <BrowserRouter>
            <StoreProvider mockStore={mock_store}>{children}</StoreProvider>
        </BrowserRouter>
    );

    beforeEach(() => {
        Object.defineProperty(window, 'matchMedia', {
            value: jest.fn(),
            writable: true,
        });
    });

    it('renders MenuItem components correctly', () => {
        render(<MenuContent />, { wrapper });
        expect(screen.getByText(/Reports/)).toBeInTheDocument();
        expect(screen.getByText(/Dark theme/)).toBeInTheDocument();
    });

    it('adjusts text size for mobile devices', () => {
        render(<MenuContent />, { wrapper });
        const text = screen.getByText(/Reports/);
        expect(text).toHaveClass('derivs-text__size--md');
    });

    it('adjusts text size for desktop devices', () => {
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: true });
        render(<MenuContent />, { wrapper });
        const text = screen.getByText(/Reports/);
        expect(text).toHaveClass('derivs-text__size--sm');
    });
});
