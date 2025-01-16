import { create } from "zustand";

export const useProductStore = create((set) => ({
  products: [],

  setProducts: (products) => set({ products }),

  fetchProducts: async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();

      if (Array.isArray(data.data)) {
        set({ products: data.data });
      } else {
        console.error("API response format is incorrect:", data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  },

  createProduct: async (newProduct) => {
    if (!newProduct.name || !newProduct.image || !newProduct.price) {
      return { success: false, message: "Please fill in all fields." };
    }
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      });
      const data = await res.json();

      if (res.ok) {
        set((state) => ({ products: [...state.products, data.data] }));
        return { success: true, message: "Product created successfully" };
      } else {
        console.error("Error creating product:", data.message);
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Error creating product:", error);
      return { success: false, message: "Failed to create product." };
    }
  },

  updateProduct: async (pid, updatedProduct) => {
    try {
      const res = await fetch(`/api/products/${pid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProduct),
      });
      const data = await res.json();

      if (res.ok) {
        set((state) => ({
          products: state.products.map((product) =>
            product._id === pid ? data.data : product
          ),
        }));
        return { success: true, message: "Product updated successfully" };
      } else {
        console.error("Error updating product:", data.message);
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Error updating product:", error);
      return { success: false, message: "Failed to update product." };
    }
  },

  deleteProduct: async (pid) => {
    try {
      const res = await fetch(`/api/products/${pid}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok) {
        set((state) => ({
          products: state.products.filter((product) => product._id !== pid),
        }));
        return {
          success: true,
          message: data.message || "Product deleted successfully",
        };
      } else {
        console.error("Error deleting product:", data.message);
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      return { success: false, message: "Failed to delete product." };
    }
  },
}));
