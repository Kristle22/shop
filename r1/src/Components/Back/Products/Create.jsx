import { useRef } from 'react';
import { useContext, useState } from 'react';
import BackContext from '../BackContext';
import getBase64 from '../../../Functions/getBase64';

function Create() {
  const { setCreateProduct, cats, showMessage } = useContext(BackContext);

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [inStock, setInStock] = useState(false);
  const [cat, setCat] = useState('0');

  const fileInput = useRef();
  const [image, setImage] = useState(null);

  const showImage = () => {
    getBase64(fileInput.current.files[0])
      .then((photo) => setImage(photo))
      .catch((_) => {
        showMessage({
          text: 'Failo pasirinkimas atsauktas!',
          type: 'danger',
        });
      });
  };

  const handleCreate = () => {
    if (cat === '0') {
      showMessage({ text: 'Please, select category!', type: 'danger' });
      return;
    }
    const data = {
      title,
      price: parseFloat(price),
      inStock: inStock ? 1 : 0,
      cat: parseInt(cat),
      photo: image,
    };
    setCreateProduct(data);
    setTitle('');
    setPrice('');
    setInStock(false);
    setCat('0');
    setImage(null);
    fileInput.current.value = null;
  };

  return (
    <div className='card mt-4'>
      <div className='card-header'>
        <h2>Create new Product</h2>
      </div>
      <div className='card-body'>
        <div className='form-group'>
          <label>Title</label>
          <input
            type='text'
            className='form-control'
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
          <small className='form-text text-muted'>
            Enter new Product here.
          </small>
        </div>
        <div className='form-group'>
          <label>Price</label>
          <input
            type='text'
            className='form-control'
            onChange={(e) => setPrice(e.target.value)}
            value={price}
          />
          <small className='form-text text-muted'>
            Enter product price here.
          </small>
        </div>
        <div className='form-group form-check'>
          <input
            type='checkbox'
            className='form-check-input'
            id='in--stock'
            checked={inStock}
            onChange={() => setInStock((c) => !c)}
          />
          <label className='form-check-label' htmlFor='in--stock'>
            Check me out
          </label>
        </div>
        <div className='form-group'>
          <label>Categories</label>
          <select
            className='form-control'
            value={cat}
            onChange={(e) => setCat(e.target.value)}
          >
            <option value='0'>Please, select Category</option>
            {cats
              ? cats.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))
              : null}
          </select>
          <small className='form-text text-muted'>
            Select products Category here.
          </small>
        </div>
        <div className='form-group'>
          <label>Photo</label>
          <input
            ref={fileInput}
            type='file'
            className='form-control'
            onChange={showImage}
          />
          <small className='form-text text-muted'>Upload Pfoto.</small>
        </div>
        {image ? (
          <div className='photo-bin'>
            <img src={image} alt='product rendering...' />
          </div>
        ) : null}
        <button
          type='button'
          className='btn btn-outline-primary'
          onClick={handleCreate}
        >
          Create
        </button>
      </div>
    </div>
  );
}

export default Create;
