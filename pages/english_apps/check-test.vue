<template>
  <div>
    <div class="description" v-if="true">
      <h1>チェックテスト</h1>
      <p>今覚えた10の単語がランダムで出題されます<br>
        単語の意味をすべて３秒以内で答えるようにしてください<br>
        正解した問題は、ankimoタンクに溜まっていきます</p>
        <button v-on:click="start" class="btn">スタート</button>
      </div>
      <div class="exams">
      </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  methods: {
    start () {
    }
  }
}
</script>
