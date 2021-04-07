import React from 'react';
import { useTransition } from 'react-spring';
import { Container } from './styles';
import { ToastMessage } from '../../hooks/toast';
import Toast from './Toast';

interface ToastContainerProps {
  messages: ToastMessage[];
}
const ToastContainer: React.FC<ToastContainerProps> = ({ messages }) => {
  const messagesWithTransitions = useTransition(messages, {
    key: (message) => message.id,
    from: { right: '-120%' },
    enter: { right: '0%' },
    leave: { right: '-120%' },
    config: { duration: 250 },
  });

  return (
    <Container>
      {messagesWithTransitions(
        (style, item) => item && <Toast style={style} toast={item} />,
      )}
    </Container>
  );
};

export default ToastContainer;
