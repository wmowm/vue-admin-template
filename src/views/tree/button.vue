<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      stripe
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      class="tableBox"
    >
      <el-table-column label="菜单ID">
        <template slot-scope="scope">
          {{ scope.row.parentId }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="按钮ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="按钮名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="按钮图标" align="center">
        <template slot-scope="scope">
            <i class='scope.row.icon'></i>
        </template>
      </el-table-column>
      <el-table-column label="路由地址" align="center">
        <template slot-scope="scope">
             <span>{{ scope.row.url }}</span>
        </template>
      </el-table-column>
      <el-table-column
      label="操作"
      align="center"
      fixed="right"
      width="150">
      <template slot-scope="scope">
        <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">
          编辑
        </el-button>
        <el-popover
                placement="top"
                :ref="scope.$index"
                >
            <p>确定删除吗？</p>
            <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="scope._self.$refs[scope.$index].doClose()">取消</el-button>
                <el-button type="text" size="mini" @click="scope._self.$refs[scope.$index].doClose();handleDelete(scope.row)">确定</el-button>
            </div>
            <el-button slot="reference"  type="danger" size="mini" >删除</el-button>
        </el-popover>

      </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible":close-on-click-modal='false' width='30%'>
        <el-dialog
            width="50%"
            title="选择图标"
            :visible.sync="innerVisible"
            append-to-body>
            <div class="icons-container">
             <div v-for="item of elementIcons" :key="item" @click="handleClipboard(item,$event)">
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
        <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
            <el-form-item label="菜单ID" prop="parentId">
            <el-input :disabled="true" v-model="temp.parentId" />
            </el-form-item>
            <el-form-item label="按钮名称" prop="name">
            <el-input v-model="temp.name" />
            </el-form-item>
            <el-form-item label="按钮图标" prop="icon">
             <el-input placeholder="请选择图标" v-model="temp.icon">
                <template slot="prepend">
                    <i :class="temp.icon" />
                </template>
                <el-button slot="append" icon="el-icon-search" @click="innerVisible = true"></el-button>
             </el-input>
            </el-form-item>
            <el-form-item label="路由地址" prop="url">
            <el-input placeholder="请输入路由地址" v-model="temp.url">
                <template slot="prepend">Http://</template>
             </el-input>
            </el-form-item>
        </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>



<script>
import { getMenuButtonList} from '@/api/menu'

import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import elementIcons from '../icons/element-icons'
export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      elementIcons,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        pageIndex: 1,
        pageSize: 10,
        title: undefined,
        status: undefined,
        //sort: '+id'
      },
      temp: {
        id:'',
        name: '',
        icon: '',
        level: '',
        parentId: '',
        url:'',
        sort:''
      },
      dialogFormVisible: false, //外层dialog
      innerVisible:false, //内层dialog
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        author: [{ required: true, message: '密钥不能为空', trigger: 'blur' }],
        title: [{ required: true, message: '标题不能为空', trigger: 'blur' }]
      },
      downloadLoading: false,
      statusOptions:{1:"成功",2:"失败",3:"其它"},
      visible: true, //删除确认
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      console.log(this.listQuery)
      this.listLoading = true
      getMenuButtonList(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.pageIndex = 1
      this.getList()
    },
    generateElementIconCode(symbol) {
      return `<i class="el-icon-${symbol}" />`
    },
    handleClipboard(text, event) {
      this.innerVisible = false
      this.temp.icon=`el-icon-${text}`
    },
    // resetTemp() {
    //   this.temp = {
    //     id: undefined,
    //     author: '',
    //     remark: '',
    //     timestamp: new Date(),
    //     title: '',
    //     status: '2',
    //   }
    // },
    handleCreate() {
      //this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createUser(this.temp).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      console.log(row)
      this.temp = Object.assign({}, row) // copy obj
      this.temp.status = this.statusOptions[this.temp.status]
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          console.log(tempData.timestamp)
          updateUser(tempData).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row) {
      console.log(row)
      deleteUser({id:row.id}).then(() => {
        this.dialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
      })
    },
  }
}
</script>

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