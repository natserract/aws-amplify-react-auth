export const initialState = {
  loading: false,
  errors: false,
};

// Create reducer
export const SignInReducer = (state: any = initialState, action: any) => {
  switch (action.type) {
    case "@@FETCH_REQUEST": {
      return {
        ...state,
        errors: "",
        loading: true,
      };
    }

    case "@@FETCH_SUCCESS": {
      return {
        ...state,
        loading: false,
      };
    }

    case "@@FETCH_ERROR": {
      return {
        ...state,
        loading: false,
        errors: true,
      };
    }

    default:
      return state;
  }
};
