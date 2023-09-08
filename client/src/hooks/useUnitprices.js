import { useEffect, useState } from "react";
import axios from "../utils/axios";

const useUnitprices = ({changeModal, setDetail, setChartData}) => {
  const [list, setList] = useState([]);
  
  const onSLClick = (e) => {
    e.preventDefault();
    axios.get(e.target.getAttribute("href"))
      .then((res) => {
        axios.get(e.target.getAttribute("href") + "/thumbnail")
          .then((file) => {
            setDetail(res.data, file);
          })
        });
        changeModal("detail");
      }
  
      const onIClick = async (e) => {
        e.preventDefault();
        try {
          const response = await fetch(e.target.getAttribute("href")+"/chart");
          if (!response.ok) {
            throw new Error('데이터를 불러오는 데 실패했습니다.');
          }
          const data = await response.json();
  
          // 데이터 처리
          const labels = [];
          const datas = [];
          let min, max = data.result[0].MON_AVG;
  
          data.result.forEach((element) => {
            labels.push(element.MONTH + '월');
            datas.push(element.MON_AVG);
          });
  
          const op = {
            min: min,
            max: max,
            iname: "고춧가루",
          };

          setChartData({
            labels: labels,
            datasets: [
              {
                label: op.iname,
                data: datas,
                borderColor: '#1565C0',
                backgroundColor: '#1A7FF2',
              },
            ],
          });
          changeModal("chart");
        } catch (error) {
          console.error(error);
        }
      }

  const head = [
    {
      key: "no",
      title: "#",
      data: {
        class: ["a", "ab", "ccc"],
      },
    },
    {
      key: "serial_lot_code", //필수
      title: "Serial/Lot No", //필수
      isModal: true,
      data: {
        link: {
          origin: "unitprices",
          id: "unit_price_code"
        },
        onClick: onSLClick,
      },
    },
    {
      key: "item_code",
      title: "품목코드",
      isModal: true,
      data: {
        link: {
          origin: "unitprices",
          id: "item_code",
        },
        onClick: onIClick
      }
    },
    {
      key: "item_name",
      title: "품목명",
      data: {
        class: ["b", "bc"],
        onClick: {},
      },
    },
    {
      key: "standard_cost",
      title: "표준원가",
      isCurrency: true,
    },
    {
      key: "purchase_price",
      title: "구매단가",
      isCurrency: true,
    },
    {
      key: "selling_price",
      title: "판매단가",
      isCurrency: true,
    },
    {
      key: "btn",
      title: " ",
      data: {
        btnVal : "unit_price_code"
      }
    }
  ];

  const searchLabel = [
    {
      "name" : "품목명",
      "value" : "N"
    },
    {
      "name" : "품목코드",
      "value" : "C"
    },
    {
      "name" : "S/L",
      "value" : "S"
    }
  ];


  
  const btn = [
    {
      text: "수정", 
      onClick: (e) => {
        console.log(e.target.value);
      }
    },
    {
      text: "삭제", 
      onClick: (e) => {
        console.log(e.target.value);
      }
    },
  ];

  useEffect(() => {
    getUnitprices();
  }, []);

  const deleteUnitprice = (id) => {
    axios.delete(`unitprices/${id}`).then((res) => {
      getUnitprices();
    });
  };

  const updateUnitprice = (id) => {
    axios.put(`unitprices/${id}`).then((res) => {
      getUnitprices();
    });
  };

  const getUnitprice = (id) => {
    axios.get(`unitprices/${id}`).then((res) => {
      console.log(res);
    });
  };

  const getUnitprices = () => {
    axios.get("unitprices").then((res) => {
      addData(res.data);
    });
  };

  const addData = (prevList) => {
    const newList = [];

    prevList.map((data) => {
      const serialLotVO = data['serialLot'];
      const tempData = {...data, 
        'item_code': serialLotVO['item_code'], 
        "btn" : btn
      }
      newList.push(tempData);
    })

    setList([...newList])
  };
  
  


  return {
    head,
    list,
    searchLabel,
    //selectedVal,
    deleteUnitprice,
    updateUnitprice,
    onIClick
  };
};

export default useUnitprices;
