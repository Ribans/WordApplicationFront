<template>
  <div>

    <header>
      <b-navbar toggleable="md" type="dark" variant="info">
        <b-nav-toggle target="nav_collapse"></b-nav-toggle>
        <b-navbar-brand href="/">Ankimo</b-navbar-brand>
        <b-collapse is-nav id="nav_collapse">
          <b-nav is-nav-bar>
            <b-nav-item href="/english_apps/learn">記憶</b-nav-item>
            <b-nav-item href="/english_apps/challenge">挑戦</b-nav-item>
            <b-nav-item href="/english_apps/training">練習</b-nav-item>
          </b-nav>

          <b-nav is-nav-bar class="ml-auto">
            <b-nav-item-dropdown right>
              <template slot="button-content"> <strong>User</strong> </template>
              <div v-if="$store.state.authUser">
                <b-dropdown-item href="/users/profile">Profile</b-dropdown-item>
                <b-dropdown-item href="#">Signout</b-dropdown-item>
              </div>
              <div v-else>
                <b-dropdown-item href="/users/signin">Signin</b-dropdown-item>
                <b-dropdown-item href="/users/signup">Signup</b-dropdown-item>
              </div>
            </b-nav-item-dropdown>
          </b-nav>
        </b-collapse>
      </b-navbar>
    </header>

    <main id="container"> <div class="contents"><nuxt/></div> </main>

    <footer>
      <p>Powered by 成成予備校</p>
    </footer>

  </div>
</template>

<script>
export default {
  data: function() {
    return {
      userLogined: false,
    }
  }
}
</script>
