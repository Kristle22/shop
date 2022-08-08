import Nav from '../Nav';
import List from './List';

function Crud() {
  return (
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
  );
}

export default Crud;
