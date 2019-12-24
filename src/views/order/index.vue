<template>
  <div class="app-container">
    <el-input placeholder="请输入要搜索的订单号" prefix-icon="el-icon-search" v-model="input2" class="in-serch"></el-input>
    <el-button type="primary" plain @click="search()">搜索订单</el-button>
    <el-table :data="tableData" height="600" border class="table-class">
      <el-table-column prop="id" label="活码id" width="80"></el-table-column>
      <el-table-column prop="user_id" label="用户ID" ></el-table-column>
      <el-table-column prop="order_no" label="订单号" ></el-table-column>
      <el-table-column prop="total_price" label="	订单价格" ></el-table-column>
      <el-table-column prop="pay_price" label="	实际支付价格" ></el-table-column>
      <el-table-column prop="add_time" label="订单创建时间" width="250"></el-table-column>
      
      
      <el-table-column prop="pay_time" label="支付时间"></el-table-column>
      <el-table-column prop="is_pay" label="支付状态" colum-key="status"
        :filters="[{ value:'1',text:'已支付'},{value:'0', text:'未支付'}]"
        :filter-method="filterHandler"></el-table-column>
      <el-table-column prop="order_type" label="订单类型" colum-key="status"
        :filters="[{ value:'1',text:'月'},{value:'2', text:'季'},{value:'3', text:'年'},{value:'4', text:'未办理'}]"
        :filter-method="filterHandler"></el-table-column>
      <el-table-column prop="is_cash" label="是否兑现" colum-key="status"
        :filters="[{ value:'1',text:'已兑现'},{value:'0', text:'未兑现'}]"
        :filter-method="filterHandler"></el-table-column>

    </el-table>
  </div>
</template>
 
 <style lang="scss">
   .table-class {
     th {
       padding: 0 !important;
       height: 60px;
       line-height: 60px;
     }
     td {
       padding: 0 !important;
       height: 60px;
       line-height: 60px;
     }
   }
   .in-serch{
     width: 50%;
   }
 </style>

<script>
import { orderList } from "@/api/order";
import { orderSearch } from "@/api/orderSearch";
export default {
  inject: ["reload"],
  data() {
    return {
      tableData: [],
      list: null,
      listLoading: true,
      codeID: 0,
      statu: 0,
      input2: ''
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      orderList({}).then(response => {
        if (response.status == 1) {
          for (let key of response.data) {
            key.add_time = new Date(key.add_time*1000).toLocaleString().toString();
             key.pay_time = new Date(key.pay_time*1000).toLocaleString().toString();
            if(key.is_pay == 1){
              key.is_pay = '已支付';
            }else if(key.is_pay == 0){
              key.is_pay = '未支付';
            }

            if(key.order_type == 1){
              key.order_type = '月';
            }else if(key.order_type == 2){
              key.order_type = '季';
            }else if(key.order_type == 3){
              key.order_type = '年';
            }else{
              key.order_type = '为办理'

            }

            if(key.is_cash == 1){
              key.is_cash = '已兑现';
            }else if(key.is_cash == 0){
              key.is_cash = '未兑现';
            }

          }
          this.tableData = response.data;
          console.log(response.data)
        }
      });
    },
       filterHandler(value, row, column) {
        const property = column['property'];
        return row[property] === value;
      },
      search(){
        orderSearch({word:this.input2}).then(res=>{
          if(res.message == '查询成功'){
            this.Csearch(res);
            console.log(res);
          }else{
            alert('你搜索的订单不存在')
          }
        })
      },
      Csearch(res){
       this.$router.push({
         path: '../orderSearch',
         query: {res:res}
       })
    },
  },


};
</script>
