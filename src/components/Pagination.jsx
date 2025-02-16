export default function Pagination({ pageInfo, getProducts }) {

    // 取得不同頁碼的產品資訊
    const handlePageChange = (e, page) => {
        e.preventDefault();
        getProducts(page);
    }


    return (<div className="d-flex justify-content-center">
        <nav>
            <ul className="pagination">
                <li className="page-item">
                    <a className={`page-link ${pageInfo.has_pre ? '' : 'disabled'}`} href="#" onClick={(e) => handlePageChange(e, pageInfo.current_page - 1)}>
                        上一頁
                    </a>
                </li>

                {Array.from({ length: pageInfo.total_pages }).map((item, index) => (
                    <li className={`page-item ${pageInfo.current_page === index + 1 && 'active'}`} key={index}>
                        <a className="page-link" href="#" onClick={(e) => handlePageChange(e, index + 1)}>
                            {index + 1}
                        </a>
                    </li>
                ))

                }

                <li className="page-item">
                    <a className={`page-link ${pageInfo.has_next ? '' : 'disabled'}`} href="#" onClick={(e) => handlePageChange(e, pageInfo.current_page + 1)}>
                        下一頁
                    </a>
                </li>

            </ul>
        </nav>
    </div>)
}