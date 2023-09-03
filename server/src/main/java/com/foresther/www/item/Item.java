package com.foresther.www.item;

import lombok.Data;
import org.apache.ibatis.type.Alias;

import java.util.List;

@Data
@Alias("Item")
public class Item {
    private String item_code; // 품목코드
    private String item_name; // 품목명
    private String item_specification; // 규격 (1kg, 10kg, 1box...)
    private int safety_stock; // 안전재고량
    private int serial_lot_status; // 시리얼로트 여부
    private String procurement; // 조달 (조달정보 -> 구매 or 생산)
    private String item_classification; // 품목구분 (원재료, 제품, 생산)
    //private SupplierVO supplier; //구매처

    private List<ItemSupplierVO> itemsupplier_vo;
}
