import { useState } from 'react';
import { useContext } from 'react';
import FrontContext from './FrontContext';

function Line({ line }) {
  const { filtering, setCreateCom } = useContext(FrontContext);

  const [com, setCom] = useState('');

  const addComment = () => {
    setCreateCom({ product_id: line.id, com });
    setCom('');
  };
  // console.log(line);

  return (
    <li className='list-group-item'>
      <div className='item front'>
        <div className='content'>
          <div style={{ width: '25%', margin: '10px' }}>
            {line.photo ? (
              <div className='photo-bin'>
                <img src={line.photo} alt={line.title} />
              </div>
            ) : null}
          </div>
          <b>{line.title}</b>
          <b>
            {line.curCode ? (
              <i>
                {line.curVal} {line.curCode}
              </i>
            ) : (
              <i>{line.price.toFixed(2)} USD.</i>
            )}
          </b>
          <div
            className='box'
            style={{ backgroundColor: line.in_stock ? 'coral' : null }}
          ></div>
          <span>{new Date(Date.parse(line.lu)).toLocaleString()}</span>
          <div className='cat' onClick={() => filtering(line.cid)}>
            {line.cat}
          </div>
        </div>
        <div className='comments'>
          <h5>Comments</h5>
          <ul className='list-group'>
            {line.coms.map((c) => (
              <li key={c.id} className='list-group-item'>
                {c.com}
              </li>
            ))}
          </ul>
          <div className='form-group'>
            <label>Add comment</label>
            <textarea
              className='form-control'
              rows='3'
              value={com}
              onChange={(e) => setCom(e.target.value)}
            ></textarea>
          </div>
          <button
            type='button'
            className='btn btn-outline-primary'
            onClick={addComment}
          >
            Post comment
          </button>
        </div>
      </div>
    </li>
  );
}

export default Line;
