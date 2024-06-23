// ModalContext.tsx
import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
} from 'react';
import Modal from './Modal';
import { useLocation } from 'react-router-dom';

export type ModalButtonArgs = {
    text: string;
    onClick?: () => void;
    type: 'submit' | 'reset' | 'button';
};
type ModalContextType = {
    show: (
        content: ReactNode,
        size: 'small' | 'large',
        buttons?: ModalButtonArgs[],
        closeOnBlurClick?: boolean
    ) => void;
    hide: () => void;
};

const ModalContext = createContext<ModalContextType>({
    show: () => {},
    hide: () => {},
});

// eslint-disable-next-line
export const useModal = () => useContext(ModalContext);

interface ModalProviderProps {
    children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
    const [modalContent, setModalContent] = useState<ReactNode>(null);
    const [modalButtons, setModalButtons] = useState<ModalButtonArgs[]>([]);
    const [modalSize, setModalSize] = useState<'small' | 'large'>('small');
    const [modalCloseOnBlurClick, setModalCloseOnBlurClick] = useState(true);
    const location = useLocation();

    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        hide();
    }, [location.pathname, location.search, location.hash, location.state]);

    function show(
        content: ReactNode,
        size: 'small' | 'large' = 'small',
        buttons: ModalButtonArgs[] = [],
        closeOnBlurClick: boolean = true
    ) {
        setModalContent(content);
        setModalButtons(buttons);
        setModalSize(size);
        setModalCloseOnBlurClick(closeOnBlurClick);
        setIsVisible(true);
    }

    function hide() {
        setIsVisible(false);
        setModalContent(null);
    }

    return (
        <ModalContext.Provider value={{ show, hide }}>
            {children}
            {isVisible && (
                <Modal
                    content={modalContent}
                    buttons={modalButtons}
                    size={modalSize}
                    closeOnBlurClick={modalCloseOnBlurClick}
                />
            )}
        </ModalContext.Provider>
    );
};
