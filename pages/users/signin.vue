<template>
  <div>
    <h1>Signin Page</h1>

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
    <button class="btn" v-on:click="signin" >Signin</button>
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
    title: 'signin'
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
      formError: ""
    }
  },
  methods: {
    async signin () {
      try {
        await this.$store.dispatch('signin', {
          username: this.username,
          password: this.password
        });
        console.log("signin");
        this.username = '';
        this.password = '';
        this.formError = null;
      } catch(e) {
        this.formError = e.message;
      }
    },
  }
}
</script>
