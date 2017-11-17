<template>
  <div class="index">
    <h1>Ankimo</h1>
    <p>the best memorizarion system</p>
    <div class="tank">
      動詞: {{ verbRate }}%<br>
      名詞: {{ nounRate }}%<br>
      接続詞: {{ conjunctionRate }}%<br>
    </div>
  </div>
</template>

<script>
import axios from "~/plugins/axios"
// import Vue from "Vue"

export default {
  data () {
    return {
      verbRate: 0,
      nounRate: 0,
      conjunctionRate: 0,
    }
  },
  mounted: function () {
    this.getTankRate( tankRate => {
      if (tankRate.status === 200) {
        console.log(tankRate.verb.learned);
        this.verbRate = tankRate.verb.learned / tankRate.verb.base * 100
        this.nounRate = tankRate.noun.learned / tankRate.noun.base * 100
        this.conjunctionRate = tankRate.conjunction.learned / tankRate.conjunction.base * 100
      } else {
        this.login();
      }
    });
  },
  methods: {
    getTankRate (ret) {
      axios.get(`/tank-rate`).then ( response => {
        ret( response.data );
      }).catch( error => {
        console.log(error);
      });
    },
    login () {
    }
  }
}
</script>
