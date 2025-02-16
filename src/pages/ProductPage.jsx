import Pagination from '../components/Pagination';

export default function ProductPage({openCreateProductModal,products,openEditProductModal,openDeleteProductModal,getProducts,pageInfo}){
    return(
                <div className="container py-5">
                  <div className="row">
                    <div className="col">
                      <div className="d-flex justify-content-between align-items-center">
                        <h2>產品列表</h2>
                        <button type="button" className="btn btn-primary" onClick={() => openCreateProductModal()}>建立新的產品</button>
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
                                  <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => openEditProductModal(product)}>編輯</button>
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
    )
}