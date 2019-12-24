<template>
  <div class="app-container">
    <el-table :data="tableData" height="600" border class="table-class">
      <el-table-column prop="id" label="活码id" width="80"></el-table-column>
      <el-table-column prop="add_time" label="添加时间"></el-table-column>
      <el-table-column prop="pic_url" label="活码图片">
        <template slot-scope="scope">
          <img :src="scope.row.pic_url" alt="" width="50">
        </template>
      </el-table-column>
      <el-table-column prop="short_url" label="短域名" ></el-table-column>
      <el-table-column prop="user_id" label="用户ID" ></el-table-column>
      <el-table-column prop="title" label="标题" ></el-table-column>
      <el-table-column prop="status" label="封禁状态" colum-key="status"
        :filters="[{ value:'正常',text:'正常账户'},{value:'封禁中', text:'封禁用户'}]"
        :filter-method="filterHandler"></el-table-column>
      <el-table-column prop="pic_url" label="操作">
        <template slot-scope="scope">
         <el-button :type="scope.row.status=='封禁中'?'success':'danger'"  @click="open(scope.row.id, scope.row.status)"  size="mini">{{scope.row.status=='封禁中'?'解封用户':'封禁用户'}}</el-button>
         </template>
      </el-table-column>
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
 </style>

<script>

import { getProhibition } from "@/api/prohibition";
export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "gray",
        deleted: "danger",
      };
      return statusMap[status];
    }
  },
    inject: ["reload"],
  data() {
    return {
      tableData: [],
      list: null,
      listLoading: true,
      user_id : 0,
      statu: 0,
    };
  },
  created() {
      
    this.fetchDetail();
  },

  methods: {
    fetchDetail() {
      this.listLoading = true;
     let resData = this.$route.query;
     for (let key of resData.res.data) {
            key.add_time = new Date(key.add_time*1000).toLocaleString().toString();
       if( key.status == 1){
         key.status = '封禁中';
       }else if(key.status == 0){
         key.status = '正常';
       }
          }
      this.tableData = resData.res.data;
    },
       filterHandler(value, row, column) {
        const property = column['property'];
        return row[property] === value;
      },
     open(id,status) {
      this.user_id = id ;
      console.log(status)
      if(status == '封禁中'){
        this.statu = 1 ;
        this.$confirm('此操作将解封该活码, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var code_id = this.user_id;
          console.log(code_id)
          getProhibition({code_id:code_id,status:this.statu}).then(res =>{
          if(res.status == 1){
              this.$message({
                type: 'success',
                message: '解封成功!'
              });
          }this.reload();
          });
          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消解封'
          });          
        });
      }else {
        this.statu = 0;
        this.$confirm('此操作将封禁该活码, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var code_id = this.user_id;
          console.log(this.statu)
          getProhibition({code_id:code_id,status:this.statu}).then(res =>{
          if(res.status == 1){
              this.$message({
                type: 'success',
                message: '封禁成功!'
              });
              
          }this.reload();
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消封禁'
          });          
        });
      }    
      },
  }
};
</script>

