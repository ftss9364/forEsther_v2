import { useState, useEffect } from "react";
import axios from "axios";
import PageCard from "../../components/page/PageCard";
import PageHeader from "../../components/page/PageHeader";
import PageTitle from "../../components/page/PageTitle";
import Table from "../../components/table/Table";
import Pagination from "../../components/pagination/Pagination";
import Button from "../../components/button/Button";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import SearchInput from "../../components/search/SearchInput";
import Dropdown from "../../components/form/Dropdown";
import Input from "../../components/form/Input";
import '../../styles/common/BomRegister.css'

const RegisterPage = () => {
  const {bom_code} = useParams();
  const {isNew} = useParams();
  const [bom, setBom] = useState();
  const [childItemList, setChildItemList] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [productName, setProductName] = useState('');
  const [searchItemName, setSearchItemName] = useState('');
  // const [data, setData] = useState([]);
  // const [tableBody, setTableBody] = useState([]);
  const history = useHistory();
  // const [temp, setTemp] = useState();
  
  useEffect(() => {
      getData();
      console.log(bom_code);
    }, []);
    
    

  const getData = () => {
    axios.get(`register/data/${bom_code}`, {
      
    }).then((res) => {
      // console.log(res.data.bom_register_vo);
      setItemList(res.data.item_list);
      let arr = [];
      if(res.data.bom.bom_register_vo !== null) {
        res.data.bom.bom_register_vo.map((data, i) => {
          data.item_vo.item_code = data.item_code;
          arr.push(data);
        });
      }
      setBom(res.data.bom);
      setProductName(res.data.bom.product_name);
      setChildItemList(arr);
      // console.log(bom);
      // console.log(itemList);
    });
    
  };

  const removeItem = (data) => {
    data.item_vo.item_code = data.item_code;
    let arr = [data.item_vo];
    setChildItemList(prevData => prevData.filter(item => item.item_code !== data.item_code));
    // arr = [...arr, itemList];

    setItemList([...arr,...itemList]);
    console.log(childItemList);
    console.log(itemList);
  }

  const addItem = (data) => {
    const temp = {
      bom_registration_code: '',
      bom_code: bom_code,
      item_code: data.item_code,
      item_vo: data,
      required_quantity: 0,
    }
    let arr = [temp];
    // let arr2 = [...arr, ...childItemList];
    // console.log(childItemList);
    arr = [...arr, ...childItemList];
    console.log(arr);
    setItemList(prevData => prevData.filter(item => item.item_code !== data.item_code));
    setChildItemList(arr);
  }

  const handleQuantityChange = (index, value) => {
    // childItemList에서 해당 데이터를 복제하고 값을 업데이트합니다.
    const updatedData = [...childItemList];
    updatedData[index].required_quantity = value;
    
    // 업데이트된 데이터로 상태를 업데이트합니다.
    setChildItemList(updatedData);
  };

  const onSearchItem = (e) => {
    //Enter가 눌렸을 때 함수가 호출
    if(e.key == 'Enter'){
      getSearchItemList();
    }
  }
  
  
  const getSearchItemList = () => {
    let arr = [];
    childItemList.map((data, i) => {
      arr.push(data.item_code);
    });
    axios.post(`register/search`, {
      ItemCodeArr: arr,
      itemName: searchItemName,
    }).then((res) => {
      
      setItemList(res.data.items);

    });

    
  }; 
  


  const registerBom = () => {
    const rowDataList = [];
    if(childItemList.length > 0) {
      childItemList.map((data, i) => {
        
        if(data.required_quantity !== 0) {
          let item = {
            bomCode: data.bom_code,
            itemCode: data.item_code,
            itemName: data.item_vo.item_name,
            itemRequiredQuantity: data.required_quantity
          }
          rowDataList.push(item);
        } 
        
        
      }); 
    } else {
      let item = {
        bomCode: bom_code,
        itemCode: "null",
        itemName: "null",
        itemRequiredQuantity: "null"
      }
      rowDataList.push(item);
    }
    console.log(rowDataList);
    axios.post(`modify`, rowDataList).then(() => {
      history.push('/boms');
    });
  }



  return (
    <PageCard>
      <PageHeader>
        <PageTitle value="BOM상세정보"/>
        <div>
          <Button 
            buttonClass={"btn btn-outline-dark"} 
            buttonName="취소" 
            onClick={() => {
              history.push('/boms')
            }}  
          />
          <Button 
            buttonClass={"btn-dark"} 
            buttonName="BOM 등록" 
            onClick={registerBom}
          />
        </div>
      </PageHeader>

                          
      <div className="bigbox">
        <div className="smallbox-1">
          <ul>
            <li><h3>BOM 코드 : {bom_code}</h3></li>
            <li><h3>모품목 코드 : {bom_code.substr(2, 5)}</h3></li>
            <li><h3>모품명 : {bom && productName}</h3></li>
          </ul>
						
					<br/>
          {/* <!-- Vertical Scrollbar --> */}
          <h4 className="text-primary">자품목 리스트</h4>
          <div className="test-ui-bg scroll-list">
            <div className="col-md-6 col-sm-12 div-table">
              <div className="card overflow-hidden mb-4 div-scroll-list-1">
                <div className="card-body overflow-auto">
                    
                    {/* <!-- Table UI --> */}
                 <div className="table-responsive text-nowrap">
                    <table className="table table-bordered item-table table-1">
                      <thead>
                        <tr>
                          <th>순번</th>
                          <th>품목코드</th>
                          <th>품목명</th>
                          <th>규격</th>
                          <th>필요수량</th>     
                          <th></th>                             
                        </tr>
                      </thead>
                      <tbody>
                        {childItemList &&
                          childItemList.map((data, i) => {
                            return (
                              <tr>
                                <td>{i+1}</td>
                                <td className="td-box">
                                  <a className="item-code move" href={data.item_code}>{data.item_code}</a>
                                </td>
                                <td className="item-name">{data.item_vo.item_name}</td>
                                <td>{data.item_vo.item_specification}</td>
                                <td>
                                  <input 
                                    className="item-required-quantity" 
                                    type="text" 
                                    value={data.required_quantity} 
                                    onChange={(e) => handleQuantityChange(i, e.target.value)}
                                    // onKeyUp={onSearchItem}
                                  />
                                </td>
                                <td className="td-btn">
                                  <button 
                                    type="button" 
                                    className="btn rounded-circle btn-icon"
                                    onClick={() => removeItem(data)}
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" fill="#ff3e1d" className="bi bi-dash-circle-fill" viewBox="0 0 16 16">
                                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1h-7z"/>
                                    </svg>

                                  </button> 
                                </td>
                              </tr>

                            )                     
                          })
                        }

                      </tbody>
                    </table>
			            </div>
                  {/* <!--/ Table UI --> */}
                </div>
              </div>
            </div>
          </div>
        {/* <!-- / Vertical Scrollbar --> */}
        </div>
        <div className="smallbox-2">
          {/* <!-- Vertical Scrollbar --> */}
          <div className="test-ui-bg scroll-list">
            <div className="col-md-6 col-sm-12 div-table">                       
              <h4 className="text-primary">자품목 추가</h4>
              <div className="table-filter">  
                <div className="search-combo">
                  <div className="input-group input-group-merge search-combo-input">
                    <span className="input-group-text" id="basic-addon-search31">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                      </svg>
                    </span>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="item_name_input"  
                      placeholder="품목명 검색..." 
                      aria-label="Search..." 
                      aria-describedby="basic-addon-search31"
                      onChange={(e) => {setSearchItemName(e.target.value)}}
                      onKeyUp={onSearchItem}
                    />
                  </div>
                </div>
                {/* <!-- / Search UI --> */}
              </div>
              <hr/>
              <div className="card overflow-hidden mb-4 div-scroll-list-2">
                <div className="card-body overflow-auto">
                                   
                  {/* <!-- Table UI --> */}
                  <div className="table-responsive text-nowrap">
                  
                  
                    <table className="table table-bordered item-table table-2">
                      <thead>
                        <tr>
                          <th>순번</th>
                          <th>품목코드</th>
                          <th>품목명</th>
                          <th>규격</th>
                          <th></th>                                  
                        </tr>
                      </thead>
                      <tbody>
                        { itemList &&

                          itemList.map((data, i) => {
                            return (
                              <tr>
                                <td>{i+1}</td>
                                <td className="td-box">
                                  <a className="move" href={data.item_code}>{data.item_code}</a>
                                </td>
                                <td>{data.item_name}</td>
                                <td>{data.item_specification}</td>
                                <td className="td-btn">
                                  <button 
                                    type="button" 
                                    className="btn rounded-circle"
                                    onClick={() => addItem(data)}
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" fill="#03c3ec" className="bi bi-plus-circle-fill" viewBox="0 0 16 16">
                                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"/>
                                    </svg>
                                  </button> 
                                </td>
                              </tr>
                            );
                          })
                          

                        }
                      
                      </tbody>
                    </table>
                  </div>
                  {/* <!--/ Table UI --> */}
                </div>
              </div>
            </div>
          </div>
        {/* <!-- / Vertical Scrollbar --> */}
        </div>
                          	
                          
                          
      </div>

      
    </PageCard>
  )
}

export default RegisterPage;