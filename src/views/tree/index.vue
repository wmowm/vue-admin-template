<template>
  <div class="main" ref="main" :style="eBody_menu">
    <el-card class="box-card-menu" :style="eCard_menu">
      <div slot="header" class="clearfix">
        <span>菜单</span>
        <div style="float: right" @click="this.getHW">
          <i class="el-icon-refresh"></i>
        </div>
      </div>

      <el-tree
        node-key="id"
        :data="list_menu"
        :props="defaultProps"
        :highlight-current="true"
        :load="loadDataTree"
         default-expand-all 
        :render-content="renderContent"
        @node-click="nodeClick"
      >
      </el-tree>
    </el-card>

    <el-card class="box-card-body" :style="eCard_body">
      <div slot="header" class="clearfix">
        <span>按钮</span>
        <div style="float: right" @click="this.getHW"></div>
      </div>
      <menuButton :parent-id="this.defauctCheckId" :parent-name="this.defauctCheckName" ref="child"></menuButton>
    </el-card>

    <!-- 目录 -->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogDirFormVisible"
      :close-on-click-modal="false"
      width="30%"
    >
      <el-dialog
        width="50%"
        title="选择图标"
        :visible.sync="innerDirVisible"
        append-to-body
      >
        <div class="icons-container">
          <div
            v-for="item of elementIcons"
            :key="item"
            @click="handleClipboard(item, $event)"
          >
            <el-tooltip placement="top">
              <div slot="content">
                {{ generateElementIconCode(item) }}
              </div>
              <div class="icon-item">
                <i :class="'el-icon-' + item" />
                <span>{{ item }}</span>
              </div>
            </el-tooltip>
          </div>
        </div>
      </el-dialog>
      <el-form
        ref="dataFormDir"
        :rules="rulesDir"
        :model="tempDir"
        label-position="left"
        label-width="80px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="目录ID">
          <el-input :disabled="true" v-model="tempDir.id" />
        </el-form-item>
        <el-form-item label="目录名称" prop="name">
          <el-input v-model="tempDir.name" />
        </el-form-item>
        <el-form-item label="目录图标" prop="icon">
          <el-input placeholder="请选择图标" v-model="tempDir.icon">
            <template slot="prepend">
              <i :class="tempDir.icon" />
            </template>
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="innerDirVisible = true"
            ></el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input
            type="number"
            placeholder="数字越小越靠前"
            v-model="tempDir.sort"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDirFormVisible = false"> 取消 </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'addDir' ? createDirData() : updateDirData()"
        >
          确定
        </el-button>
      </div>
    </el-dialog>
    <!-- 菜单 -->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      width="30%"
    >
      <el-dialog
        width="50%"
        title="选择图标"
        :visible.sync="innerVisible"
        append-to-body
      >
        <div class="icons-container">
          <div
            v-for="item of elementIcons"
            :key="item"
            @click="handleClipboard(item, $event)"
          >
            <el-tooltip placement="top">
              <div slot="content">
                {{ generateElementIconCode(item) }}
              </div>
              <div class="icon-item">
                <i :class="'el-icon-' + item" />
                <span>{{ item }}</span>
              </div>
            </el-tooltip>
          </div>
        </div>
      </el-dialog>
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="80px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="目录ID" prop="parentId">
          <el-input :disabled="true" v-model="temp.parentId" />
        </el-form-item>
        <el-form-item label="菜单ID" prop="id">
          <el-input :disabled="true" v-model="temp.id" />
        </el-form-item>
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="菜单图标" prop="icon">
          <el-input placeholder="请选择图标" v-model="temp.icon">
            <template slot="prepend">
              <i :class="temp.icon" />
            </template>
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="innerVisible = true"
            ></el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="路由地址" prop="url">
          <el-input placeholder="请输入路由地址" v-model="temp.url">
            <template slot="prepend">Http://</template>
          </el-input>
        </el-form-item>
          <el-form-item label="排序" prop="sort">
          <el-input
            type="number"
            placeholder="数字越小越靠前"
            v-model="temp.sort"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 取消 </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'addMenu' ? createData() : updateData()"
        >
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import menuButton from "../tree/button";
import {
  getMenuList,
  createDir,
  updateDir,
  deleteDir,
  getDir,
  createMenu,
  updateMenu,
  deleteMenu,
  getMenu,
} from "@/api/menu";
import elementIcons from "../icons/element-icons";
export default {
  data() {
    return {
      eBody_menu: {
        height: "",
        width: "",
      },
      eCard_menu: {
        width: "",
      },
      eCard_body: {
        width: "",
      },
      defauctCheckId:"",
      defauctCheckName:"",
      dialogButtonFormVisible:false,
      list_menu: [],
      defaultProps: {
        children: "children",
        label: "id",
      },
      elementIcons,
      tableKey: 0,
      query: {
        id: "",
      },
      tempDir: {
        id: "",
        name: "",
        icon: "",
        level: "",
        parentId: "",
        url: "",
        sort: "",
      },
      temp: {
        id: "",
        name: "",
        icon: "",
        level: "",
        parentId: "",
        url: "",
        sort: "",
      },
      textMap: {
        addDir: "添加目录",
        editDir: "编辑目录",
        deleteDir: "删除目录",
        addMenu: "添加菜单",
        editMenu: "编辑菜单",
        deleteMenu: "删除菜单",
      },
      dialogStatus: "",
      dialogTag: "", //目录 or 菜单
      dialogDirFormVisible: false, //外层dialog
      innerDirVisible: false, //内层dialog
      dialogFormVisible: false, //外层dialog
      innerVisible: false, //内层dialog
      rulesDir: {
        name: [
          { required: true, message: "目录名称不能为空", trigger: "blur" },
        ],
        icon: [
          { required: true, message: "目录图标不能为空", trigger: "blur" },
        ],
      },
      rules: {
         name: [{ required: true, message: "菜单名称不能为空", trigger: "blur" }],
         url: [{ required: true, message: "菜单路由不能为空", trigger: "blur" }],
         icon: [{ required: true, message: "菜单图标不能为空", trigger: "blur" }],
      },
      downloadLoading: false,
    };
  },
  components: {
    menuButton: menuButton,
  },
  methods: {
    getHW() {
      
      this.eBody_menu.height = window.innerHeight - 95 + "px";
      this.eBody_menu.width = window.innerWidtht - 210 + "px";

      const eWidth = document.body.clientWidth - 210;
      const eHeigh = document.body.clientHeight;
      console.log(eWidth, eHeigh);
      this.eCard_menu.width = eWidth * 0.2 + "px";
      this.eCard_body.width = eWidth * 0.8 - 20 + "px";
      this.loadDataTree();
    },
    loadDataTree(){
      this.getMenuList()
    },
    nodeClick(data,node){
      if(data.level == 2){
        this.defauctCheckId = data.id
        this.defauctCheckName = data.name
      }
    },
    renderContent(h, { node, data, store }) {
      
      node.data._add = "";
      node.data._addIcon = "";
      node.data._remove = "";
      node.data._removeIcon = "";
      node.data._edit = "";
      node.data._editIcon = "";

      if (node.data.level == 0) {
        node.data._add = "添加目录";
        node.data._addIcon = "el-icon-folder-add";
      }
      if (node.data.level == 1) {
        node.data._add = "添加菜单";
        node.data._addIcon = "el-icon-document-add";
        node.data._edit = "编辑目录";
        node.data._editIcon = "el-icon-edit-outline";
        node.data._remove = "删除目录";
        node.data._removeIcon = "el-icon-folder-delete";
      }
      if (node.data.level == 2) {
        node.data._add = "添加按钮";
        node.data._addIcon = "el-icon-plus";
        node.data._edit = "编辑菜单";
        node.data._editIcon = "el-icon-edit-outline";
        node.data._remove = "删除菜单";
        node.data._removeIcon = "el-icon-folder-delete";
      }
      return (
        <span class="custom-tree-node">
          <span>
            <i class={node.data.icon}></i> {node.data.name}
          </span>
          <span
            on-click={(e) => {
              e.stopPropagation();
            }}
          >
            <el-dropdown trigger="click"
              on-command={(command) => {
                this.resetTemp();
                //格式 id,parentId,level,action
                const arry = command.split(",");

                if (arry[2] == "0") {
                  this.dialogStatus = "addDir";
                  this.dialogTag = "dir";
                  this.dialogDirFormVisible = true;
                  this.tempDir.parentId = arry[0];
                }
                if (arry[2] == "1") {
                  if (arry[3] == "add") {
                    //添加菜单
                    this.temp.parentId = arry[0]
                    this.dialogStatus = "addMenu";
                    this.dialogTag = "menu";
                    this.dialogFormVisible = true;

                  } else if (arry[3] == "edit") {
                    //编辑目录
                    this.query.id = arry[0];
                    this.handleDirUpdate();

                    this.dialogStatus = "editDir";
                    this.dialogTag = "dir";
                    this.dialogDirFormVisible = true;
                  } else {
                    //删除目录
                     this.$confirm('此操作将永久删除该目录, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                      }).then(() => {
                        this.query.id = arry[0];
                        this.deleteDirData()
                      }).catch(() => {
        
                      });
                  }
                }
                if (arry[2] == "2") {
                  if (arry[3] == "add") {
                    this.defauctCheckId = arry[0];
                    this.handleButtonCreate();
                  } else if (arry[3] == "edit") {
                    this.query.id = arry[0];
                    this.handleUpdate();
                    this.dialogStatus = "editMenu";
                    this.dialogTag = "menu";
                    this.dialogFormVisible = true;
                  } else {
                     this.$confirm('此操作将永久删除该菜单, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                      }).then(() => {
                        this.query.id = arry[0];
                        this.deleteData()
                      }).catch(() => {
        
                      });
                  }
                }
              }}
            >
              <span class="el-dropdown-link">
                操作<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  icon={node.data._addIcon}
                  command={
                    node.data.id +
                    "," +
                    node.data.parentId +
                    "," +
                    node.data.level +
                    ",add"
                  }
                >
                  {node.data._add}
                </el-dropdown-item>
                <el-dropdown-item
                  icon={node.data._editIcon}
                  command={
                    node.data.id +
                    "," +
                    node.data.parentId +
                    "," +
                    node.data.level +
                    ",edit"
                  }
                >
                  {node.data._edit}
                </el-dropdown-item>
                <el-dropdown-item
                  icon={node.data._removeIcon}
                  command={
                    node.data.id +
                    "," +
                    node.data.parentId +
                    "," +
                    node.data.level +
                    ",remove"
                  }
                >
                  {node.data._remove}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </span>
        </span>
      );
    },
    getMenuList() {
      this.listLoading = true;
      getMenuList().then((response) => {
        this.list_menu = response.data;
        this.listLoading = false;
      });
      this.listLoading = false;
    },
    generateElementIconCode(symbol) {
      return `<i class="el-icon-${symbol}" />`;
    },
    handleClipboard(text, event) {
      if (this.dialogTag == "dir") {
        this.innerDirVisible = false;
        this.tempDir.icon = `el-icon-${text}`;
      } else {
        this.innerVisible = false;
        this.temp.icon = `el-icon-${text}`;
      }
    },
    resetTemp() {
      this.temp = {
        id: "",
        name: "",
        icon: "",
        level: "2",
        parentId: "",
        url: "",
        sort: "99",
      };
      this.tempDir = {
        id: "",
        name: "",
        icon: "",
        level: "1",
        parentId: "Home",
        url: "",
        sort: "99",
      };
    },
    createDirData() {
      this.$refs["dataFormDir"].validate((valid) => {
        if (valid) {
          console.log(this.tempDir);
          createDir(this.tempDir).then(() => {
            this.dialogDirFormVisible = false;
            this.loadDataTree()//刷新节点
            this.$notify({
              title: "成功",
              message: "创建成功",
              type: "success",
              duration: 2000,
            });
          });
        }
      });
    },
    handleDirUpdate() {
      this.listLoading = true;
      getDir(this.query).then((response) => {
        this.tempDir = response.data;
        this.listLoading = false;
      });
    },
    updateDirData() {
      this.$refs["dataFormDir"].validate((valid) => {
        if (valid) {
          updateDir(this.tempDir).then(() => {
            this.dialogDirFormVisible = false;
            this.loadDataTree()//刷新节点
            getMenuList();
            this.$notify({
              title: "成功",
              message: "修改成功",
              type: "success",
              duration: 2000,
            });
          });
        }
      });
    },
    createData(){
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          createMenu(this.temp).then(() => {
            this.dialogFormVisible = false;
                        this.loadDataTree()//刷新节点
            this.$notify({
              title: "成功",
              message: "创建成功",
              type: "success",
              duration: 2000,
            });
          });
        }
      });
    },
     handleUpdate() {
      this.listLoading = true;
      getMenu(this.query).then((response) => {
        this.temp = response.data;
        this.listLoading = false;
      });
    },
    updateData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          updateMenu(this.temp).then(() => {
            this.dialogFormVisible = false;
            this.loadDataTree()//刷新节点
            this.$notify({
              title: "成功",
              message: "修改成功",
              type: "success",
              duration: 2000,
            });
          });
        }
      });
    },
    deleteData() {
      deleteMenu(this.query).then(()=>{
        this.dialogDirFormVisible = false;
            this.loadDataTree()//刷新节点
            this.$notify({
              title: "成功",
              message: "删除成功",
              type: "success",
              duration: 2000,
            });
      })
    },
    deleteDirData() {
      deleteDir(this.query).then(()=>{
        this.dialogDirFormVisible = false;
            this.loadDataTree()//刷新节点
            this.$notify({
              title: "成功",
              message: "删除成功",
              type: "success",
              duration: 2000,
            });
      })
    },
    handleButtonCreate() {
              this.$refs.child.handleCreate();
        },
  },
  created: function () {
    window.addEventListener("resize", this.getHeight);
    this.getHW();
    this.getMenuList();
  },
};
</script>

<style>
/* .el-tree-node:focus > .el-tree-node__content {
    background-color: #03a9f4;
    border-radius: 5px;
} */

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>

<style>
.main {
  margin: 5px;
  width: 100%;
  float: left;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card-menu {
  height: 100%;
  float: left;
  overflow: scroll;
}
.box-card-body {
  margin-right: 10px;
  margin-left: 5px;
  height: 100%;
  float: left;
  overflow: scroll;
}
</style>

<style lang="scss" scoped>
.icons-container {
  margin: 10px 20px 0;
  overflow: hidden;

  .icon-item {
    margin: 20px;
    height: 85px;
    text-align: center;
    width: 100px;
    float: left;
    font-size: 30px;
    color: #24292e;
    cursor: pointer;
  }

  span {
    display: block;
    font-size: 16px;
    margin-top: 10px;
  }

  .disabled {
    pointer-events: none;
  }
}
</style>