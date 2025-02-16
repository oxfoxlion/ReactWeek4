import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Modal } from 'bootstrap';

import LoginPage from "./pages/loginPage";
import ProductPage from "./pages/ProductPage";


const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const defaultModalState = { //設定新增產品Modal內的初始資料
  imageUrl: "",
  title: "",
  category: "",
  unit: "",
  origin_price: "",
  price: "",
  description: "",
  content: "",
  is_enabled: 0,
  imagesUrl: [""]
};

function App() {
  const [isAuth, setIsAuth] = useState(false); //紀錄登入狀態
  const [products, setProducts] = useState([]); //紀錄從API中取得的產品列表
  const [tempProduct, setTempProduct] = useState(defaultModalState); //紀錄準備要送出的產品資訊
  
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

  // create Product Modal
  const createProductModal = useRef(null);

  useEffect(() => {
    new Modal(createProductModal.current, {
      backdrop: false //防止點擊背景時關閉Modal
    });

  }, [])
  // 打開Modal
  const openCreateProductModal = () => {


    setTempProduct(defaultModalState); //當Modal打開時自動將tempProduct設定為預設值

    const modalInstance = Modal.getInstance(createProductModal.current);
    modalInstance.show();
  }
  // 關閉Modal
  const closeCreateProductModal = () => {
    const modalInstance = Modal.getInstance(createProductModal.current);
    modalInstance.hide();
  }
  // 表單控制
  const handleModalInputChange = (e) => {
    const { value, name, type, checked } = e.target;

    setTempProduct({
      ...tempProduct, [name]: type === "checkbox" ? checked : value //如果這個input的type是checkbox就回傳checked，否則回傳value
    })
  }

  const handleImageUrlInputChange = (e, index) => {
    const { value } = e.target;

    const newImages = [...tempProduct.imagesUrl]; //把原本的imagesUrl抓出來

    newImages[index] = value; //利用index找到要修改的是第幾個imagesUrl，接著把valuse帶入newImagesUrl

    setTempProduct({
      ...tempProduct, imagesUrl: newImages
    })
  }

  // editProductModal
  const editProductModal = useRef(null);
  useEffect(() => {
    new Modal(editProductModal.current, {
      backdrop: false //防止點擊背景時關閉Modal
    });

  }, [])

  // 打開Modal
  const openEditProductModal = (product) => {
    setTempProduct(product) //當modal打開時將tempProduct設為選中的這個product

    const modalInstance = Modal.getInstance(editProductModal.current);
    modalInstance.show();
  }
  // 關閉Modal
  const closeEditProductModal = () => {
    const modalInstance = Modal.getInstance(editProductModal.current);
    modalInstance.hide();
  }

  // 新增圖片
  const handleAddImage = () => {
    const newImages = [...tempProduct.imagesUrl, ''];

    setTempProduct({
      ...tempProduct, imagesUrl: newImages
    })
  }
  // 取消圖片
  const handleRemoveImage = () => {
    const newImages = [...tempProduct.imagesUrl];

    newImages.pop();//移除最後一個值

    setTempProduct({
      ...tempProduct, imagesUrl: newImages
    })
  }

  // 新增產品API

  const createProduct = async () => {
    try {

      const res = await axios.post(`${BASE_URL}/v2/api/${API_PATH}/admin/product`, {
        data: {
          ...tempProduct,
          origin_price: Number(tempProduct.origin_price),
          price: Number(tempProduct.price),
          is_enabled: tempProduct.is_enabled ? 1 : 0
        }
      })

      getProducts();

    } catch (error) {
      alert('新增失敗')
    }
  }

  const handleCreateProduct = () => {
    createProduct();
    closeCreateProductModal();
  }

  // 編輯產品API

  const editProduct = async (id) => {
    try {
      const res = await axios.put(`${BASE_URL}/v2/api/${API_PATH}/admin/product/${id}`, {
        data: {
          ...tempProduct,
          origin_price: Number(tempProduct.origin_price),
          price: Number(tempProduct.price),
          is_enabled: tempProduct.is_enabled ? 1 : 0
        }
      })

      getProducts();
    }
    catch (error) {
      console.log('編輯失敗')
    }
  }

  const handleEditProduct = (id) => {
    editProduct(id);
    closeEditProductModal();
  }

  // 刪除產品
  const deleteProductModal = useRef(null);

  useEffect(() => {
    new Modal(deleteProductModal.current, {
      backdrop: false //防止點擊背景時關閉Modal
    });

  }, [])

  // 打開Modal
  const openDeleteProductModal = (product) => {
    setTempProduct(product)

    const modalInstance = Modal.getInstance(deleteProductModal.current);
    modalInstance.show();
  }
  // 關閉Modal
  const closeDeleteProductModal = () => {
    const modalInstance = Modal.getInstance(deleteProductModal.current);
    modalInstance.hide();
  }

  // 刪除產品

  const deleteProduct = async (id) => {
    try {
      const res = await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/admin/product/${id}`)
      getProducts();
    }
    catch (error) {
      console.log('刪除失敗')
    }
  }

  const handleDeleteProduct = (id) => {
    deleteProduct(id);
    closeDeleteProductModal();
  }

  
  // 圖片上傳
  const handleFileChange =async (e) =>{
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file-to-upload',file);

    try{
      const res = await axios.post(`${BASE_URL}/v2/api/${API_PATH}/admin/upload`,formData);

      const uploadImageUrl = res.data.imageUrl;
      setTempProduct({...tempProduct,imageUrl:uploadImageUrl});
    }catch(error){
      console.log(error);
    }
  }

  return (
    <>
      {isAuth ? (
        <ProductPage openCreateProductModal={openCreateProductModal}
        products={products}
        openEditProductModal={openEditProductModal}
        openDeleteProductModal={openDeleteProductModal}
        getProducts={getProducts}
        pageInfo={pageInfo}></ProductPage>
      ) : (
        <LoginPage getProducts={getProducts} setIsAuth={setIsAuth}></LoginPage>
      )}
      {/* 新增產品Modal */}
      <div id="createProductModal" className="modal" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} ref={createProductModal}>
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content border-0 shadow">
            <div className="modal-header border-bottom">
              <h5 className="modal-title fs-4">新增產品</h5>
              <button type="button" className="btn-close" aria-label="Close" onClick={closeCreateProductModal}></button>
            </div>

            <div className="modal-body p-4">
              <div className="row g-4">
                <div className="col-md-4">
                  <div className="mb-4">
                    <div className="mb-5">
                      <label htmlFor="fileInput" className="form-label"> 圖片上傳 </label>
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        className="form-control"
                        id="fileInput"
                        onChange={(e)=>handleFileChange(e)}
                      />
                    </div>
                    <label htmlFor="create-primary-image" className="form-label">
                      主圖
                    </label>
                    <div className="input-group">
                      <input
                        value={tempProduct.imageUrl}
                        onChange={handleModalInputChange}
                        name="imageUrl"
                        type="text"
                        id="create-primary-image"
                        className="form-control"
                        placeholder="請輸入圖片連結"
                      />
                    </div>
                    <img
                      src={tempProduct.imageUrl}
                      alt={tempProduct.title}
                      className="img-fluid"
                    />
                  </div>

                  {/* 副圖 */}
                  <div className="border border-2 border-dashed rounded-3 p-3">
                    {tempProduct.imagesUrl?.map((image, index) => (
                      <div key={index} className="mb-2">
                        <label
                          htmlFor={`create-imagesUrl-${index + 1}`}
                          className="form-label"
                        >
                          副圖 {index + 1}
                        </label>
                        <input
                          value={image}
                          onChange={(e) => handleImageUrlInputChange(e, index)}
                          id={`create-imagesUrl-${index + 1}`}
                          type="text"
                          placeholder={`圖片網址 ${index + 1}`}
                          className="form-control mb-2"
                        />
                        {image && (
                          <img
                            src={image}
                            alt={`副圖 ${index + 1}`}
                            className="img-fluid mb-2"
                          />
                        )}
                      </div>
                    ))}

                    <div className="btn-group w-100">
                      {tempProduct.imagesUrl.length < 5 && tempProduct.imagesUrl[tempProduct.imagesUrl.length - 1] !== '' && (<button className="btn btn-outline-primary btn-sm w-100" onClick={handleAddImage}>新增圖片</button>)}
                      {tempProduct.imagesUrl.length > 1 && (
                        <button className="btn btn-outline-danger btn-sm w-100" onClick={handleRemoveImage}>取消圖片</button>
                      )}
                    </div>

                  </div>
                </div>

                <div className="col-md-8">
                  <div className="mb-3">
                    <label htmlFor="create-title" className="form-label">
                      標題
                    </label>
                    <input
                      value={tempProduct.title}
                      onChange={handleModalInputChange}
                      name="title"
                      id="create-title"
                      type="text"
                      className="form-control"
                      placeholder="請輸入標題"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="create-category" className="form-label">
                      分類
                    </label>
                    <input
                      value={tempProduct.category}
                      onChange={handleModalInputChange}
                      name="category"
                      id="create-category"
                      type="text"
                      className="form-control"
                      placeholder="請輸入分類"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="create-unit" className="form-label">
                      單位
                    </label>
                    <input
                      value={tempProduct.unit}
                      onChange={handleModalInputChange}
                      name="unit"
                      id="create-unit"
                      type="text"
                      className="form-control"
                      placeholder="請輸入單位"
                    />
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <label htmlFor="create-origin_price" className="form-label">
                        原價
                      </label>
                      <input
                        value={tempProduct.origin_price}
                        onChange={handleModalInputChange}
                        name="origin_price"
                        id="create-origin_price"
                        type="number"
                        className="form-control"
                        placeholder="請輸入原價"
                      />
                    </div>
                    <div className="col-6">
                      <label htmlFor="create-price" className="form-label">
                        售價
                      </label>
                      <input
                        value={tempProduct.value}
                        onChange={handleModalInputChange}
                        name="price"
                        id="create-price"
                        type="number"
                        className="form-control"
                        placeholder="請輸入售價"
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="create-description" className="form-label">
                      產品描述
                    </label>
                    <textarea
                      value={tempProduct.description}
                      onChange={handleModalInputChange}
                      name="description"
                      id="create-description"
                      className="form-control"
                      rows={4}
                      placeholder="請輸入產品描述"
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="create-content" className="form-label">
                      說明內容
                    </label>
                    <textarea
                      value={tempProduct.content}
                      onChange={handleModalInputChange}
                      name="content"
                      id="create-content"
                      className="form-control"
                      rows={4}
                      placeholder="請輸入說明內容"
                    ></textarea>
                  </div>

                  <div className="form-check">
                    <input
                      checked={tempProduct.is_enabled}
                      onChange={handleModalInputChange}
                      name="is_enabled"
                      type="checkbox"
                      className="form-check-input"
                      id="create-isEnabled"
                    />
                    <label className="form-check-label" htmlFor="create-isEnabled">
                      是否啟用
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer border-top bg-light">
              <button type="button" className="btn btn-secondary" onClick={closeCreateProductModal}>
                取消
              </button>
              <button type="button" className="btn btn-primary" onClick={handleCreateProduct}>
                確認
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* 編輯產品Modal */}
      <div id="editProductModal" className="modal" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} ref={editProductModal}>
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content border-0 shadow">
            <div className="modal-header border-bottom">
              <h5 className="modal-title fs-4">編輯產品</h5>
              <button type="button" className="btn-close" aria-label="Close" onClick={closeEditProductModal}></button>
            </div>

            <div className="modal-body p-4">
              <div className="row g-4">
                <div className="col-md-4">
                  <div className="mb-4">
                    <div className="mb-5">
                      <label htmlFor="fileInput" className="form-label"> 圖片上傳 </label>
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        className="form-control"
                        id="fileInput"
                        onChange={(e)=>handleFileChange(e)}
                      />
                    </div>
                    <label htmlFor="edit-primary-image" className="form-label">
                      主圖
                    </label>
                    <div className="input-group">
                      <input
                        value={tempProduct.imageUrl}
                        onChange={handleModalInputChange}
                        name="imageUrl"
                        type="text"
                        id="edit-primary-image"
                        className="form-control"
                        placeholder="請輸入圖片連結"
                      />
                    </div>
                    <img
                      src={tempProduct.imageUrl}
                      alt={tempProduct.title}
                      className="img-fluid"
                    />
                  </div>

                  {/* 副圖 */}
                  <div className="border border-2 border-dashed rounded-3 p-3">
                    {tempProduct.imagesUrl?.map((image, index) => (
                      <div key={index} className="mb-2">
                        <label
                          htmlFor={`edit-imagesUrl-${index + 1}`}
                          className="form-label"
                        >
                          副圖 {index + 1}
                        </label>
                        <input
                          value={image}
                          onChange={(e) => handleImageUrlInputChange(e, index)}
                          id={`edit-imagesUrl-${index + 1}`}
                          type="text"
                          placeholder={`圖片網址 ${index + 1}`}
                          className="form-control mb-2"
                        />
                        {image && (
                          <img
                            src={image}
                            alt={`副圖 ${index + 1}`}
                            className="img-fluid mb-2"
                          />
                        )}
                      </div>
                    ))}

                    <div className="btn-group w-100">
                      {tempProduct.imagesUrl.length < 5 && tempProduct.imagesUrl[tempProduct.imagesUrl.length - 1] !== '' && (<button className="btn btn-outline-primary btn-sm w-100" onClick={handleAddImage}>新增圖片</button>)}
                      {tempProduct.imagesUrl.length > 1 && (
                        <button className="btn btn-outline-danger btn-sm w-100" onClick={handleRemoveImage}>取消圖片</button>
                      )}
                    </div>

                  </div>
                </div>

                <div className="col-md-8">
                  <div className="mb-3">
                    <label htmlFor="edit-title" className="form-label">
                      標題
                    </label>
                    <input
                      value={tempProduct.title}
                      onChange={handleModalInputChange}
                      name="title"
                      id="edit-title"
                      type="text"
                      className="form-control"
                      placeholder="請輸入標題"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="edit-category" className="form-label">
                      分類
                    </label>
                    <input
                      value={tempProduct.category}
                      onChange={handleModalInputChange}
                      name="category"
                      id="edit-category"
                      type="text"
                      className="form-control"
                      placeholder="請輸入分類"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="edit-unit" className="form-label">
                      單位
                    </label>
                    <input
                      value={tempProduct.unit}
                      onChange={handleModalInputChange}
                      name="unit"
                      id="edit-unit"
                      type="text"
                      className="form-control"
                      placeholder="請輸入單位"
                    />
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <label htmlFor="edit-origin_price" className="form-label">
                        原價
                      </label>
                      <input
                        value={tempProduct.origin_price}
                        onChange={handleModalInputChange}
                        name="origin_price"
                        id="edit-origin_price"
                        type="number"
                        className="form-control"
                        placeholder="請輸入原價"
                      />
                    </div>
                    <div className="col-6">
                      <label htmlFor="edit-price" className="form-label">
                        售價
                      </label>
                      <input
                        value={tempProduct.price}
                        onChange={handleModalInputChange}
                        name="price"
                        id="edit-price"
                        type="number"
                        className="form-control"
                        placeholder="請輸入售價"
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="edit-description" className="form-label">
                      產品描述
                    </label>
                    <textarea
                      value={tempProduct.description}
                      onChange={handleModalInputChange}
                      name="description"
                      id="edit-description"
                      className="form-control"
                      rows={4}
                      placeholder="請輸入產品描述"
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="edit-content" className="form-label">
                      說明內容
                    </label>
                    <textarea
                      value={tempProduct.content}
                      onChange={handleModalInputChange}
                      name="content"
                      id="edit-content"
                      className="form-control"
                      rows={4}
                      placeholder="請輸入說明內容"
                    ></textarea>
                  </div>

                  <div className="form-check">
                    <input
                      checked={tempProduct.is_enabled}
                      onChange={handleModalInputChange}
                      name="is_enabled"
                      type="checkbox"
                      className="form-check-input"
                      id="edit-isEnabled"
                    />
                    <label className="form-check-label" htmlFor="edit-isEnabled">
                      是否啟用
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer border-top bg-light">
              <button type="button" className="btn btn-secondary" onClick={closeEditProductModal}>
                取消
              </button>
              <button type="button" className="btn btn-primary" onClick={() => handleEditProduct(tempProduct.id)}>
                確認
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* 刪除產品Modal */}
      <div
        className="modal fade"
        id="delProductModal"
        tabIndex="-1"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        ref={deleteProductModal}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">刪除產品</h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={closeDeleteProductModal}
              ></button>
            </div>
            <div className="modal-body">
              你是否要刪除
              <span className="text-danger fw-bold">{tempProduct.title}</span>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeDeleteProductModal}
              >
                取消
              </button>
              <button type="button" className="btn btn-danger" onClick={() => handleDeleteProduct(tempProduct.id)}>
                刪除
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;