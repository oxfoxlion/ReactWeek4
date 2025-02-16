import { useEffect, useRef, useState } from "react";
import { Modal } from 'bootstrap';

import Pagination from '../components/Pagination';
import ProductModal from "../components/ProductModal";
import DeleteProductModal from "../components/DeleteProductModal";

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

export default function ProductPage({ products, getProducts, pageInfo }) {
    const [modalMode, setModalMode] = useState('');
    const [tempProduct, setTempProduct] = useState(defaultModalState); //紀錄準備要送出的產品資訊


    // Modal
    const productModalRef = useRef(null);

    useEffect(() => {
        new Modal(productModalRef.current, {
            backdrop: false //防止點擊背景時關閉Modal
        });

    }, [])

    // 打開Modal
    const openProductModal = (mode, product) => {

        setModalMode(mode);
        setTempProduct(product);

        const modalInstance = Modal.getInstance(productModalRef.current);
        modalInstance.show();
    }
    // 關閉Modal
    const closeProductModal = () => {
        const modalInstance = Modal.getInstance(productModalRef.current);
        modalInstance.hide();
    }


    
    // 刪除產品Modal
    const deleteProductModalRef = useRef(null);

    useEffect(() => {
        new Modal(deleteProductModalRef.current, {
            backdrop: false //防止點擊背景時關閉Modal
        });

    }, [])

    // 打開刪除產品Modal
    const openDeleteProductModal = (product) => {
        setTempProduct(product)

        const modalInstance = Modal.getInstance(deleteProductModalRef.current);
        modalInstance.show();
    }
    // 關閉刪除產品Modal
    const closeDeleteProductModal = () => {
        const modalInstance = Modal.getInstance(deleteProductModalRef.current);
        modalInstance.hide();
    }

    return (
        <>
            <div className="container py-5">
                <div className="row">
                    <div className="col">
                        <div className="d-flex justify-content-between align-items-center">
                            <h2>產品列表</h2>
                            <button type="button" className="btn btn-primary" onClick={() => openProductModal('create',defaultModalState)}>建立新的產品</button>
                        </div>

                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">產品名稱</th>
                                    <th scope="col">原價</th>
                                    <th scope="col">售價</th>
                                    <th scope="col">是否啟用</th>
                                    <th scope="col">編輯</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.id}>
                                        <th scope="row">{product.title}</th>
                                        <td>{product.origin_price}</td>
                                        <td>{product.price}</td>
                                        {product.is_enabled ? <td className="text-success">已啟用</td> : <td className="text-danger">未啟用</td>}
                                        <td>
                                            <div className="btn-group">
                                                <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => openProductModal('edit',product)}>編輯</button>
                                                <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => openDeleteProductModal(product)}>刪除</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <Pagination pageInfo={pageInfo} getProducts={getProducts}></Pagination>

                    </div>
                </div>
            </div>

            <ProductModal setTempProduct={setTempProduct}
            tempProduct={tempProduct}
            getProducts={getProducts}
            closeProductModal={closeProductModal}
            productModalRef={productModalRef}
            modalMode={modalMode}
            ></ProductModal>

            <DeleteProductModal getProducts={getProducts}
            closeDeleteProductModal={closeDeleteProductModal}
            deleteProductModalRef={deleteProductModalRef}
            tempProduct={tempProduct}
            ></DeleteProductModal>

        </>

    )
}