<template>
  <div>
    <h2>トレーニングパート</h2>
    <p>
    タンクの中身が減ってしまうかもしれないモード<br>
    ・ankimoタンクの中身から出題<br>
    ・選択肢は、タンク内の同じ品詞から<br>
    </p>
    <b-alert variant="danger" dismissible :show="!!errorMessage[0]">
      {{ errorMessage }}
    </b-alert>

    <select id="select-lang" name="lang" class="btn" v-model="selectedLang">
      <option value="japanese">日本語</option>
      <option value="english">英語</option>
    </select>

    <button id="start" class="btn" v-on:click="start">スタート</button>

    <br> <br>

    <div class="exam">
      <span class="judge">{{ result }}</span>
      <h3 class="exam_title">{{exams[questionLang]}}</h3><br>
      <button class ="btn" v-for="data in exams.dummies" v-on:click="judgeing(data[answerLang])" :disabled="examsAnswerShow">
        {{ data[answerLang] }}
        <span v-if="examsAnswerShow">({{ data[questionLang] }})</span>
      </button>
    </div>
  </div>
</template>

<script>
import axios from '~/plugins/axios'

var timer

export default {
  data: function() {
    return {
      errorMessage: "",
      exams: [], //試験データ
      selectedLang: "japanese", //選択されている言語
      questionLang: "japanese",
      answerLang:   "english",
      result: "", //回答したあとに出す合否
      examsAnswerShow: false, //正答例データ
    }
  },
  methods: {
    start: function() {
      this.getExam();
      this.switchLang();
      //reset
      this.examsAnswerShow = false,
      this.result = ""
      },
    getExam: function() {
      if (this.$store.state.currentUser) {  
        axios.post(`/training`, JSON.stringify({
          uid: this.$store.state.currentUser.profile.uid
        })).then((res) => {
          this.exams = res.data;
        }).catch( e => {
          this.errorMessage = e.response.data.message;
        } );
      } else {
        this.errorMessage = "ログインしてください"
      }
    },
    switchLang: function() {
      switch (this.selectedLang) {
        case "japanese":
          console.log("Selected: Japanese");
          this.questionLang = "english";
          this.answerLang = "japanese";
          break;
        case "english":
          console.log("Selected: English");
          this.questionLang = "japanese";
          this.answerLang = "english";
          break;
      }
    },
    judgeing: function(value) {
      if (this.exams[this.answerLang] === value){
        this.result = "正解";
      } else {
        this.result = "不正解";
        this.forgot(this.exams.id);
      }
      this.next();
    },
    forgot (word_id) {
      axios.post(`/forgot`, JSON.stringify({
        uid: this.$store.state.currentUser.profile.uid,
        word_id: word_id
      })).then((res) => {
        if (res.status === 200) {
          console.log("Ankimoタンクから削除されました");
        }
      }).catch( (e) => {
        console.log("Ankimoタンクから削除を試みましたが失敗しました");
      });
    },
    next: function() {
      new Promise((resolve ,reject) => {
        this.examsAnswerShow = true;
        setTimeout(() => { 
          resolve(); 
        }, 3000);
      }).then(() => {
        this.start()
      });
    },
  }
}
</script>
