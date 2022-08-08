import { useContext } from 'react';
import FrontContext from './FrontContext';
import Line from './Line';
import SortFilter from './SortFilter';

function List() {
  const { products } = useContext(FrontContext);

  return (
    <div className='card mt-4'>
      <div className='card-header'>
        <h2>List of Products</h2>
      </div>
      <div className='card-body'>
        <SortFilter />
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
