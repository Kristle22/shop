import { useContext } from 'react';
import BackContext from '../BackContext';

function Line({ line }) {
  const { setDeleteProduct, setModalProduct } = useContext(BackContext);

  const handleModal = () => {
    setModalProduct(line);
  };

  const handleDelete = () => {
    setDeleteProduct(line);
  };

  return (
    <li className='list-group-item'>
      <div className='item'>
        <div className='content'>
          <div style={{ width: '25%', margin: '10px' }}>
            {line.photo ? (
              <div className='photo-bin'>
                <img src={line.photo} alt={line.title} />
              </div>
            ) : null}
          </div>
          <b>{line.title}</b>
          <b>{line.price.toFixed(2)} Eur.</b>
          <div
            className='box'
            style={{ backgroundColor: line.in_stock ? 'coral' : null }}
          ></div>
          <span>{new Date(Date.parse(line.lu)).toLocaleString()}</span>
          <div className='cat'>{line.cat}</div>
        </div>
        <div className='buttons'>
          <button
            type='button'
            className='btn btn-outline-success'
            onClick={handleModal}
          >
            Edit
          </button>
          <button
            type='button'
            className='btn btn-outline-danger ml-2'
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </li>
  );
}

export default Line;
