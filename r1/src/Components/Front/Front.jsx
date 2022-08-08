import Nav from './Nav';
import List from './List';
import { useState, useEffect, useReducer } from 'react';
import axios from 'axios';
import { authConfig } from '../../Functions/auth';
import FrontContext from './FrontContext';
import productsReducer from './productsReducer';

function Front() {
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [products, dispachProducts] = useReducer(productsReducer, []);
  const [cats, setCats] = useState(null);

  const [filter, setFilter] = useState(0);
  const [cat, setCat] = useState(0);

  const [search, setSearch] = useState('');

  const [createCom, setCreateCom] = useState(null);

  const [cur, setCur] = useState(null);
  const [curRate, setCurRate] = useState(null);

  const filtering = (cid) => {
    setCat(cid);
    setFilter(parseInt(cid));
  };

  // Read PRODUCTS Filter
  useEffect(() => {
    let query;
    if (filter === 0 && !search) {
      query = '';
    } else if (filter) {
      query = '?cat-id=' + filter;
    } else if (search) {
      query = '?s=' + search;
    }

    axios
      .get('http://localhost:3003/prekes' + query, authConfig())
      .then((res) => {
        const products = new Map();
        res.data.forEach((p) => {
          let comment;
          if (null === p.coms) {
            comment = null;
          } else {
            comment = { id: p.com_id, com: p.coms };
          }
          if (products.has(p.id)) {
            const prod = products.get(p.id);
            if (comment) {
              prod.coms.push(comment);
            }
          } else {
            products.set(p.id, { ...p });
            const prod = products.get(p.id);
            prod.coms = [];
            delete prod.com_id;
            if (comment) {
              prod.coms.push(comment);
            }
          }
          console.log('PRODUCTS', products);
          console.log('COMMENT', comment);
        });

        const action = {
          type: 'products_list',
          payload: [...products],
        };
        console.log('Res Data', res.data);
        dispachProducts(action);
      });
  }, [filter, search, lastUpdate]);

  // Read CATS
  useEffect(() => {
    axios.get('http://localhost:3003/kategorijos', authConfig()).then((res) => {
      setCats(res.data);
    });
  }, [lastUpdate]);

  //Create COMMENT
  useEffect(() => {
    if (null === createCom) return;
    axios
      .post('http://localhost:3003/front/komentai', createCom, authConfig())
      .then((res) => {
        // showMessage(res.data.msg);
        setLastUpdate(Date.now());
      });
  }, [createCom]);

  //GET CURRENCY
  useEffect(() => {
    axios
      .get('http://localhost:3003/valiuta', authConfig())
      .then((res) => setCur(res.data));
  }, []);
  console.log('Valiuta', cur);

  useEffect(() => {
    if (null === curRate) return;

    const value = cur.filter((c) => c.code === curRate)[0].value;
    const action = {
      type: 'currency_price',
      payload: products.map((pr) => ({
        ...pr,
        curCode: curRate,
        curVal: pr.price * value,
      })),
    };
    dispachProducts(action);
  }, [curRate, cur, products]);
  console.log('Prekes', products, curRate);

  return (
    <FrontContext.Provider
      value={{
        products,
        dispachProducts,
        cats,
        setFilter,
        filter,
        cat,
        setCat,
        filtering,
        setSearch,
        setCreateCom,
        cur,
        setCurRate,
      }}
    >
      <>
        <Nav />
        <div className='container'>
          <div className='row'>
            <div className='col-12'>
              <List />
            </div>
          </div>
        </div>
      </>
    </FrontContext.Provider>
  );
}

export default Front;
