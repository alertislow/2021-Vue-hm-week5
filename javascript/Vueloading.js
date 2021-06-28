export default {
  template:
  `<div class="vld-parent">
    <loading v-model:active="isLoading"
            :can-cancel="true"
            :on-cancel="onCancel"
            :is-full-page="fullPage"/>

    <label><input type="checkbox" v-model="fullPage">Full page?</label>
    <button @click.prevent="doAjax">fetch Data</button>
  </div>`
  
}