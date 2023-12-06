//handle edit and delete 
import InventoryCard from "./InventoryCard";
import CartList from "./CartList";
//import { products } from "./data/products";
import { useState, useEffect } from "react";
import axios from "axios";
import InventoryForm from "./InventoryForm";



export default function GroceriesApp() {

  const emptyProduct = {
    id: "",
    productName: "",
    brand: "",
    quantity: "",
    image: "",
    price: "",

  };

  const [cartList, setCartList] = useState([]);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState(emptyProduct);
  const [responseData, setResponseData] = useState("");
  const [toggleEdit,  setToggleEdit] = useState(false);
//useeffect : if yoou wanna call once or without every refresh(erending)
useEffect(() => {
    handleGetProducts();
},[responseData]);

//GET PRODUCTS
const handleGetProducts = async() => {
  await axios.get("http://localhost:3001/products").then((response) => {
     setProducts(response.data);
});
};

//POST PRODUCT
const handlePostProduct = async (product) => {
  const postProduct = {
    id: product.id,
    productName: product.productName,
    brand: product.brand,
    quantity: product.quantity,
    image: product.image,
    price: product.price


  };
  await axios.
  post("http://localhost:3001/addProduct", postProduct)
  .then((response) => setResponseData(<p>{response.data}</p>));
};

//ADD CART
  const handleAddToCart = (item) => {
    setCartList((prevList) => {
      console.log(cartList);
      return [...prevList, { ...item, id: crypto.randomUUID() }];
    });
  };

  //EMPTYCART
  const handleEmptyCart = () => {
    setCartList([]);
  };

  //REMOVECART
  const handleRemoveItem = (id) => {
    setCartList((prevList) => {
      return prevList.filter((i) => i.id !== id);
    });
  };

   //onChange handler
  const handleOnChange = (evt) => {
    const fieldName = evt.target.name;
    const fieldValue = evt.target.value;
    setFormData((prevData) => {
      return{
        ...prevData,
        id: crypto.randomUUID(),
        [fieldName]: fieldValue,

      };
    });
  };

  const handleOnSubmit = (evt) => {
    evt.preventDefault;
    toggleEdit ? handleProductEdit(formData) : handlePostProduct(formData);
    setFormData(emptyProduct)
  };

  const handleProductDelete = async(product) => {
    const id = product._id;
    axios 
    .delete(`http://localhost:3001/products/${id}`)
    .then((response) => setResponseData(<p>{response.data}</p>));
  }

  const handleProductEdit = async(product) => {
    const id =product._id;
    const editData = {
      id: product.id,
      productName: product.productName,
      brand: product.brand,
      quantity: product.quantity,
      image: product.image,
       price: product.price
    };
    await axios
    .patch(`http://localhost:3001/product/${id}`, editData)
    .then((response) => setResponseData(<p>{response.data}</p>)).then(setToggleEdit(false));
  };

  const handleToggleEdit =  (product) => {
    setFormData(product);
    setToggleEdit(true);
  };



  return (
    <>
      <h1>Groceries App</h1>
      <InventoryForm 
      handleOnSubmit={handleOnSubmit} 
      formData={formData} 
      handleOnChange ={handleOnChange}
      handleToggleEdit = {handleToggleEdit}
      toggleEdit = {toggleEdit}
      />
      {responseData}
      <div className="GroceriesApp-Container">
        <InventoryCard 
        list={products} 
        onClick={handleAddToCart} 
        handleProductDelete={handleProductDelete}
        handleToggleEdit = {handleToggleEdit}
         />
        <CartList
          cartList={cartList}
          onClickEmpty={handleEmptyCart}
          onClickRemove={handleRemoveItem}
        />
      </div>
    </>
  );
}
