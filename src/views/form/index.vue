<template>
  <div class="app-container">
    <el-table :data="tableData" max-height="600" border style="width: 100%" class="table-class">
      <el-table-column prop="id" label="投诉的id" width="180" height="100"></el-table-column>
      <el-table-column prop="code_id" label="活码的id" width="180" height="100"></el-table-column>
      <el-table-column prop="detail" label="投诉内容" height="100"></el-table-column>
      <el-table-column prop="add_time" label="添加时间" height="100"></el-table-column>
      <el-table-column prop="pic_url" label="操作" height="100">
        <template slot-scope="scope">
        <el-button type="primary"  @click="detail(scope.row.code_id)" size="mini">活码详情</el-button>
         <el-button :type="scope.row.status=='封禁中'?'success':'danger'"  @click="open(scope.row.id, scope.row.status)"  size="mini">{{scope.row.status=='封禁中'?'解封活码':'封禁活码'}}</el-button>
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
import { complaintList } from "@/api/complaint";
import { getProhibition } from "@/api/prohibition";

export default {
  inject: ["reload"],
  data() {
    return {
      tableData: [],
      list: null,
      listLoading: true,
      codeID: 0,
      statu: 0,
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    detail(code_id){
       this.$router.push({
         path: '../tree',
         query: {id:code_id}
       })
    },
    fetchData() {
      this.listLoading = true;
      complaintList({}).then(response => {
        if (response.status == 1) {
          for (let key of response.data) {

            key.add_time = new Date(key.add_time*1000).toLocaleString().toString();
      
          }
          this.tableData = response.data;
        }
      });
    },
     open(id,status) {
      this.code_id = id ;
      if(status == '封禁中'){
        this.statu = 1 ;
        this.$confirm('此操作将解封该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          getProhibition({code_id:this.codeID,status:this.statu}).then(res =>{
          if(res.status == 1){
              this.$message({
                type: 'success',
                message: '解封成功!'
              });
              this.reload();

          }
          });
          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消解封'
          });          
        });
      }else {
        this.statu = 0;
        this.$confirm('此操作将封禁该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var code_id = this.user_id;
          getProhibition({code_id:this.codeID,status:this.statu}).then(res =>{
          if(res.status == 1){
              this.$message({
                type: 'success',
                message: '封禁成功!'
              });
              this.reload();
          }
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

<style scoped>
.line {
  text-align: center;
}
</style>

