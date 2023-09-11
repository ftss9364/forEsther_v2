package com.foresther.www.bom;

import com.foresther.www.item.ItemVO;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@Log4j2
@RequestMapping("/boms")
@AllArgsConstructor
public class BomController {
    private BomService service;

    @GetMapping("/data")
    public List<BomVO> bomList() {
        return service.getListOrigin();
    }



    @GetMapping("/data/{bom_code}")
    public List<BomRegistrationVO> getChildItem(@PathVariable String bom_code){
        return service.getBomRegistration(bom_code);
    }

    @DeleteMapping("/{bom_code}")
    public void bomRemove(@PathVariable String bom_code) {
        service.removeBom(bom_code);

    }

    @GetMapping("/product/item/data")
    public List<ItemVO> ProductItemList() {

        return service.searchProduct("%%");
    }

    @GetMapping("/product/item/data/{item_name}")
    public List<ItemVO> searchProductItemList(@PathVariable String item_name) {
        item_name = "%" + item_name + "%";
        return service.searchProduct(item_name);
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> bomAdd(@RequestBody Map<String, Object> requestData) {
        String productName = (String)requestData.get("productName");
        String itemCode = (String)requestData.get("itemCode");
        String newBomCode = "B-"+itemCode;

        List<BomVO> bomList = service.getBomList();
        boolean bomCheck = true;
        int bomVersion = 0;
        for(int i = 0; i < bomList.size(); i++) {
            String bomItemCode = bomList.get(i).getBom_code().substring(2,7);
            if(itemCode.equals(bomItemCode)) {
                bomCheck = false;
                if(bomVersion == 0) {
                    bomVersion = Integer.parseInt(bomList.get(i).getBom_code().substring(8,10)) + 1;
                } else {
                    if(bomVersion > Integer.parseInt(bomList.get(i).getBom_code().substring(8,10))) {
                    } else {
                        bomVersion = Integer.parseInt(bomList.get(i).getBom_code().substring(8,10)) + 1;
                    }
                }
            }
        }

        BomVO bomVo = new BomVO();
        bomVo.setProduct_name(productName);

        if(bomVersion == 0) {
            newBomCode = newBomCode+"-01";
        } else {
            if(bomVersion>9) {
                newBomCode = newBomCode+"-"+bomVersion;
            }else {
                newBomCode = newBomCode+"-0"+bomVersion;
            }
        }
        bomVo.setBom_code(newBomCode);
        service.registerBom(bomVo);

        log.info(bomVo);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("newBomCode", newBomCode);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/register/data/{bom_code}")
    public ResponseEntity<Map<String, Object>> bomDetails(@PathVariable String bom_code) {
        List<ItemVO> itemList = service.getItemList();

        Map<String, Object> data = new HashMap<>();

        if(service.getBomRegistration(bom_code).size() > 0) {
            List<BomRegistrationVO> bomItemList = service.getDetail(bom_code).getBom_register_vo();

            service.getItemList().forEach(item -> {
                bomItemList.forEach(bomItem ->{

                    if(bomItem.getItem_code().equals(item.getItem_code())) {
                        itemList.remove(item);
                    }

                });
            });
            data.put("bom", service.getDetail(bom_code));
        } else {
            data.put("bom", service.getBom(bom_code));
        }

        data.put("item_list", itemList);

        return ResponseEntity.ok(data);

    }

    @PostMapping("/register/search")
    public ResponseEntity<Map<String, Object>> itemSearch(@RequestBody Map<String, Object> requestData) {
        String itemName = (String)requestData.get("itemName");
        List<String> ItemCodeArr = (List<String>)requestData.get("ItemCodeArr");
        itemName = "%"+itemName+"%";


        List<ItemVO> itemList = service.searchItem(itemName);

        service.searchItem(itemName).forEach(item -> {
            ItemCodeArr.forEach(bomItem ->{

                if(bomItem.equals(item.getItem_code())) {
                    itemList.remove(item);
                }

            });
        });

        Map<String, Object> response = new HashMap<>();
        response.put("items", itemList);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/modify")
    public void registerBom(@RequestBody List<Map<String, String>> rowDataList) {
        System.out.println(rowDataList);
        List<BomRegistrationVO> originList = service.getBomRegistration(rowDataList.get(0).get("bomCode"));
        if(rowDataList.get(0).get("itemCode").equals("null")) {

            service.removeBom(rowDataList.get(0).get("bomCode"));

        } else {
            originList.forEach(origin -> {
                boolean oldCheck = true;
                for(int i=0; i < rowDataList.size(); i++) {
                    if(rowDataList.get(i).get("itemCode").equals(origin.getItem_code())) {
                        oldCheck = false;
                    }
                }
                if(oldCheck) {
                    //삭제
                    service.removeBomRegistration(origin.getBom_registration_code());
                }
            });

            rowDataList.forEach(rowData -> {
                String itemCode = rowData.get("itemCode");
                String itemName = rowData.get("itemName");
                int itemRequiredQuantity = Integer.parseInt(rowData.get("itemRequiredQuantity"));
                boolean newCheck = true;
                for(int i = 0; i < originList.size(); i++) {

                    if(originList.get(i).getItem_code().equals(itemCode)) {
                        newCheck = false;
                        if(originList.get(i).getRequired_quantity() != itemRequiredQuantity) {
                            //log.info(itemRequiredQuantity);
                            service.modifyBomRegistration(itemRequiredQuantity, originList.get(i).getBom_registration_code());
                        }
                    }
                }
                if(newCheck) {
                    //추가
                    String newRegCode = service.getBomregCount();
                    int temp = Integer.parseInt(newRegCode.substring(3));
                    temp++;
                    if(temp>99) {
                        newRegCode = "BR-" + temp;
                    } else {
                        newRegCode = "BR-0" + temp;
                    }

                    BomRegistrationVO bom_reg_vo = new BomRegistrationVO();
                    bom_reg_vo.setBom_code(rowDataList.get(0).get("bomCode"));
                    bom_reg_vo.setBom_registration_code(newRegCode);
                    bom_reg_vo.setItem_code(itemCode);
                    bom_reg_vo.setRequired_quantity(itemRequiredQuantity);

                    service.registerBomRegistration(bom_reg_vo);

                }

            });

        }

    }

    @GetMapping("/search/{product_name}")
    public List<BomVO> searchBom(@PathVariable String product_name) {
        product_name = "%" + product_name + "%";
        return service.get(product_name);
    }
}
