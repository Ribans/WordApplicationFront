<template>
  <div class="index">
    <h1>Ankimo</h1>
    <p>the best memorizarion system</p>

    <div class="tank">

      動詞: {{ verbRate.witdh }}
      <div class="progress">
        <div class="progress-bar progress-bar-danger progress-bar-striped" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" :style="verbRate"> </div>
      </div>

      名詞: {{ nounRate.width }}
      <div class="progress">
        <div class="progress-bar progress-bar-danger progress-bar-striped" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" :style="nounRate"> </div>
      </div>

      接続詞 {{ conjunctionRate.width }}
      <div class="progress">
        <div class="progress-bar progress-bar-danger progress-bar-striped" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" :style="conjunctionRate"> </div>
      </div>

    </div>
  </div>
</template>

<script>
import axios from "~/plugins/axios"
// import Vue from "Vue"

export default {
  data () {
    return {
      verbRate: {witdh: 0},
      nounRate: {witdh: 0},
      conjunctionRate: {witdh: 0},
    }
  },
  mounted: function () {
    this.getTankRate( tankRate => {
      if (tankRate.status === 200) {
        this.verbRate = {witdh: Math.floor(tankRate.verb.learned / tankRate.verb.base * 100) + "%"};
        this.nounRate = {width: Math.floor(tankRate.noun.learned / tankRate.noun.base * 100) + "%" };
        this.conjunctionRate = {width: Math.floor(tankRate.conjunction.learned / tankRate.conjunction.base * 100) + "%" };
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
