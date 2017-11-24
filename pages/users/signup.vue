<template>
  <div>
    <h1>Signup Page</h1>

    <b-alert variant="danger" dismissible :show=" $store.state.currentUser && $store.state.currentUser.statusCode == 403" @dismissed="showDismissibleAlert=false">
      失敗
    </b-alert>

    <label>UserName: 
      <b-form-input v-model="username" type="text" placeholder="Enter your username"></b-form-input> 
    </label>
    <br>
    <label>Password: 
      <b-form-input v-model="password" type="password" placeholder="Enter your password "></b-form-input> 
    </label>
    <br>
    <label>Password: 
      <b-form-input v-model="confirmPassword" type="password" placeholder="Enter your confirm password "></b-form-input> 
    </label>

    <button class="btn" v-on:click="signup" >Signup</button>
  </div>
</template>

<style>
label {
  width: 100%;
  margin: 15px;
}
</style>

<script>
export default {
  head: {
    title: 'signup'
  },
  fetch ({ store, redirect }) {
    if (store.state.currentUser && !(store.state.currentUser.statusCode == 403) ) {
      return redirect('/')
    }
  },
  data: function() {
    return {
      username: "",
      password: "",
      confirmPassword: "",
      formError: ""
    }
  },
  methods: {
    async signup () {
      try {
        await this.$store.dispatch('signup', {
          username: this.username,
          password: this.password,
          confirmPassword: this.confirmPassword
        });
        this.username = '';
        this.password = '';
        this.confirmPassword = '';
        this.formError = null;
      } catch(e) {
        this.formError = e.message;
      }
    },
  }
}
</script>
