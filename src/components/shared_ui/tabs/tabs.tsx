import React from 'react';
import classNames from 'classnames';
import { useConstructor } from '@/hooks/useConstructor';
import ThemedScrollbars from '../themed-scrollbars/themed-scrollbars';
import Tab from './tab';
import './tabs.scss';

declare module 'react' {
    interface HTMLAttributes<T> extends React.AriaAttributes, React.DOMAttributes<T> {
        label?: React.ReactNode;
        hash?: string;
    }
}

type TTabsProps = {
    active_icon_color?: string;
    active_index?: number;
    background_color?: string;
    bottom?: boolean;
    center?: boolean;
    children: (React.ReactElement | null)[];
    className?: string;
    fit_content?: boolean;
    has_active_line?: boolean;
    has_bottom_line?: boolean;
    header_fit_content?: boolean;
    history?: any;
    icon_color?: string;
    icon_size?: number;
    is_100vw?: boolean;
    is_full_width?: boolean;
    is_overflow_hidden?: boolean;
    is_scrollable?: boolean;
    onTabItemClick?: (active_tab_index: number) => void;
    should_update_hash?: boolean;
    single_tab_has_no_label?: boolean;
    top: boolean;
};

const Tabs = ({
    active_icon_color = '',
    active_index = 0,
    background_color = '',
    bottom = false,
    center = false,
    children,
    className = '',
    fit_content = false,
    has_active_line = true,
    has_bottom_line = true,
    header_fit_content = false,
    history,
    icon_color = '',
    icon_size = 0,
    is_100vw = false,
    is_full_width = false,
    is_overflow_hidden = false,
    is_scrollable = false,
    onTabItemClick,
    should_update_hash = false,
    single_tab_has_no_label = false,
    top,
}: TTabsProps) => {
    const [active_line_style, updateActiveLineStyle] = React.useState({});
    const active_tab_ref = React.useRef<HTMLLIElement>(null);
    const tabs_wrapper_ref = React.useRef<HTMLUListElement>(null);
    const pushHash = (hash: string) => {
        if (history && history.replace) {
            history.replace(`${history.location.pathname}${window.location.search}#${hash}`);
        }
    };

    const setActiveLineStyle = React.useCallback(() => {
        const tabs_wrapper_bounds = tabs_wrapper_ref?.current?.getBoundingClientRect();
        const active_tab_bounds = active_tab_ref?.current?.getBoundingClientRect();
        if (tabs_wrapper_bounds && active_tab_bounds) {
            updateActiveLineStyle({
                left: active_tab_bounds.left - tabs_wrapper_bounds.left,
                width: active_tab_bounds.width,
            });
        } else {
            setTimeout(() => {
                setActiveLineStyle();
            }, 500);
        }
    }, []);

    const getInitialIndex = () => {
        let initial_index = active_index;
        if (should_update_hash && children && Array.isArray(children) && children.length > 0) {
            // if hash is in url, find which tab index correlates to it
            const hash = location.hash.slice(1);
            const hash_index = children.findIndex(child => child && child.props && child.props.hash === hash);
            const has_hash = hash_index > -1;

            if (has_hash) {
                initial_index = hash_index;
            } else {
                // if no hash is in url but component has passed hash prop, set hash of the tab shown
                const child_props = children[initial_index]?.props;
                const current_id = child_props && child_props.hash;
                if (current_id) {
                    pushHash(current_id);
                }
            }
        }
        return initial_index;
    };

    const [active_tab_index, setActiveTabIndex] = React.useState(getInitialIndex);
    let tab_width: string;

    useConstructor(() => {
        setActiveLineStyle();
    });

    React.useEffect(() => {
        if (active_tab_index >= 0 && active_index !== active_tab_index) {
            onTabItemClick?.(active_tab_index);
        }
        setActiveLineStyle();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [active_tab_index, setActiveLineStyle]);

    React.useEffect(() => {
        if (active_index >= 0 && active_index !== active_tab_index) {
            setActiveTabIndex(active_index);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [active_index]);

    const onClickTabItem = (index: number) => {
        if (should_update_hash && children && Array.isArray(children)) {
            const child = children[index];
            const hash = child?.props?.['data-hash'];
            if (hash) {
                pushHash(hash);
            }
        }
        setActiveTabIndex(index);
        setActiveLineStyle();
    };

    // Early return if children is undefined or empty
    if (!children || children.length === 0) {
        return null;
    }

    // Additional safety check - handle both array and single element cases
    if (!Array.isArray(children)) {
        if (React.isValidElement(children)) {
            // Convert single element to array
            children = [children];
        } else {
            return null;
        }
    }

    let valid_children;
    let children_count;

    try {
        valid_children = children.filter(child => child);
        children_count = valid_children.length || 1;

        // Early return if no valid children after filtering
        if (valid_children.length === 0) {
            return null;
        }
    } catch (error) {
        return null;
    }

    if (is_scrollable) {
        tab_width = 'unset';
    } else {
        tab_width = fit_content ? '150px' : `${(100 / children_count).toFixed(2)}%`;
    }

    try {
        return (
            <div
                className={classNames('dc-tabs', {
                    [`dc-tabs--${className}`]: className,
                    'dc-tabs--top': top,
                    'dc-tabs--100vw': is_100vw,
                })}
                style={{ '--tab-width': `${tab_width}`, background: background_color } as React.CSSProperties}
            >
                <div className={classNames({ [`dc-tabs__list--header--${className}`]: className })}>
                    <ul
                        className={classNames('dc-tabs__list', {
                            'dc-tabs__list--top': top,
                            'dc-tabs__list--border-bottom': has_bottom_line,
                            'dc-tabs__list--bottom': bottom,
                            'dc-tabs__list--center': center,
                            'dc-tabs__list--header-fit-content': header_fit_content,
                            'dc-tabs__list--full-width': is_full_width,
                            [`dc-tabs__list--${className}`]: className,
                            'dc-tabs__list--overflow-hidden': is_overflow_hidden,
                        })}
                        ref={tabs_wrapper_ref}
                    >
                        <ThemedScrollbars
                            className='dc-themed-scrollbars-wrapper'
                            is_only_horizontal
                            is_scrollbar_hidden
                            is_bypassed={!is_scrollable}
                        >
                            {children &&
                                React.Children.map(children, (child, index) => {
                                    try {
                                        if (!child || !child.props) return null;
                                        const { icon, label, id } = child.props;
                                        const header_content = child.props['data-header-content'];
                                        const count = child.props['data-count'];
                                        return (
                                            <Tab
                                                active_icon_color={active_icon_color}
                                                className={className}
                                                count={count}
                                                icon={icon}
                                                icon_color={icon_color}
                                                icon_size={icon_size}
                                                is_active={index === active_tab_index}
                                                key={label || `tab-${index}`}
                                                is_label_hidden={children.length === 1 && single_tab_has_no_label}
                                                label={label}
                                                id={id}
                                                is_scrollable={is_scrollable}
                                                top={top}
                                                bottom={bottom}
                                                header_fit_content={header_fit_content}
                                                active_tab_ref={index === active_tab_index ? active_tab_ref : null}
                                                header_content={header_content}
                                                onClick={() => onClickTabItem(index)}
                                                setActiveLineStyle={setActiveLineStyle}
                                            />
                                        );
                                    } catch (error) {
                                        return null;
                                    }
                                })}
                            {has_active_line && !is_scrollable && (
                                <span
                                    className={classNames('dc-tabs__active-line', {
                                        'dc-tabs__active-line--top': top,
                                        'dc-tabs__active-line--bottom': bottom,
                                        'dc-tabs__active-line--fit-content': fit_content,
                                        'dc-tabs__active-line--header-fit-content': header_fit_content,
                                        'dc-tabs__active-line--is-hidden':
                                            children.length === 1 && single_tab_has_no_label,
                                    })}
                                    style={active_line_style}
                                />
                            )}
                        </ThemedScrollbars>
                    </ul>
                </div>
                <div
                    className={classNames('dc-tabs__content', {
                        [`dc-tabs__content--${className}`]: className,
                    })}
                >
                    {children &&
                        React.Children.map(children, (child, index) => {
                            try {
                                if (!child) return null;
                                if (index !== active_tab_index) {
                                    return null;
                                }
                                return child.props?.children || null;
                            } catch (error) {
                                return null;
                            }
                        })}
                </div>
            </div>
        );
    } catch (error) {
        return <div>Error rendering tabs</div>;
    }
};

export default Tabs;
