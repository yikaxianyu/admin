<template>
  <div class="app-container">
    <el-input placeholder="请输入要搜索的活码标题" prefix-icon="el-icon-search" v-model="input2" class="in-serch"></el-input>
    <el-button type="primary" plain @click="search()">搜索活码</el-button>
    <el-table :data="tableData" height="600" border class="table-class">
      <el-table-column prop="id" label="活码id" width="80"></el-table-column>
      <el-table-column prop="add_time" label="添加时间" width="250"></el-table-column>
      <el-table-column prop="pic_url" label="活码图片">
        <template slot-scope="scope">
          <img :src="scope.row.pic_url" alt="" width="50">
        </template>
      </el-table-column>
      <el-table-column prop="title" label="活码标题" ></el-table-column>
      <el-table-column prop="user_id" label="用户ID" ></el-table-column>
      <el-table-column prop="short_url" label="短域名"  width="250"></el-table-column>
      <el-table-column prop="status" label="封禁状态" colum-key="status"
        :filters="[{ value:'正常',text:'正常账户'},{value:'封禁中', text:'封禁用户'}]"
        :filter-method="filterHandler"></el-table-column>
      <el-table-column prop="pic_url" label="操作" width="200">
        <template slot-scope="scope">
        <el-button type="primary"  @click="detail(scope.row.id, scope.row.status)"  size="mini" style="float:left;">活码详情</el-button>
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
   .in-serch{
     width: 50%;
   }
 </style>

<script>
import { getList } from "@/api/table";
import { getProhibition } from "@/api/prohibition";
import { codeSearch } from "@/api/codeSearch";
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
      getList({}).then(response => {
        if (response.status == 1) {
          for (let key of response.data) {

            key.add_time = new Date(key.add_time*1000).toLocaleString().toString();
       if( key.status == 1){
         key.status = '封禁中';
       }else if(key.status == 0){
         key.status = '正常';
       }
          }
          this.tableData = response.data;
        }
      });
    },
    detail(id,status){
       this.$router.push({
         path: './tree',
         query: {id:id,status:status}
       })
    },
     open(id,status) {
      this.codeID = id ;
      if(status == '封禁中'){
        this.statu = 1 ;
        this.$confirm('此操作将解封该活码, 是否继续?', '提示', {
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
        this.$confirm('此操作将封禁该活码, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
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
       filterHandler(value, row, column) {
        const property = column['property'];
        return row[property] === value;
      },
      search(){
        codeSearch({word:this.input2}).then(res=>{
          if(res.message == '查询成功'){
            this.Csearch(res);
            console.log(res);

          }else{
            alert('你搜索的活码不存在')
          }
        })
      },
      Csearch(res){
       this.$router.push({
         path: '../codeSearch',
         query: {res:res}
       })
    },
  },


};
</script>
