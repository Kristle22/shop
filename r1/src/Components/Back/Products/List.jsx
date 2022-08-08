import { useContext } from 'react';
import BackContext from '../BackContext';
import Line from './Line';

function List() {
  const { products } = useContext(BackContext);

  return (
    <div className='card mt-4'>
      <div className='card-header'>
        <h2>List of Products</h2>
      </div>
      <div className='card-body'>
        <ul className='list-group'>
          {products
            ? products.map((prod) => <Line key={prod.id} line={prod} />)
            : null}
        </ul>
      </div>
    </div>
  );
}

export default List;
