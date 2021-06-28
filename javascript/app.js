import productModal from './productModal.js';

const apiUrl = 'https://vue3-course-api.hexschool.io';
const apiPath = 'dogezad';

const app = Vue.createApp({
  data() {
    return {
      // 讀取效果
      loadingStatus: {
        loadingItem: '',
      },
      // 產品列表
      products: [],
      // props 傳遞到內層的暫存資料
      product: {},
      // 表單結構
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: '',
        },
        message: '',
      },
      // 購物車列表
      cart: {},
    };
  },
  methods: {
    // 客戶端取得產品列表(免驗證)
    getProducts() {
      const api = `${apiUrl}/api/${apiPath}/products`;
      axios.get(api)
        .then(res=> {
          this.products = res.data.products;
        })
    },
    //  查看更多開啟產品細項
    openModal(item) {
      // 把該品項 id 添加到 讀取狀態內的物件
      this.loadingStatus.loadingItem = item.id;
      //console.log(item);
      const api = `${apiUrl}/api/${apiPath}/product/${item.id}`;
        axios.get(api)
          .then(res=> {
            this.product = res.data.product;  // 把回傳資料先存到 product 內
            //*  取完資料結束讀取狀態，把讀取物件清空 */
            this.loadingStatus.loadingItem = '';  // ! ajax 結束後再把它清空 ？？？？這裡不太懂，
            this.$refs.userProductModal.openModal();  //取完後打開 Modal 
          })
    },
    // 加入購物車(產品id,數量)
    addCart(id, qty = 1) {
      this.loadingStatus.loadingItem = id;
      // 購物車的結構{ 產品id、數量}
      const cart = {
        product_id: id,
        qty
      }
      // console.log(cart);
      const api = `${apiUrl}/api/${apiPath}/cart`
      axios.post(api,{data: cart})
        .then(res => {
          //console.log(res);
          this.getCarts();    // 每次加入購物車後便重新取得購物車列表
          this.loadingStatus.loadingItem = ''; 
        })
        .catch(err => {
          alert(err.data.message);
        })
    },
    // 取得購物車列表
    getCarts() {
      const api = `${apiUrl}/api/${apiPath}/cart`;
        axios.get(api)
          .then(res=> {
            //console.log(res);
            this.cart = res.data.data;
          })
          .catch(err => {
            alert(err.data.message);
          })
    },
    // 更新購物車
    updateCart(item) {
      this.loadingStatus.loadingItem = item.id;
      const api = `${apiUrl}/api/${apiPath}/cart/${item.id}`;
      const cart = {
        product_id: item.product.id,
        qty: item.qty
      }
      // console.log(cart, api);
        axios.put(api, {data: cart})
          .then(res=> {
            console.log(res);
            this.getCarts();
            this.loadingStatus.loadingItem = ''; 
          })
          .catch(err => {
            alert(err.data.message);
          })
    },
    // 刪除購物車單一品項
    delCartItem(item) {
      this.loadingStatus.loadingItem = item.id;
      const api = `${apiUrl}/api/${apiPath}/cart/${item.id}`
      axios.delete(api)
        .then(res=> {
          console.log(res);
          this.getCarts();
          this.loadingStatus.loadingItem = ''; 
        })
    },
    // 刪除購物車全部品項
    delAllCart(item) {        // !!!!!!!! 想要加入讀取效果，該怎麼判斷？
      // this.loadingStatus.loadingItem = item.id;
      const api = `${apiUrl}/api/${apiPath}/carts`
      axios.delete(api)
        .then(res=> {
          console.log(res);
          this.getCarts();
          // this.loadingStatus.loadingItem = ''; 
        })
    },
    // 表單送出   // !!!!!!!! 建立結帳頁面訂單錯誤
    onSubmit(item) {
      const api = `${apiUrl}/api/${apiPath}/order`;
      const order = {
        user:{
          name: item.name,
          email: item.email,
          tel: item.tel,
          address: item.address
        },
          message: item.message
      }
      axios.post(api,{data:order})
        .then(res => {
          alert(res.data.message);
          console.log(res);
          this.form.user=''
          this.form.message = '';
        })
    },
    // 電話驗證規則
    isPhone(value) {
      const phoneNumber = /^(09)[0-9]{8}$/
      return phoneNumber.test(value) ? true : '須為正確的電話號碼'
    }
  },
  mounted() {
    this.getProducts();
    this.getCarts();    // 進入畫面時便取得購物車列表
   // this.$refs.userProductModal.openModal();    // 跨層取得 userProductModal
  },
});

// 步驟四：加入多國語系
VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');

// Activate the locale
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize('zh_TW'),
  validateOnInput: true, // 調整為輸入字元立即進行驗證
});

// 步驟三：定義規則
Object.keys(VeeValidateRules).forEach(rule => {
  if (rule !== 'default') {
    VeeValidate.defineRule(rule, VeeValidateRules[rule]);
  }
});

// 步驟二： 註冊元件
app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);

// 客戶端商品視窗
app.component('userProductModal', productModal)

//app.component('loading',Vueloading)
app.mount('#app');