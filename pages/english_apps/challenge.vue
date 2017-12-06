<template>
  <div>
    <h2>チャレンジパート</h2>

    <b-alert variant="danger" dismissible :show="!!errorMessage[0]">
      {{ errorMessage }}
    </b-alert>

    <select id="select-lang" name="lang" class="btn" v-model="selectedLang">
      <option value="japanese">日本語</option>
      <option value="english">英語</option>
    </select>

    <button id="start" class="btn" v-on:click="start">スタート</button>

    <br> <br>

    <div class="progress">
      <div class="progress-bar progress-bar-danger progress-bar-striped" id="count_down"  role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" :style="progress"> </div>
    </div>
    <br>

    <div class="exam" v-if="examsShow">
      <span class="judge">
        {{ result }}
      </span>
      <br>
      <strong><span id="count" >残り問題数: {{ 11 - wave }} </span></strong><br>
      <h3 class="exam_title">{{exams[questionLang]}}</h3><br>
      <button class="btn" v-for=" data in exams.dummies" v-on:click="judgeing(data[answerLang])" :disabled="examsAnswerShow">{{ data[answerLang] }}</button>
      <ul v-if="examsAnswerShow">
        <li v-for="data in exams.dummies">{{ data[answerLang] }}: {{ data[questionLang] }}</li>
      </ul>
    </div>

    <div class="result" v-if="resultShow">
      <table>
        <th>ID</td><th>問題</th><th>ボタン1</th> <th>ボタン2</th> <th>ボタン3</th> <th>ボタン4</th> <th>回答</th>
        <tr v-for="(data, index) in answerData">
          <td> {{index+1}} </td>
          <td> {{data.exams[answerLang] }} </td>
          <td v-for="dummies in data.exams.dummies"> {{ dummies[answerLang] }}({{ dummies[questionLang] }})</td>
          <td> {{data.selectAnswer }}({{data.result}})</td>
        </tr>
      </table>
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
      answerData: [], //回答されたデータ
      examsAnswerShow: false, //正答例データ
      examsShow: false,
      resultShow: false,
      wave: 1, //何問解いたかカウント
      progress: {width: "100%"},
    }
  },
  methods: {
    start: function() {
      if (this.$store.state.currentUser && !(this.$store.state.currentUser.statusCode == 403)) {  
        this.getExam( done => {
          if (done) {
            this.examsShow = true;
            this.switchLang();
            this.timer();
            //reset
            this.examsAnswerShow = false,
            this.result = ""
          }
        });
      } else {
        this.errorMessage = "ログインしてください"
      }
    },
    getExam: function(done) {
      axios.post(`/challenge`, JSON.stringify({
        uid: this.$store.state.currentUser.profile.uid
      })).then((res) => {
        this.exams = res.data;
        done(true);
      }).catch( e => {
        this.errorMessage = e.response.data.message;
        done(false);
      });
    },
    timer: function() {
      var par = 100;
      timer = setInterval(function(){
        if (par >= 0){
          this.progress = {width: ((par -= 10) + '%')}
        } else {
          this.judgeing("Timeout")
        }
      }, 1000)
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
        console.log("正解");
        this.answerData.push({exams: this.exams, result: "OK", selectAnswer: value})
        this.result = "正解"
      } else {
        console.log("不正解");
        this.answerData.push({exams: this.exams, result: "NO", selectAnswer: value})
        this.result = "不正解"
      }
      this.next();
    },
    next: function() {
      clearInterval(timer);

      new Promise((resolve ,reject) => {
        this.examsAnswerShow = true;
        setTimeout(function() { 
          resolve(); 
        }, 3000);
      }).then(() => {
        if ( this.wave < 10 ) {
          this.wave += 1;
          this.start()
        } else {
          this.resultShow = true;
          this.exams = [];
          this.examsShow = false;
          this.examsAnswerShow = false;
          alert("終了！")
          return false;
        }
      });
    },
  }
}
</script>
