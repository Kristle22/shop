import { useContext } from 'react';
import BackContext from '../BackContext';
import Line from './Line';

function List() {
  const { comments } = useContext(BackContext);

  return (
    <div className='card mt-4'>
      <div className='card-header'>
        <h2>Comments:</h2>
      </div>
      <div className='card-body'>
        <ul className='list-group'>
          {comments
            ? comments.map((com) => <Line key={com.id} line={com} />)
            : null}
        </ul>
      </div>
    </div>
  );
}

export default List;
