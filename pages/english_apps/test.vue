<template>
  <div>
    <button v-on:click="redo" v-if= "redoButton" class="btn">{{buttonTitle}}</button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      redoButton: true,
      buttonTitle: "",
    }
  },
  methods: {
    redo () {
      console.log("click!");
      this.buttonTitle = "dic!";
    }
  }
}
</script>
