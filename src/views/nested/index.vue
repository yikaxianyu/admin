<template>
 <div class="app-container">
   <el-input placeholder="请输入要搜索的用户名" prefix-icon="el-icon-search" v-model="input2" class="in-serch"></el-input>
  <el-button type="primary" plain @click="search()">搜索用户</el-button>
    <el-table :data="tableData" height="600" border style="width: 100%" class="table-class">
      <el-table-column prop="id" label="用户id" width="80"></el-table-column>
      <el-table-column prop="tel" label="手机号" width="100"></el-table-column>
      <el-table-column prop="nickname" label="用户姓名" width="100"></el-table-column>
      <el-table-column prop="invitation_num" label="分享数" ></el-table-column>
      <el-table-column prop="nickname" label="用户ID" ></el-table-column>
      <el-table-column prop="pic_url" label="头像" width="100">
        <template slot-scope="scope" >
          <img :src="scope.row.pic_url" alt="" width="60" height="60">
        </template>
      </el-table-column>
       <el-table-column prop="level" label="会员等级" ></el-table-column>
      <el-table-column prop="reg_time" label="添加时间"></el-table-column>
      <el-table-column prop="status" label="用户封禁状态" width="80"></el-table-column>
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
   .in-serch{
     width: 50%;
   }
 </style>

<script>
import { userList } from "@/api/userlist";
import { userProhibition } from "@/api/userprohibition";
import { userSearch } from "@/api/search";

export default {
    inject: ["reload"],
  data() {
    return {
      tableData: [],
      list: null,
      listLoading: true,
      user_id : 0,
      statu: 0,
      input2: '',
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      userList({}).then(response => {
        console.log(response)
        if (response.status == 1) {
          for (let key of response.data) {

            key.reg_time = new Date(key.reg_time*1000).toLocaleString().toString();
            if(key.status == 1){
              key.status = '封禁中';
            }else if(key.status == 0){
              key.status = '正常';
            }
          }
          this.tableData = response.data;
        }
      });
    },

    
     open(id,status) {
      this.user_id = id ;
      if(status == '封禁中'){
        this.statu = 1 ;
        this.$confirm('此操作将解封该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var code_id = this.user_id;
          userProhibition({user_id:code_id,status:this.statu}).then(res =>{
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
        this.$confirm('此操作将封禁该用户, 是否继续111?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var code_id = this.user_id;
          userProhibition({user_id:code_id,status:this.statu}).then(res =>{
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
          

      search(){
        userSearch({word:this.input2}).then(res=>{
          if(res.message == '查询成功'){
            this.detail(res);
            console.log(res);

          }else{
            alert('你搜索的用户不存在')
          }
        })
      },
      detail(res){
       this.$router.push({
         path: './userSearch',
         query: {res:res}
       })
    },
       
  }

};
</script>