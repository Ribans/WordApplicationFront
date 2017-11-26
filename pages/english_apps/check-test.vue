<template>
  <div>
    <div class="description" v-if="true">
      <h1>チェックテスト</h1>
      <p>今覚えた10の単語がランダムで出題されます<br>
      単語の意味をすべて３秒以内で答えるようにしてください<br>
      正解した問題は、ankimoタンクに溜まっていきます</p>
    </div>
    <button id="start" class="btn" v-on:click="start">スタート</button>

    <div class="exams">
      <span class="judge">{{ result }}</span>
      <h3 class="exam_title">{{exams.japanese}}</h3><br>
      <button class ="btn" v-for="data in exams.dummies" v-on:click="judgeing(data.japanese)" :disabled="examsAnswerShow">
        {{ data.english }}
      </button>
    </div>

  </div>
  </div>
</template>

<script>
import axios from '~/plugins/axios'

var timer

export default {
  fetch ({ store, redirect }) {
    if (!store.state.learnedExams) {
      return redirect('/')
    }
  },
  data: function() {
    return {
      errorMessage: "",
      exams: {},
      result: "", //回答したあとに出す合否
      examsAnswerShow: false, //正答例データ
      count: 0
    }
  },
  methods: {
    start: function() {
      this.getExams()
      //reset
      this.examsAnswerShow = false,
      this.result = ""
    },
    getExams () {
        axios.post(`/create-dummies`, JSON.stringify(
          {
            word_id: this.$store.state.learnedExams[this.count].id 
          }
        )).then( response => {
          this.exams = response.data
          console.log(response.data)
        }).catch ( error => {
          console.log(error);
        })
        this.count += 1
    },
    judgeing: function(value) {
      if (this.exams.japanese === value){
        this.result = "正解";
        this.remembered(this.exams.id);
      } else {
        this.result = "不正解";
      }
      this.next();
    },
    remembered (word_id) {
      axios.post(`/remembered`, JSON.stringify({
        uid: this.$store.state.currentUser.profile.uid,
        word_id: word_id
      })).then((res) => {
        if (res.status === 200) {
          console.log("Ankimoタンクに蓄積されました");
        }
      }).catch( (e) => {
        console.log(e.response.data.message)
        console.log("Ankimoタンクから蓄積を試みましたが失敗しました");
      });
    },
    next: function() {
      new Promise((resolve ,reject) => {
        this.examsAnswerShow = true;
        setTimeout(() => { 
          resolve(); 
        }, 3000);
      }).then(() => {
        if (this.count < 10) {
          this.start()
        } else {
          alert("終了！");
          this.clearExams()
          location.href = '/';
        }
      });
    },
    async clearExams () {
      await this.$store.dispatch('clearExams')
    },
  }
}
</script>
