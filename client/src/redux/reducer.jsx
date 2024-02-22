/* eslint-disable no-case-declarations */
import {
	LOG_USER,
	GET_ALL_CLIENTS,
	CREATE_USER,
	CREATE_ADMIN,
	GET_SUSPENDED_CLIENTS,
	VALIDATE_ADMIN,
	VALIDATE_USER,
	GET_LOCAL_DATA,
	GET_CATEGORIES,
	GET_PLANS,
	GET_SUBCATEGORIES,
	GET_PRODUCTS,
	GET_MENU_CATEGORIES,
	ADD_TO_MINICART,
	REMOVE_FROM_MINICART,
	GET_PEDIDOS,
	GET_CLIENTS_TO_CONFIRM,
	GET_CLIENTS_TO_CONFIRM_PLAN,
	GET_PLAN_TO_MENU,
	GET_PEDIDO_STATE
} from './actions';

let initialState = {
	token: {},
	newUser: '',
	newAdmin: '',
	allUsers: [],
	validation: '',
	validationLocal: '',
	localData: {},
	localCategories: [],
	plans: {},
	localSubcategories: [],
	localProducts: [],
	menuCategories: [],
	productsAdeedToMinicart: [],
	userType: '',
	actualUser: {},
	pedidos: [],
	clientsToConfirm: [],
	clientsToConfirmPlan: [],
	planToMenu: '',
	pedidoState: ''
};

function rootReducer(state = initialState, action) {
	switch (action.type) {
		case LOG_USER:
			return {
				...state,
				token: action.payload.token,
				userType: action.payload.msg,
				actualUser: action.payload.usuario
			};

		case CREATE_USER:
			return {
				newUser: action.payload
			};
		case CREATE_ADMIN:
			return {
				newAdmin: action.payload
			};
		case GET_PLANS:
			return {
				...state,
				plans: action.payload
			};

		case GET_ALL_CLIENTS:
			return {
				...state,
				allUsers: action.payload
			};

		case GET_SUSPENDED_CLIENTS:
			return {
				...state,
				allUsers: action.payload
			};

		case GET_CLIENTS_TO_CONFIRM:
			return {
				...state,
				clientsToConfirm: action.payload
			};
		case GET_CLIENTS_TO_CONFIRM_PLAN:
			return {
				...state,
				clientsToConfirmPlan: action.payload
			};
		case VALIDATE_ADMIN:
			return {
				...state,
				validation: action.payload
			};
		case VALIDATE_USER:
			return {
				...state,
				validationLocal: action.payload
			};
		case GET_LOCAL_DATA:
			return {
				...state,
				localData: action.payload
			};
		case GET_CATEGORIES:
			return {
				...state,
				localCategories: action.payload
			};
		case GET_SUBCATEGORIES:
			return {
				...state,
				localSubcategories: action.payload
			};
		case GET_PRODUCTS:
			return {
				...state,
				localProducts: action.payload
			};
		case GET_PEDIDOS:
			return {
				...state,
				pedidos: action.payload
			};
		case GET_MENU_CATEGORIES:
			return {
				...state,
				menuCategories: action.payload
			};
		case ADD_TO_MINICART:
			return {
				...state,
				productsAdeedToMinicart: [
					...state.productsAdeedToMinicart,
					action.payload
				]
			};
		case REMOVE_FROM_MINICART:
			// Filtrar los productos en el carrito, eliminando el producto con el ID especificado
			const filteredProducts = state.productsAdeedToMinicart.filter(
				(product) => product.id !== action.payload
			);
			console.log(filteredProducts, 'filtrados');

			return {
				...state,
				productsAdeedToMinicart: filteredProducts
			};
		case GET_PLAN_TO_MENU:
			return {
				...state,
				planToMenu: action.payload
			};

		case GET_PEDIDO_STATE:
			return {
				...state,
				pedidoState: action.payload
			};
		default:
			return state;
	}
}
export default rootReducer;
