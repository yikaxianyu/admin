<template>
  <div style="padding:0 5% 0">
    <div style="width:30%; float:left;">
     <h4>活码id</h4>
    <el-input placeholder="请返回活码列表页选择要查询的活码" v-model="id" width="200px"></el-input>
    </div>
   <div style="width:30%; float:left;">
    <h4>用户id</h4>
    <el-input placeholder="请返回活码列表页选择要查询的活码" v-model="user_id"></el-input>
   </div>
    
    <div style="width:30%; float:left;">
<h4>标题</h4>
    <el-input placeholder="请返回活码列表页选择要查询的活码" v-model="title"></el-input>
    </div>
    
    <div style="width:30%; float:left;">
<h4>限制次数</h4>
    <el-input placeholder="请返回活码列表页选择要查询的活码" v-model="unlimited" ></el-input>
    </div>
    
    <div style="width:30%; float:left;">
 <h4>活码的类型</h4>
    <el-input placeholder="请返回活码列表页选择要查询的活码" v-model="type"></el-input>
    </div>
   
    
    <div style="width:30%; float:left;">
  <h4>切换类型</h4>
    <el-input placeholder="请返回活码列表页选择要查询的活码" v-model="switch_type"></el-input>
    </div>
   
    <div style="width:30%; float:left;">
<h4>扫描次数</h4>
    <el-input placeholder="请返回活码列表页选择要查询的活码" v-model="num"></el-input>
    </div>
    
    <div style="width:30%; float:left;">
<h4>添加时间</h4>
    <el-input placeholder="请返回活码列表页选择要查询的活码" v-model="add_time"></el-input>
    </div>
    
    <div style="width:30%; float:left;">
 <h4>短域名</h4>
    <el-input placeholder="请返回活码列表页选择要查询的活码" v-model="short_url"></el-input>
    </div>

    <div style="width:50%; float:left;">
<h4>活码图片</h4>
    <el-input placeholder="请返回活码列表页选择要查询的活码" v-model="pic_url" ></el-input>
    <div class="demo-image__preview">
  <el-image 
    style="width: 100px; height: 100px"
    :src="pic_url" 
    :preview-src-list="pic_url">
  </el-image>
</div>
    </div>
    
    <div style="width:50%; float:left;">
 <h4>备用图片</h4>
    <el-input placeholder="请返回活码列表页选择要查询的活码" v-model="alternative_pic"></el-input>
    <img :src="alternative_pic" alt="" srcset="" width="100px">
    </div>
    
    <div style="width:50%; float:left;">
 <h4>logo图片</h4>
    <el-input placeholder="请返回活码列表页选择要查询的活码" v-model="logo_pic"></el-input>
     <img :src="logo_pic" alt="" srcset="" width="100px">
    </div>

    <div style="width:100%;float:left;">
      <h4 style="text-align:center;">用户上传的二维码</h4>
    <el-table :data="tableData" height="600" border class="table-class">
      <el-table-column prop="id" label="二维码id" width="80"></el-table-column>
      <el-table-column prop="scans_num" label="已扫描次数"></el-table-column>
      <el-table-column prop="pic_url" label="二维码图片">
        <template slot-scope="scope">
          <img :src="scope.row.pic_url" alt="" width="50">
        </template>
      </el-table-column>
      <el-table-column prop="add_time" label="图片创建时间" ></el-table-column>
    </el-table>
    </div>

  <el-button :type="status=='封禁中'?'success':'danger'"  @click="open()"  size="mini">{{status=='封禁中'?'解封活码':'封禁活码'}}</el-button>
  </div>
  
</template>

<script>
import { getDetail } from "@/api/tree";
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
      id: "",
      user_id: "",
      title: "",
      unlimited: "",
      pic_url: "",
      alternative_pic: "",
      logo_pic: "",
      type: "",
      switch_type: "",
      num: "",
      add_time: "",
      short_url: "",
      status: "",
      statu: 0,
      tableData: [],
    };
  },
  created() {
    this.fetchDetail();
  },

  methods: {
    fetchDetail() {
      this.listLoading = true;
      let codeID = this.$route.query;
      this.id = codeID.id;
      this.status = codeID.status;
      getDetail({code_id:this.id}).then(response => {
        if (response.status == 1) {
          this.user_id = response.data.user_id
          this.title = response.data.title
          this.unlimited = response.data.unlimited
          this.pic_url = response.data.pic_url

          if(response.data.alternative_pic == 0){
            this.alternative_pic='无';
          }else{
            this.alternative_pic = response.data.alternative_pic;
          }

          if(response.data.logo_pic == 0){
            this.logo_pic='无';
          }else{
            this.logo_pic = response.data.logo_pic;
          };

          if(response.data.type == 1){
            this.type='微信';
          }else{
            this.type = 'QQ';
          };
          
          if(response.data.switch_type == 1){
            this.switch_type='顺序';
          }else{
            this.switch_type = '随机';
          };

          this.num = response.data.num
          this.add_time = new Date(response.data.add_time*1000).toLocaleString().toString();
          this.short_url = response.data.short_url
           
          for(let key of response.data.code_pic) {
            key.add_time = new Date(key.add_time*1000).toLocaleString().toString();
            if( key.status == 1){
              key.status = '封禁中';
            }else if(key.status == 0){
              key.status = '正常';
            }
          }
          this.tableData = response.data.code_pic;
        }
      })
    },
     open() {
      if(this.status == '封禁中'){
        this.statu = 1 ;
        this.$confirm('此操作将解封该活码, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          getProhibition({code_id:this.id,status:this.statu}).then(res =>{
          if(res.status == 1){
              this.$message({
                type: 'success',
                message: '解封成功!'
              });
              this.status = '正常';
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
          var code_id = this.user_id;
          getProhibition({code_id:this.code_id,status:this.statu}).then(res =>{
          if(res.status == 1){
              this.$message({
                type: 'success',
                message: '封禁成功!'
              });
              this.status = '封禁中';
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

