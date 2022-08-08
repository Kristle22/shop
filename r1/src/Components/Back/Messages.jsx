import { useContext } from 'react';
import BackContext from './BackContext';

function Messages() {
  const { messages } = useContext(BackContext);

  return (
    <div className='show-message'>
      {messages.map((mes) => (
        <div className={'alert alert-' + mes.type} role='alert'>
          {mes.text}
        </div>
      ))}
    </div>
  );
}

export default Messages;
