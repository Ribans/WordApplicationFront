<template>
  <div>
    <b-navbar toggleable="md" type="dark" variant="info">
      <b-nav-toggle target="nav_collapse"></b-nav-toggle>
      <b-navbar-brand href="/">Ribans</b-navbar-brand>
      <b-collapse is-nav id="nav_collapse">
        <b-nav is-nav-bar>
          <b-nav-item href="/english_apps/learn">記憶</b-nav-item>
          <b-nav-item href="/english_apps/challenge">挑戦</b-nav-item>
          <b-nav-item href="/english_apps/training">練習</b-nav-item>
        </b-nav>
      </b-collapse>
    </b-navbar>
    <main>
    <nuxt/>
    </main>
  </div>
</template>
