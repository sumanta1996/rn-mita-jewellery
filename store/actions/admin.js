export const UPLOAD_CONTENT = 'UPLOAD_CONTENT';
export const FETCH_LATEST_ID = 'FETCH_LATEST_ID';
export const SET_CATEGORIES = 'SET_CATEGORIES';
export const SET_PRODUCTS = 'SET_PRODUCTS';
export const EDIT_CONTENT = 'EDIT_CONTENT';
export const DELETE_CONTENT = 'DELETE_CONTENT';

export const uploadContent = (id, title, category, details, price, length, width, height, imageUrls) => {
    return async dispatch => {
        let response;
        try {
            response = await fetch('https://mita-jewellery.firebaseio.com/posts.json', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: id,
                    title: title,
                    category: category,
                    details: details,
                    price: price,
                    length: length,
                    width: width,
                    height: height,
                    url: imageUrls
                })
            });
        } catch (err) {
            throw new Error(err.message);
        }
        if (!response.ok) {
            throw new Error('Something went wrong!');
        }
        response = await response.json();
    }
}

export const editContent = (key, id, title, category, details, price, length, width, height, imageUrls) => {
    return async dispatch => {
        let response;
        try {
            response = await fetch(`https://mita-jewellery.firebaseio.com/posts/${key}.json`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: id,
                    title: title,
                    category: category,
                    details: details,
                    price: price,
                    length: length,
                    width: width,
                    height: height,
                    url: imageUrls
                })
            });
            dispatch({
                type: EDIT_CONTENT,
                key: key,
                id: id,
                title: title,
                category: category,
                details: details,
                price: price,
                length: length,
                width: width,
                height: height,
                url: imageUrls
            })
        } catch (err) {
            throw new Error(err.message);
        }
        if (!response.ok) {
            throw new Error('Something went wrong!');
        }
        response = await response.json();
    }
}

export const fetchLatestId = () => {
    return async dispatch => {
        let res;
        try {
            res = await fetch('https://mita-jewellery.firebaseio.com/posts.json?orderBy="category"&limitToLast=1', {
                method: 'GET',
            });
            res = await res.json();
        } catch (err) {
            throw new Error(err.message);
        }

        for (let key in res) {
            if (res[key].id) {
                const id = 'AMJ ' + ((+res[key].id.substring(4)) + 1);
                dispatch({
                    type: FETCH_LATEST_ID,
                    id: id
                })
            } else {
                dispatch({
                    type: FETCH_LATEST_ID,
                    id: 'AMJ 1'
                })
            }
        }
    }
}

export const fetchCategories = () => {
    return async dispatch => {
        let response = await fetch('https://mita-jewellery.firebaseio.com/Categories.json', {
            method: 'GET'
        });
        if (!response.ok) {
            throw new Error('Something went wrong');
        }
        response = await response.json();
        const categories = [];
        for (let key in response) {
            categories.push(response[key]);
        }
        dispatch({
            type: SET_CATEGORIES,
            categories: categories
        });

    }
}

export const fetchProducts = () => {
    return async dispatch => {
        let response = await fetch('https://mita-jewellery.firebaseio.com/posts.json', {
            method: 'GET'
        });
        if (!response.ok) {
            throw new Error('Something went wrong');
        }
        response = await response.json();
        const products = [];
        for (let key in response) {
            products.push({
                ...response[key],
                key: key
            });
        }
        dispatch({
            type: SET_PRODUCTS,
            products: products
        });

    }
}

export const deleteContent = key => {
    return async dispatch => {
        try {
            const response = await fetch(`https://mita-jewellery.firebaseio.com/posts/${key}.json`, {
                method: 'DELETE'
            });
            if (response.ok) {
                dispatch({
                    type: DELETE_CONTENT,
                    key: key
                });
            }else {
                throw new Error('Please Check your internet connectivity!');
            }
        } catch (err) {
            throw new Error('Something went wrong!');
        }
    }
}