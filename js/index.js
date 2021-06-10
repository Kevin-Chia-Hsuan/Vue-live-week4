import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.11/vue.esm-browser.js';

// 區域註冊: 載入 分頁頁碼 元件
import pagination from './pagination.js';
// 區域註冊: 載入新增、編輯產品 Modle 元件
import userProductModal from './userProductModal.js';
// 區域註冊: 載入刪除產品 Modle 元件
import delProductModal from './delProductModal.js';

// 加入站點
const apiUrl = 'https:///vue3-course-api.hexschool.io';
// 加入個人 API Path
const apiPath = 'kevinapog47138';

// let productModal = {};
// let delProductModal = {};

const app = createApp({
  data() {
    return {
      // 一律使用 function return
      products: [],
      isNew: false, // 判斷點擊的是新增按鈕方法還是編輯按鈕方法
      tempProduct: {
        // 預計調整資料使用結構，如:新增產品時的暫時資料儲存
        imagesUrl: [], // 第二層結構
      },
      pagination: {},
      userProductModal: {},
    };
  },
  // 區域註冊
  // 註冊 分頁頁碼 元件
  // BS實體
  // 註冊 載入新增、編輯產品 Modle 元件
  // 註冊 載入刪除產品 Modle 元件
  components: {
    pagination,
    userProductModal,
    delProductModal,
  },
  mounted() {
    // 取得資料、DOM元素
    this.getProducts();

    // BS實體，建立新產品、編輯產品
    // this.productModal = new bootstrap.Modal(this.$refs.productModal, {
    //   // keyboard:false時，按下esc時不關閉當前畫面
    //   keyboard: false,
    // });

    // 刪除產品
    // delProductModal = new bootstrap.Modal(
    //   document.getElementById('delProductModal'),
    //   {
    //     // keyboard:false時，按下esc時不關閉當前畫面
    //     keyboard: false,
    //   }
    // );
  },
  methods: {
    getProducts(page = 1) {
      // 取得產品列表
      const url = `${apiUrl}/api/${apiPath}/admin/products?page=${page}`;
      axios
        .get(url)
        .then((response) => {
          if (response.data.success) {
            this.products = response.data.products;
            this.pagination = response.data.pagination;
          } else {
            console.log(response.data.message);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    // 開啟建立新產品、編輯、刪除方法
    openModal(isNew, item) {
      if (isNew === 'new') {
        // 傳入new，等於新增產品

        // 把暫存資料清空
        this.tempProduct = {
          imagesUrl: [],
        };
        this.isNew = true;
        this.$refs.userProductModal.openModal();
      } else if (isNew === 'edit') {
        // 傳入edit，等於編輯產品
        this.tempProduct = { ...item };
        this.isNew = false;
        this.$refs.userProductModal.openModal();
      } else if (isNew === 'delete') {
        // 傳入delete，等於刪除產品
        this.tempProduct = { ...item };
        this.$refs.delProductModal.openModal();
      }
    },

    // // 圖片新增
    // createImages() {
    //   this.tempProduct.imagesUrl = [];
    //   this.tempProduct.imagesUrl.push('');
    // },

    // 編輯訂單內容
    updateProduct(tempProduct) {
      let url = `${apiUrl}/api/${apiPath}/admin/product`;
      let method = 'post'; // post 新增產品
      if (!this.isNew) {
        url = `${apiUrl}/api/${apiPath}/admin/product/${tempProduct.id}`;
        method = 'put'; // put 編輯產品
      }
      axios[method](url, { data: tempProduct })
        .then((response) => {
          if (response.data.success) {
            swal('成功!', '產品新增、編輯成功', 'success');
            this.$refs.userProductModal.hideModal();
            this.getProducts();
          } else {
            // alert(response.data.message);
            const errorMsg = response.data.message;
            swal('出錯了!', `${errorMsg}`, 'error');
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    // 刪除產品方法
    delProduct(tempProduct) {
      const url = `${apiUrl}/api/${apiPath}/admin/product/${tempProduct.id}`;
      axios
        .delete(url)
        .then((response) => {
          if (response.data.success) {
            swal('成功!', '產品刪除成功', 'success');
            this.$refs.delProductModal.hideModal();
            this.getProducts();
          } else {
            console.log(response.data.message);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  created() {
    // 元件生成，必定會執行的項目
    // 取得 Token
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
      '$1'
    );
    if (token === '') {
      // promise 先跳出提示視窗，按確定後才跳轉回登入頁
      swal('出錯了!', '您尚未登入請重新登入。', 'error')
        .then(() => {
          window.location = 'login.html';
        })
        .catch((error) => {
          console.log(error);
        });
    }
    axios.defaults.headers.common['Authorization'] = token;
  },
});

// 全域註冊建立新產品、編輯產品
// app.component('productModal', {
//   template: `<div id="productModal" ref="productModal" class="modal fade" tabindex="-1" aria-labelledby="productModalLabel"
//     aria-hidden="true">
//     <div class="modal-dialog modal-xl">
//         <div class="modal-content border-0">
//             <div class="modal-header bg-dark text-white">
//                 <h5 id="productModalLabel" class="modal-title">
//                 <span>{{ isNew? '新增產品' : '編輯產品' }}</span>
//                 </h5>
//                 <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
//             </div>
//             <div class="modal-body">
//                 <div class="row">
//                     <div class="col-sm-4">
//                         <div class="form-group">
//                             <label for="imageUrl">主要圖片</label>
//                             <input id="imageUrl" v-model="tempProduct.imageUrl" type="text" class="form-control"
//                                 placeholder="請輸入圖片連結">
//                             <img class="img-fluid" :src="tempProduct.imageUrl">
//                         </div>
//                         <div class="mb-1">多圖新增</div>
//                         <div v-if="Array.isArray(tempProduct.imagesUrl)">
//                             <div class="mb-1" v-for="(image, key) in tempProduct.imagesUrl" :key="key">
//                                 <div class="form-group">
//                                     <label for="imageUrl">圖片網址</label>
//                                     <input v-model="tempProduct.imagesUrl[key]" type="text" class="form-control"
//                                         placeholder="請輸入圖片連結">
//                                 </div>
//                                 <img class="img-fluid" :src="image">
//                             </div>
//                             <div
//                                 v-if="!tempProduct.imagesUrl.length || tempProduct.imagesUrl[tempProduct.imagesUrl.length - 1]">
//                                 <button type="button" class="btn btn-outline-primary btn-sm d-block w-100"
//                                     @click="tempProduct.imagesUrl.push('')">
//                                     新增圖片
//                                 </button>
//                             </div>
//                             <div v-else>
//                                 <button type="button" class="btn btn-outline-danger btn-sm d-block w-100"
//                                     @click="tempProduct.imagesUrl.pop()">
//                                     刪除圖片
//                                 </button>
//                             </div>
//                         </div>
//                         <div v-else>
//                             <button type="button" class="btn btn-outline-primary btn-sm d-block w-100" @click="createImages">
//                                 新增圖片
//                             </button>
//                         </div>
//                     </div>
//                     <div class="col-sm-8">
//                         <div class="form-group">
//                             <label for="title">標題</label>
//                             <input id="title" v-model="tempProduct.title" type="text" class="form-control"
//                                 placeholder="請輸入標題">
//                         </div>

//                         <div class="row">
//                             <div class="form-group col-md-6">
//                                 <label for="category">分類</label>
//                                 <input id="category" v-model="tempProduct.category" type="text"
//                                     class="form-control" placeholder="請輸入分類">
//                             </div>
//                             <div class="form-group col-md-6">
//                                 <label for="unit">單位</label>
//                                 <input id="unit" v-model="tempProduct.unit" type="text" class="form-control"
//                                     placeholder="請輸入單位">
//                             </div>
//                         </div>

//                         <div class="row">
//                             <div class="form-group col-md-6">
//                                 <label for="origin_price">原價</label>
//                                 <input id="origin_price" v-model.number="tempProduct.origin_price" type="number"
//                                     min="0" class="form-control" placeholder="請輸入原價">
//                             </div>
//                             <div class="form-group col-md-6">
//                                 <label for="price">售價</label>
//                                 <input id="price" v-model.number="tempProduct.price" type="number" min="0"
//                                     class="form-control" placeholder="請輸入售價">
//                             </div>
//                         </div>
//                         <hr>

//                         <div class="form-group">
//                             <label for="description">產品描述</label>
//                             <textarea id="description" v-model="tempProduct.description" type="text"
//                                 class="form-control" placeholder="請輸入產品描述">
//             </textarea>
//                         </div>
//                         <div class="form-group">
//                             <label for="content">說明內容</label>
//                             <textarea id="description" v-model="tempProduct.content" type="text"
//                                 class="form-control" placeholder="請輸入說明內容">
//             </textarea>
//                         </div>
//                         <div class="form-group">
//                             <div class="form-check">
//                                 <input id="is_enabled" v-model="tempProduct.is_enabled" class="form-check-input"
//                                     type="checkbox" :true-value="1" :false-value="0">
//                                 <label class="form-check-label" for="is_enabled">是否啟用</label>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <div class="modal-footer">
//                 <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
//                     取消
//                 </button>
//                 <button type="button" class="btn btn-primary" @click="$emit('update-product', tempProduct)">
//                     確認
//                 </button>
//             </div>
//         </div>
//     </div>
//   </div>`,
//   props: ['tempProduct', 'isNew'],
//   methods: {
//     // 圖片新增
//     createImages() {
//       this.tempProduct.imagesUrl = [];
//       this.tempProduct.imagesUrl.push('');
//     },
//   },
// });

// 全域註冊刪除產品
// app.component('delProductModal', {
//   template: `<div id="delProductModal" ref="delProductModal" class="modal fade" tabindex="-1"
//     aria-labelledby="delProductModalLabel" aria-hidden="true">
//     <div class="modal-dialog">
//         <div class="modal-content border-0">
//             <div class="modal-header bg-danger text-white">
//                 <h5 id="delProductModalLabel" class="modal-title">
//                     <span>刪除產品</span>
//                 </h5>
//                 <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
//             </div>
//             <div class="modal-body">
//                 是否刪除
//                 <strong class="text-danger">{{ tempProduct.title }}</strong> 商品(刪除後將無法恢復)。
//             </div>
//             <div class="modal-footer">
//                 <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
//                     取消
//                 </button>
//                 <button type="button" class="btn btn-danger" @click="$emit('del-product', tempProduct)">
//                     確認刪除
//                 </button>
//             </div>
//         </div>
//     </div>
//   </div>`,
//   props: ['tempProduct', 'isNew'],
// });

app.component('userProductModal', userProductModal);
app.component('delProductModal', delProductModal);

app.mount('#app');
