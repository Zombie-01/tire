"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from "react";

export interface CartItem {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem[] }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | null>(null);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const payloadItems = Array.isArray(action.payload)
        ? action.payload
        : [action.payload];
      const existingItem = state.items.find(
        (item) => item.id === payloadItems[0].id
      );

      if (existingItem) {
        const updatedItems = state.items.map((item) =>
          item.id === payloadItems[0].id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        return {
          items: updatedItems,
          total: updatedItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          ),
        };
      } else {
        const newItems = [
          ...state.items,
          ...payloadItems.map((item) => ({ ...item, quantity: 1 })),
        ];
        return {
          items: newItems,
          total: newItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          ),
        };
      }
    }

    case "REMOVE_ITEM": {
      const filteredItems = state.items.filter(
        (item) => item.id !== action.payload
      );
      return {
        items: filteredItems,
        total: filteredItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
      };
    }

    case "UPDATE_QUANTITY": {
      const updatedItems = state.items
        .map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.max(0, action.payload.quantity) }
            : item
        )
        .filter((item) => item.quantity > 0);

      return {
        items: updatedItems,
        total: updatedItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
      };
    }

    case "CLEAR_CART":
      return { items: [], total: 0 };

    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });

  // Initialize cart from localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);
      dispatch({ type: "ADD_ITEM", payload: parsedCart.items });
    }
  }, []);

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state));
  }, [state]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
