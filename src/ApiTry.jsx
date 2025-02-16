import { useEffect, useRef, useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function ApiTry(){

    const account = {
        username: "oxfoxlion@gmail.com",
        password: "Shao440723Lion",
      }

    const [products,setProducts] = useState('');

    // 登入API
    const handleLogin = async () => {
    
        try {
          const res = await axios.post(`${BASE_URL}/v2/admin/signin`, account);
    
          const { token, expired } = res.data;
          
          document.cookie = `shaoToken=${token}; expires=${new Date(expired)}`;
    
          axios.defaults.headers.common["Authorization"] = token;

          alert("登入成功");

          getProducts();
    
        } catch (error) {
          alert("登入失敗");
        }
      };

useEffect(()=>{
    handleLogin();
},[])


    // 取得產品列表API
    const getProducts = async () => {
        try {
          const res = await axios.get(
            `${BASE_URL}/v2/api/${API_PATH}/admin/products`
          );
          setProducts(res.data.products);
        } catch (error) {
          alert("取得產品失敗");
        }
      };

    //   編輯產品API

    const editProduct = async () =>{
        try{
            const res = await axios.put(`${BASE_URL}/v2/api/${API_PATH}/admin/product/-OFyfWXOFRHJt0q53bXh`,{
                    "data": {
                      "title": "原味棉花糖軟餅乾",
                      "category": "經典原味",
                      "origin_price": 65,
                      "price": 60,
                      "unit": "個",
                      "description": "讓棉花糖詮釋經典",
                      "content": "麵粉、泡打粉、砂糖、黑糖、可可豆、奶油、雞蛋、棉花糖、MM巧克力、巧克力脆片",
                      "is_enabled": 1,
                      "imageUrl": "https://myship.7-11.com.tw/i/cgdm/GM2411096752224/2411090357207690.jpg",
                      "imagesUrl": [
                        "https://myship.7-11.com.tw/i/cgdm/GM2411096752224/2411090357207295.jpg",
                      ]
                    }
            })

            console.log(res)
            getProducts();
        }
        catch(error){
            console.log('失敗')
        }
    }

    console.log(products)

    // 刪除產品
    const deleteProduct = async () => {
        try {
          const res = await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/admin/product/-OJC_Ht159XHfehoxzQW`)
          console.log(res);
        }
        catch (error) {
          console.log(error);
          console.log('刪除失敗')
        }
      }

    return <>
    
    <button onClick={()=>deleteProduct()}>刪除產品</button>
    </>
};