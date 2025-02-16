import { useState } from "react";
import axios from "axios";

import LoginPage from "./pages/loginPage";
import ProductPage from "./pages/ProductPage";


const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;


function App() {
  const [isAuth, setIsAuth] = useState(false); //紀錄登入狀態
  const [products, setProducts] = useState([]); //紀錄從API中取得的產品列表
  const [pageInfo, setPageInfo] = useState(''); //用來記錄API回傳的page資訊


  // 取得產品列表API
  const getProducts = async (page = 1) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/v2/api/${API_PATH}/admin/products?page=${page}`
      );
      setProducts(res.data.products);
      setPageInfo(res.data.pagination);
    } catch (error) {
      alert("取得產品失敗");
    }
  };

  // 確認登入狀態API
  // const checkUserLogin = async () => {
  //   try {
  //     await axios.post(`${BASE_URL}/v2/api/user/check`);
  //     alert("使用者已登入");
  //     setIsAuth(true);
  //     getProducts();

  //   } catch (error) {
  //     console.log('驗證失敗');
  //   }
  // };

  // 這段是開發的時候便於使用所寫的
  // useEffect(() => {
  //   const token = document.cookie.replace(
  //     /(?:(?:^|.*;\s*)shaoToken\s*\=\s*([^;]*).*$)|^.*$/,
  //     "$1",
  //   );
  //   axios.defaults.headers.common["Authorization"] = token;
  //   checkUserLogin();
  // }, [])

  return (
    <>
      {isAuth ? (
        <ProductPage 
        products={products}
        getProducts={getProducts}
        pageInfo={pageInfo}>
        </ProductPage>
      ) : (
        <LoginPage getProducts={getProducts} setIsAuth={setIsAuth}></LoginPage>
      )}

    </>
  );
}

export default App;