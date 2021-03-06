import Vue from 'vue'
import App from './App.vue'
import router from './router'
import moment from 'moment'
import axios from 'axios'
import store from './components/Store'
import snackbar from './components/Snackbar';
import VuejsDialog from 'vuejs-dialog';
import VueSlider from 'vue-slider-component'
import VueSocketIO from 'vue-socket.io'
import 'vue-slider-component/theme/antd.css'
import '../assets/js/fontawesome_all.js'

moment.locale('es')

require('../assets/css/main.scss')

Vue.prototype.$http = axios

axios.defaults.baseURL = process.env.EP

const token = localStorage.getItem('token')

Vue.use(VuejsDialog);

if (token) {
  axios.defaults.headers.common['Authorization'] = token
}

/*
Vue.use(new VueSocketIO({
    debug: true,
    connection: endpoint
}))*/

new Vue({
  el: '#app',
  router,
  store,
  computed: {
    isLoggedIn: function() {
      return this.$store.getters.isLoggedIn;
    }
  },
  created: function() {
    this.loading = false
  },
  methods: {
    logout: function() {
      this.$store.dispatch("logout").then(() => {
        this.$router.push("/login");
      });
    },
    snackbar : function(messageType,message,timeout){
      if(timeout===undefined) timeout = 5000
      this.messageType = messageType
      this.message = message
      document.querySelector('.ui-snackbar').classList.remove('ui-snackbar--is-inactive')
      document.querySelector('.ui-snackbar').classList.remove('ui-snackbar--success')
      document.querySelector('.ui-snackbar').classList.remove('ui-snackbar--error')
      document.querySelector('.ui-snackbar').classList.remove('ui-snackbar--default')

      document.querySelector('.ui-snackbar').classList.add('ui-snackbar--' + messageType)
      document.querySelector('.ui-snackbar').classList.add('ui-snackbar--is-active')
      setTimeout(() => {
        document.querySelector('.ui-snackbar').classList.remove('ui-snackbar--is-active')
        document.querySelector('.ui-snackbar').classList.add('ui-snackbar--is-inactive')
      },timeout)
    },
    tosAgree: function(){
      localStorage.setItem("tosagree",true)
      document.querySelector('.tosprompt').classList.remove('fadeIn')
      document.querySelector('.tosprompt').classList.add('fadeOut')      
      setTimeout(() => {
        document.querySelector('.tosprompt').parentNode.removeChild(document.querySelector('.tosprompt'))
      },3000)
    },
    convertDates: function(){
      document.querySelectorAll('.convert-date').forEach(function(el){
        const timestamp = el.innerText.toString().substring(0,8)
        const date = new Date( parseInt( timestamp, 16 ) * 1000 )
        el.innerHTML = moment(date).format(el.getAttribute('date-format')||null)
      })
    }
  },
  data : {
    ver: '1.0.1',
    port:0,
    endpoint: process.env.EP,
    loading:true,
    processing:false,
    verification:false,
    message:'',
    typeMessage:''
  },
  render: h => h(App)
})