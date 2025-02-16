import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function DeleteProductModal({getProducts,closeDeleteProductModal,deleteProductModalRef,tempProduct}) {

    // 刪除產品API
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

    return (
        <div
            className="modal fade"
            id="delProductModal"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            ref={deleteProductModalRef}
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
    )
}