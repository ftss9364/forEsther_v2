import { useState, useEffect } from "react";
import axios from "axios";
import PageCard from "../../components/page/PageCard";
import PageHeader from "../../components/page/PageHeader";
import PageTitle from "../../components/page/PageTitle";
import Table from "../../components/table/Table";
import Pagination from "../../components/pagination/Pagination";
import Button from "../../components/button/Button";
import ModalMain from "../../components/modal/ModalMain";
import ModalHeader from "../../components/modal/ModalHeader";
import ModalBody from "../../components/modal/ModalBody";
import ModalFooter from "../../components/modal/ModalFooter";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import SearchInput from "../../components/search/SearchInput";
import Dropdown from "../../components/form/Dropdown";
import Input from "../../components/form/Input";
const ListPage = () => {
  const [data, setData] = useState([]);
  const [tableBody, setTableBody] = useState([]);
  const history = useHistory();
  const [productList, setProductList] = useState([]);
  const styleSheet = {
    marginBottom: "10px",
  }

  console.log(localStorage.token);

  

  //현재페이지를 url에 저장하기 위해
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const pageParam = params.get('page');

  //현재 페이지 
  const [currentPage, setCurrentPage] = useState(1);
  //총 포스트 수
  const [numberOfData, setNumberOfData] = useState(0);
  //총 페이지 수
  const [numberOfPages, setNumberOfPages] = useState(0);
  //한 페이지에 몇개씩 글이 보일 것인지
  const limit = 5;
  //현재 페이지의 인덱스 시작 숫자
  const [startIndex, setStartIndex] = useState(1);

  const [searchItemText, setSearchItemText] = useState('');

  const [productName, setProductName] = useState('');
  const [inputVal, setInputVal] = useState('');
  const [parentItemCode, setParentItemCode] = useState('');


  useEffect(() => {
    //무조건 반올림 => 5개씩 출력 될때 14개면 3페이지가 출력 되어야 함
    setNumberOfPages(Math.ceil(numberOfData/limit));
  }, [numberOfData]);
  //글갯수에 따라 페이지 수가 변경되기 때문에 의존성 배열에 포스트 수를 넣음

  //뒤로가기 했을 때 이전 페이지로 돌아가는게 아닌 다른페이지로 이동하는 문제 해결을 위해
  const onClickPageButton = (page) => {
    // history.push(`/admin?page=${page}`);
    //Blogs에서 다른 페이지 이동할 때 Admin의 페이지로 이동하는거 해결하기
    history.push(`${location.pathname}?page=${page}`);
    getData(page);

    //페이지 버튼 눌러도 색이 안바뀌어서 넣어 줌
    setCurrentPage(page);
  }


  //키가 눌릴때 마다 최초로 post들을 불러옴
  const onSearchItem = (e) => {
    //Enter가 눌렸을 때 함수가 호출
    if(e.key == 'Enter'){
      getSearchProductItemList();
    }
  }
  
  const getSearchProductItemList = () => {
    if(!searchItemText) {
      console.log(searchItemText);

    }
    axios.get(`boms/product/item/data/${searchItemText}`, {
    
    }).then((res) => {
      setProductList(res.data);
      setParentItemCode(res.data[0].item_code);


    });
    
  }; 


  const getData = (page = 1) => {
    
    axios.get(`boms/data`, {
    
    }).then((res) => {
        //총 글 갯수
        // setNumberOfData(res.headers['x-total-count']);
        setNumberOfData(res.data.length);
        //서버로 부터 넘어온 값은 파라미터로 가져옴 res
        const offset = (page-1)*limit;
        setStartIndex(offset+1);
        const sliceData = () => {
          if(res.data){
            let result = res.data.slice(offset, offset + limit);
            return result;
          }
        }
        
        setData(sliceData());

        
    });
    
  };

  useEffect(() => {
      //넘어온 페이지 값으로 currentPage 값 적용
      setCurrentPage(parseInt(pageParam) || 1);

      //함수 호출해서 불러오기
      //리렌더링을 통해 현재 페이지 출력
      //pageParam은 string이기 때문에 int로 캐스팅을 해줘야 함
      //페이지 번호가 없다면 default로 1
      getData(parseInt(pageParam) || 1);

      
      getSearchProductItemList();


  //}, [pageParam, getPosts]);
  }, []);

  const btn = [
    {
      text: "수정", 
      onClick: (e) => {
        history.push(`boms/${e.target.value}`)
      }
    },
    {
      text: "삭제", 
      onClick: (e) => {
        axios.delete(`boms/${e.target.value}`).then(() => {
          setData(prevData => prevData.filter(data => data.bom_code !== e.target.value));
          
          // addToast({
          //     text: "Successfully delete",
          //     type: "success"
          // });
      });
      }
    },
  ];

  const onLabelClick = (e) => {
    console.log(e);
  }

  //테이블 데이터 가공
  useEffect(()=> {
    const arr = [];
    let itemList = [];
    for(let i=0; i<data.length; i++) {
      const {bom_code, product_name, bom_register_vo } = data[i];

      for(let j = 0; j < bom_register_vo.length; j++) {
        if(bom_register_vo[j].item_vo !== null){
          itemList.push({name: bom_register_vo[j].item_vo.item_name});
        }
      }
      const item_code = bom_code.substr(2, 5);
      const no = startIndex + i;
      const newData = {bom_code, product_name, item_code, item_name: itemList, btn, no};
      arr.push(newData);
      itemList = [];

    };
    setTableBody([...arr]);
  }, [data])


  const onChangeProduct = (e) => {
    setParentItemCode(e.target.value);
  }

  const insertBom = () => {
    if(productName.length === 0) {
      alert("제품명을 입력해 주세요.");
    } else {
      let requestData = {
        itemCode: parentItemCode,
        productName: productName
      }
      axios.post(`boms/register`, requestData).then((res) => {
        const backdropElement = document.querySelector(".modal-backdrop");
        if (backdropElement) {
          // .modal-backdrop 요소가 존재하는 경우에만 삭제
          document.body.removeChild(backdropElement);
        }
        history.push(`boms/${res.data.newBomCode}`);
      });
    }
  }

  const tableHead = [
    { 
      key: 'no',
      title: '#'
    },
    { 
      key: 'bom_code',
      title: 'BOM코드',
      data: {
        link: {
          origin: "/boms",
          id: "bom_code"
        }
      },
      isToggle: true
    },
    { 
      key: 'item_code',
      title: '모품목코드'
    },
    { 
      key: 'product_name',
      title: '모품목명'
    },
    {
      key: 'item_name',
      title: '구성품목',
      isArray: true,
      data: {
        key: "name"
      }
    },
    {
      key: 'btn',
      title: '',
      data: {
        btnVal: 'bom_code'
      }
    }
  ]

  


  const cthead = [
    {
      key: "no",
      title: "#",
      data: {
        class: [""],
      },
    },
    {
      key: "child_item_code", //필수
      title: "자품목 코드", //필수
    },
    {
      key: "child_item_name",
      title: "자품목명",
    },
    {
      key: "required_quantity",
      title: "필요수량",
    }]

    const searchLabel = [
      {
        "name" : "품목명",
        "value" : "N"
      },
      {
        "name" : "품목코드",
        "value" : "C"
      },
    ];

  return (
    <PageCard>
      <PageHeader>
        <PageTitle value="BOM관리"/>
        {localStorage.token ? 
        <h1>로그인 됨</h1> :
        <h1>로그인 안됨</h1>  
      }
        <Button buttonClass={"btn-dark"} dataBsToggle={"modal"} dataBsTarget={"#basicModal"} buttonName="신규등록" />
      </PageHeader>
      <div style={{
        display: "flex",
        justifyContent: "flex-end"
      }}>
        <div style={{
          marginRight: "5px",
          width: "130px"
        }}>
          <Dropdown
            initValue={"품목명"}
            list={searchLabel}
            onCLick={onLabelClick}
            
          />
        </div>
        <div>
          <div 
            style={styleSheet}
            className="input-group input-group-merge"
          >
            <input
              name="keyword"
              type="text"
              className="form-control"
              placeholder="검색..."
              aria-label="검색..."
              aria-describedby="basic-addon-search31"
              onChange={(e) => {setInputVal(e.target.value)}}
              value={inputVal}
              // disabled={disabled}
            />
            <button 
              type="submit" 
              className="btn btn-secondary search-btn"
              onClick={(e) => {
                e.preventDefault();
                // onSubmit(inputVal);
              }}
              // style={{ cursor: `${disabled ? 'not-allowed' : 'pointer'}` }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-search"
                viewBox="0 0 16 16"
              >
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <ModalMain
        modalClass={"modal-lg"}
      >
        <ModalHeader>
        <h5 className="modal-title" id="exampleModalLabel1">BOM 신규 작성</h5>
        </ModalHeader>
        <ModalBody>
          <div className="row g-2">
            <div className="col mb-0">
              <div className="input-group input-group-merge">
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
                  value={searchItemText}
                  onChange={(e) => {setSearchItemText(e.target.value)}}
                  onKeyUp={onSearchItem}
                />
              </div>
              <br/>
              <label htmlFor="item_name" className="form-label">모품목 선택</label>
              <select 
                className="form-select" 
                id="item_name" 
                aria-label="모품목을 선택해 주세요"
                onChange={onChangeProduct}
              >
                {
                  productList.map((data, i) => {
                    if(i === 0) {
                      return (<option key={i} value={data.item_code} selected>{data.item_name}</option>	)
                    } else {
                      return (<option key={i} value={data.item_code}>{data.item_name}</option>);
                    }
                  })
                }
              </select>
            </div>
          </div>
          <br/>
          <div className="row g-2">
            <div className="col mb-0">
              <label htmlFor="product_name" className="form-label">제품명</label>
              <input 
                  type="text" 
                  className="form-control" 
                  id="product_name"  
                  placeholder="BOM 등록할 제품명을 등록하세요."
                  value={productName}
                  onChange={(e) => {setProductName(e.target.value)}}
                  onKeyUp={onSearchItem}
                />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button buttonClass={"btn btn-outline-primary"} dataBsDismiss={"modal"} buttonName={"취소"} />
          <Button 
            ButtonId={"btnRegister"} 
            buttonName={"BOM 등록"} 
            onClick={insertBom}
          />
        </ModalFooter>
      </ModalMain>
      <div style={{marginBottom: "10px"}}>
        <span style={{ fontWeight: 'bold'}}>총 {numberOfData}건</span>
      </div>
      <Table 
        thead={tableHead} 
        tbody={tableBody}
        isChild={true}
        cthead={cthead}  
      />
      {/* 페이지가 1개밖에 없을 때 페이지 버튼 안보이기 */}
      {numberOfPages > 1 && <Pagination 
                    currentPage={currentPage} 
                    numberOfPages={numberOfPages} 
                    //onClick={getPosts}    
                    onClick={onClickPageButton}    
                /> 
            }
    </PageCard>
  )
}

export default ListPage;