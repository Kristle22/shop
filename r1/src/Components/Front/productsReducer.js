function productsReducer(state, action) {
  let newState = [...state];
  switch (action.type) {
    case 'products_list':
      newState = action.payload.map(pr => pr[1]).map((p, i) => ({ ...p, row: i }));
      break;
    case 'currency_price':
      newState = action.payload;
      console.log('PAYLOAD', action.payload);
      console.log('NEW STATE', newState);
      break;
    case 'ascTitle':
      newState.sort((a, b) => {
        if (a.title > b.title) return 1;
        if (a.title < b.title) return -1;
        return 0;
      });
      break;
    case 'descTitle':
      newState.sort((a, b) => {
        if (a.title > b.title) return -1;
        if (a.title < b.title) return 1;
        return 0;
      });
      break;
    case 'ascPrice':
      newState.sort((a, b) => a.price - b.price);
      break;
    case 'descPrice':
      newState.sort((a, b) => b.price - a.price);
      break;
    case 'default':
      newState.sort((a, b) => a.row - b.row);
      break;
    default:
      newState = state;
  }
  return newState;
}

export default productsReducer;