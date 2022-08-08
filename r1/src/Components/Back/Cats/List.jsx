import { useContext } from 'react';
import BackContext from '../BackContext';
import Line from './Line';

function List() {
  const { cats } = useContext(BackContext);

  return (
    <div className='card mt-4'>
      <div className='card-header'>
        <h2>List of Categories</h2>
      </div>
      <div className='card-body'>
        <ul className='list-group'>
          {cats ? cats.map((cat) => <Line key={cat.id} line={cat} />) : null}
        </ul>
      </div>
    </div>
  );
}

export default List;
