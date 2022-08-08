import { useState } from 'react';
import { useContext } from 'react';
import FrontContext from './FrontContext';

function SortFilter() {
  const { dispachProducts, cats, cat, filtering, setSearch, cur, setCurRate } =
    useContext(FrontContext);
  const [sort, setSort] = useState('default');

  const [s, setS] = useState('');

  const [curSelect, setCurSelect] = useState('USD');

  const sorting = (e) => {
    setSort(e.target.value);
    const action = {
      type: e.target.value,
    };
    dispachProducts(action);
  };

  const searching = (e) => {
    setS(e.target.value);
    setSearch(e.target.value);
  };

  const selectCurrency = (code) => {
    setCurSelect(code);
    setCurRate(code);
  };

  return (
    <div className='card mt-4'>
      <div className='card-header'>
        <h2>Sort and Filter</h2>
      </div>
      <div className='card-body'>
        <div className='container'>
          <div className='row'>
            <div className='col-4'>
              <div className='form-group'>
                <label>Sort By</label>
                <select
                  className='form-control'
                  value={sort}
                  onChange={sorting}
                >
                  <option value='default'>Default Sort</option>
                  <option value='ascTitle'>A-Z Title</option>
                  <option value='descTitle'>Z-A Title</option>
                  <option value='ascPrice'>min-max Price</option>
                  <option value='descPrice'>max-min Price</option>
                </select>
              </div>
            </div>
            <div className='col-4'>
              <div className='form-group'>
                <label>Filter By Categories</label>
                <select
                  className='form-control'
                  value={cat}
                  onChange={(e) => filtering(e.target.value)}
                >
                  <option value='0'>All Categories</option>
                  {cats
                    ? cats.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.title}
                        </option>
                      ))
                    : null}
                </select>
              </div>
              <div className='form-group'>
                <label>Currency</label>
                <select
                  className='form-control'
                  value={curSelect}
                  onChange={(e) => selectCurrency(e.target.value)}
                >
                  <option value='0'>Select Currency</option>
                  {cur
                    ? cur.map((c) => (
                        <option key={c.id} value={c.code}>
                          {c.code}
                        </option>
                      ))
                    : null}
                </select>
              </div>
            </div>
            <div className='col-4'>
              <div className='form-group'>
                <label>Search</label>
                <input
                  className='form-control'
                  type='text'
                  value={s}
                  onChange={searching}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SortFilter;
