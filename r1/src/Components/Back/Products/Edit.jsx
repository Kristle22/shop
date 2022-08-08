import { useContext } from 'react';
import { useEffect, useState, useRef } from 'react';
import BackContext from '../BackContext';
import getBase64 from '../../../Functions/getBase64';

function Edit() {
  const {
    modalProduct,
    setModalProduct,
    setEditProduct,
    cats,
    showMessage,
    setDeleteImg,
  } = useContext(BackContext);

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [inStock, setInStock] = useState(false);
  const [cat, setCat] = useState('0');
  const [lu, setLu] = useState('');

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

  // const removeImage = () => {
  //   setImage(null);
  //   showMessage({
  //     text: 'Nuotrauka sekmingai istrinta!',
  //     type: 'info',
  //   });
  // };

  const removeImage = () => {
    setDeleteImg({ id: modalProduct.id });
    setModalProduct((p) => ({ ...p, photo: null }));
    // setImage(null);
  };

  const setDateFormat = (d) => {
    // yyyy-MM-ddThh:mm
    const date = new Date(Date.parse(d));

    const y = date.getFullYear();
    const m = ('' + (date.getMonth() + 1)).padStart(2, '0');
    const day = ('' + (date.getDate() + 1)).padStart(2, '0');
    const h = ('' + date.getHours()).padStart(2, '0');
    const min = ('' + date.getMinutes()).padStart(2, '0');

    const out = y + '-' + m + '-' + day + 'T' + h + ':' + min;

    return out;
  };

  useEffect(() => {
    if (null === modalProduct) return;
    setTitle(modalProduct.title);
    setPrice(modalProduct.price);
    setInStock(modalProduct.in_stock ? true : false);
    setLu(setDateFormat(modalProduct.lu));
    setCat(cats.filter((c) => c.title === modalProduct.cat)[0].id);
    setImage(modalProduct.photo);
  }, [modalProduct, cats]);

  const handleEdit = () => {
    const data = {
      title,
      id: modalProduct.id,
      in_stock: inStock ? 1 : 0,
      price: parseFloat(price),
      cat: parseInt(cat),
      lu: lu,
      photo: image,
    };
    setEditProduct(data);
    setModalProduct(null);
  };

  // console.log(new Date(lu).toISOString().slice(0, 19).replace('T', ' '));

  if (null === modalProduct) {
    return null;
  }

  return (
    <div className='modal'>
      <div className='modal-dialog modal-dialog-centered modal-dialog-scrollable'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h5 className='modal-title'>Change Product info</h5>
            <button
              type='button'
              className='close'
              onClick={() => setModalProduct(null)}
            >
              <span>&times;</span>
            </button>
          </div>
          <div className='modal-body'>
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
            <div className='form-group'>
              <label>Date</label>
              <input
                type='datetime-local'
                className='form-control'
                onChange={(e) => setLu(e.target.value)}
                value={lu}
              />
              <small className='form-text text-muted'>
                Enter date and time here.
              </small>
            </div>
            <div className='form-group form-check'>
              <input
                type='checkbox'
                className='form-check-input'
                id='in--stock--modal'
                checked={inStock}
                onChange={() => setInStock((c) => !c)}
              />
              <label className='form-check-label' htmlFor='in--stock--modal'>
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
              <small className='form-text text-muted'>Upload Photo.</small>
              <button
                style={{
                  width: 'fit-content',
                  fontSize: '10px',
                  backgroundColor: 'crimson',
                  color: 'white',
                  float: 'right',
                  marginTop: '-20px',
                }}
                type='button'
                className='btn btn-outline-danger ml-2'
                onClick={removeImage}
              >
                Remove Photo
              </button>
            </div>
            {image ? (
              <div className='photo-bin'>
                <img src={image} alt='product rendering...' />
              </div>
            ) : null}
            <div className='modal-footer'>
              <button
                type='button'
                className='btn btn-outline-secondary'
                onClick={() => setModalProduct(null)}
              >
                Close
              </button>
              <button
                type='button'
                className='btn btn-outline-primary'
                onClick={handleEdit}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Edit;
