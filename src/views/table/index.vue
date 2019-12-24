<template>
  <div class="app-container">
    <el-table :data="tableData" height="600" border >
      <el-table-column prop="id" label="活码id" ></el-table-column>
      <el-table-column prop="add_time" label="添加时间" ></el-table-column>
      <el-table-column prop="pic_url" label="活码图片" height="100">
        <template slot-scope="scope">
          <img :src="scope.row.pic_url" alt="">
        </template>
      </el-table-column>
      <el-table-column prop="title" label="活码标题" ></el-table-column>
      <el-table-column prop="user_id" label="用户ID" ></el-table-column>
      <el-table-column prop="short_url" label="短域名" ></el-table-column>
      <el-table-column prop="status" label="封禁状态"></el-table-column>
      <el-table-column prop="pic_url" label="操作">
        <template slot-scope="scope">
        <el-button type="primary" round @click="detail(scope.row.id)" >活码详情</el-button>
        <el-button type="danger" round @click="open(scope.row.id)">活码封禁</el-button>
         </template>
      </el-table-column>
    </el-table>
  </div>
</template>
 
<script>
import { getList } from "@/api/table";
import { getProhibition } from "@/api/prohibition";
export default {
  data() {
    return {
      tableData: [],
      list: null,
      listLoading: true,
      codeID: 0
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      getList({}).then(response => {
        if (response.status == 1) {
          for (let key of response.data) {

            key.add_time = new Date(key.add_time*1000).toLocaleString().toString();
       if( key.status == 1){
         key.status = '正常';
       }else {
         key.status = '封禁中';
       }
          }
         
         
          this.tableData = response.data;
        }
      });
    },
    detail(id){
       this.$router.push({
         path: './tree',
         query: {id:id}
       })
    },
    open(id) {
      this.codeID = id ;
        this.$confirm('此操作将封禁该活码, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var code_id = this.codeID;
          getProhibition({code_id:code_id}).then(res =>{
          if(res.status == 1){
              this.$message({
                type: 'success',
                message: '封禁成功!'
              });
          }
          });
          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消封禁'
          });          
        });
      },
  }

};
</script>
