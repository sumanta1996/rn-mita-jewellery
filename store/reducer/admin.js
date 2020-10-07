import { DELETE_CONTENT, EDIT_CONTENT, FETCH_LATEST_ID, SET_CATEGORIES, SET_PRODUCTS } from "../actions/admin"

const initialState = {
    latestId: '',
    categories: null,
    products: []
}

export default (state = initialState, action) => {
    switch(action.type) {
        case FETCH_LATEST_ID: 
            return {
                ...state,
                latestId: action.id
            }
        case SET_CATEGORIES: 
            return {
                ...state,
                categories: action.categories
            }
        case SET_PRODUCTS: 
            return {
                ...state,
                products: action.products
            }
        case EDIT_CONTENT: 
            const updatedProducts = [...state.products];
            let editedProduct = updatedProducts.find(product => product.key === action.key);
            editedProduct = {
                ...editedProduct,
                category: action.category,
                details: action.details,
                height: action.height,
                id: action.id,
                length: action.length,
                price: action.price,
                title: action.title,
                url: action.url,
                width: action.width

            }
            const index = updatedProducts.findIndex(product => product.key === action.key);
            updatedProducts[index] = editedProduct;
            return {
                ...state,
                products: updatedProducts
            }
        case DELETE_CONTENT: 
            return {
                ...state,
                products: [...state.products].filter(product => product.key !== action.key)
            }
        default: return state;
    }
}